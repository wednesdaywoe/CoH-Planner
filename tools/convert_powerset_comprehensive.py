#!/usr/bin/env python3
"""
City of Heroes Powerset Converter - COMPREHENSIVE VERSION
Extracts ALL power properties: damage, buffs, debuffs, armor, heals, control, etc.
"""
import json
import sys
from pathlib import Path

# Map raw boost types to enhancement categories
BOOST_MAP = {
    "Enhance Damage": "Damage",
    "Enhance Accuracy": "Accuracy",
    "Enhance Recharge Speed": "Recharge",
    "Reduce Endurance Cost": "EnduranceReduction",
    "Enhance Range": "Range",
    "Enhance Healing": "Healing",
    "Enhance Defense Buff": "DefenseBuff",
    "Enhance Resistance Buff": "ResistanceBuff",
    "Enhance ToHit Buff": "ToHitBuff",
    "Enhance Slow Movement": "Slow",
    "Enhance Hold": "Hold",
    "Enhance Immobilize": "Immobilize",
    "Enhance Stun": "Disorient",
    "Enhance Sleep": "Sleep",
    "Enhance Confused": "Confuse",
    "Enhance Fear": "Fear",
    "Enhance Knockback": "Knockback",
    "Reduce Interrupt Time": "InterruptReduction",
    "Enhance Defense Debuff": "DefenseDebuff",
    "Enhance ToHit Debuff": "ToHitDebuff",
    "Enhance Resistance Debuff": "ResistanceDebuff"
}

def extract_damage_info(effects):
    """Extract all damage info including types, scales, and DoTs"""
    if not effects:
        return {}
    
    damage_info = {}
    damage_type_map = {
        'Smashing_Dmg': 'Smashing',
        'Lethal_Dmg': 'Lethal',
        'Fire_Dmg': 'Fire',
        'Cold_Dmg': 'Cold',
        'Energy_Dmg': 'Energy',
        'Negative_Energy_Dmg': 'Negative',
        'Psionic_Dmg': 'Psionic',
        'Toxic_Dmg': 'Toxic'
    }
    
    instant_damage_by_type = {}
    dot_damage_by_type = {}
    
    for effect in effects:
        if 'templates' not in effect:
            continue
            
        for template in effect['templates']:
            attribs = template.get('attribs', [])
            scale = template.get('scale', 0.0)
            duration = template.get('duration', '0 seconds')
            target = template.get('target', '')
            aspect = template.get('aspect', '')
            
            if scale <= 0:
                continue
            
            # Skip self-buffs that aren't damage
            if target == 'Self' and aspect == 'Strength':
                continue
            
            # Skip if this has ALL damage types (proc effects)
            dmg_count = len([a for a in attribs if '_Dmg' in a])
            if dmg_count >= 7:
                continue
            
            for attr_name, damage_type in damage_type_map.items():
                if attr_name in attribs:
                    if duration == '0 seconds':
                        instant_damage_by_type[damage_type] = instant_damage_by_type.get(damage_type, 0) + scale
                    else:
                        try:
                            dur_value = float(duration.split()[0])
                            app_period = template.get('application_period', 2.0)
                            if app_period <= 0:
                                app_period = 2.0
                            ticks = int(dur_value / app_period) if dur_value > 0 else 0
                            if ticks > 0:
                                if damage_type in dot_damage_by_type:
                                    dot_damage_by_type[damage_type]['scale'] += scale
                                else:
                                    dot_damage_by_type[damage_type] = {
                                        'scale': scale,
                                        'ticks': ticks
                                    }
                        except:
                            pass
    
    # Process instant damage
    if instant_damage_by_type:
        instant_damages = [{'type': t, 'scale': s} for t, s in instant_damage_by_type.items()]
        instant_damages.sort(key=lambda x: x['scale'], reverse=True)
        
        if len(instant_damages) == 1:
            damage_info['damage'] = {
                'type': instant_damages[0]['type'],
                'scale': instant_damages[0]['scale']
            }
        else:
            damage_info['damage'] = {
                'types': instant_damages,
                'scale': sum(d['scale'] for d in instant_damages)
            }
    
    # Process DoT damage
    if dot_damage_by_type:
        dot_damages = [{'type': t, 'scale': v['scale'], 'ticks': v['ticks']} 
                       for t, v in dot_damage_by_type.items()]
        dot_damages.sort(key=lambda x: x['scale'], reverse=True)
        
        if len(dot_damages) == 1:
            damage_info['dotDamage'] = {
                'type': dot_damages[0]['type'],
                'scale': dot_damages[0]['scale'],
                'ticks': dot_damages[0]['ticks']
            }
        else:
            damage_info['dotDamage'] = {
                'types': dot_damages
            }
    
    return damage_info

def extract_all_effects(effects, target_type='Foe'):
    """Extract ALL effects: buffs, debuffs, healing, armor, control, etc."""
    if not effects:
        return {}
    
    result = {}
    
    for effect in effects:
        if 'templates' not in effect:
            continue
            
        for template in effect['templates']:
            attribs = template.get('attribs', [])
            duration = template.get('duration', '0 seconds')
            scale = template.get('scale', 0.0)
            magnitude = template.get('magnitude', 0.0)
            table = template.get('table', '')
            target = template.get('target', '')
            aspect = template.get('aspect', '')
            
            # Determine if this is a buff (to self/ally) or debuff (to enemy)
            is_debuff = 'Debuff' in table or 'DeBuff' in table or target in ['Foe', 'AnyAffected']
            is_buff = 'Buff' in table or target in ['Self', 'Friend', 'Ally']
            
            # If table doesn't specify, use target_type from power
            if not is_debuff and not is_buff:
                is_debuff = (target_type == 'Foe')
                is_buff = (target_type in ['Self', 'Friend', 'Ally'])
            
            # Parse duration
            dur_value = 0
            if duration != '0 seconds':
                try:
                    dur_value = float(duration.split()[0])
                except:
                    pass
            
            # ===== RESISTANCE =====
            # CRITICAL for powers like Tar Patch
            if aspect == 'Resistance' or any('Res_' in attr or 'Resistance' in attr for attr in attribs):
                if is_debuff and scale != 0:
                    result['resistanceDebuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
                elif is_buff and scale > 0:
                    result['resistanceBuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
            
            # ===== DEFENSE =====
            if any('Defense' in attr for attr in attribs):
                if is_debuff and scale != 0:
                    result['defenseDebuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
                elif is_buff and scale > 0:
                    result['defenseBuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
            
            # ===== TO-HIT =====
            if 'ToHit' in attribs:
                if is_debuff and scale != 0:
                    result['tohitDebuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
                elif is_buff and scale > 0:
                    result['tohitBuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
            
            # ===== DAMAGE BUFF/DEBUFF =====
            if 'Damage' in attribs and duration != '0 seconds':
                if is_debuff and scale != 0:
                    result['damageDebuff'] = abs(scale)
                elif is_buff and scale > 0:
                    result['damageBuff'] = abs(scale)
            
            # ===== RECHARGE =====
            if 'RechargeTime' in attribs or 'Recharge' in attribs:
                if is_debuff and scale != 0:
                    result['rechargeDebuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
                elif is_buff and scale > 0:
                    result['rechargeBuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
            
            # ===== MOVEMENT SPEED =====
            if any('Speed' in attr or 'Fly' in attr or 'Jump' in attr for attr in attribs):
                if is_debuff and scale < 0:
                    result['movementDebuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
                elif is_buff and scale > 0:
                    result['movementBuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
            
            # ===== HEALING =====
            if 'Healing' in attribs or 'Hitpoints' in attribs:
                if scale > 0 and target in ['Self', 'Friend', 'Ally']:
                    result['healing'] = abs(scale)
            
            # ===== REGENERATION =====
            if 'Regeneration' in attribs or 'Regen' in attribs:
                if is_buff and scale > 0:
                    result['regenerationBuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
                elif is_debuff and scale < 0:
                    result['regenerationDebuff'] = abs(scale)
            
            # ===== RECOVERY (Endurance) =====
            if 'Recovery' in attribs or 'Endurance' in attribs:
                if is_buff and scale > 0 and duration != '0 seconds':
                    result['recoveryBuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
                elif is_debuff and scale < 0 and duration != '0 seconds':
                    result['recoveryDebuff'] = abs(scale)
            
            # ===== MAX HP =====
            if 'MaxHitpoints' in attribs or 'MaxHealth' in attribs:
                if is_buff and scale > 0:
                    result['maxHPBuff'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
            
            # ===== ABSORB =====
            if 'Absorb' in attribs:
                if scale > 0:
                    result['absorb'] = abs(scale)
                    if dur_value > 0 and 'duration' not in result:
                        result['duration'] = dur_value
            
            # ===== CONTROL EFFECTS (Magnitude-based) =====
            # Hold
            if any('Hold' in attr or 'Held' in attr for attr in attribs):
                if magnitude > 0:
                    result['hold'] = magnitude
                    if dur_value > 0:
                        result['holdDuration'] = dur_value
            
            # Stun
            if any('Stun' in attr for attr in attribs):
                if magnitude > 0:
                    result['stun'] = magnitude
                    if dur_value > 0:
                        result['stunDuration'] = dur_value
            
            # Immobilize
            if any('Immob' in attr for attr in attribs):
                if magnitude > 0:
                    result['immobilize'] = magnitude
                    if dur_value > 0:
                        result['immobilizeDuration'] = dur_value
            
            # Sleep
            if any('Sleep' in attr for attr in attribs):
                if magnitude > 0:
                    result['sleep'] = magnitude
                    if dur_value > 0:
                        result['sleepDuration'] = dur_value
            
            # Confuse
            if any('Confus' in attr for attr in attribs):
                if magnitude > 0:
                    result['confuse'] = magnitude
                    if dur_value > 0:
                        result['confuseDuration'] = dur_value
            
            # Fear
            if any('Fear' in attr or 'Afraid' in attr for attr in attribs):
                if magnitude > 0:
                    result['fear'] = magnitude
                    if dur_value > 0:
                        result['fearDuration'] = dur_value
            
            # Knockback/Knockdown
            if any('Knock' in attr for attr in attribs):
                if magnitude > 0:
                    result['knockback'] = magnitude
            
            # ===== STATUS PROTECTION =====
            # This is for armor powers that protect against mez
            if any('Protection' in attr for attr in attribs):
                if magnitude > 0:
                    # Determine which protection type
                    if 'Hold' in str(attribs):
                        result['holdProtection'] = magnitude
                    elif 'Stun' in str(attribs):
                        result['stunProtection'] = magnitude
                    elif 'Immob' in str(attribs):
                        result['immobilizeProtection'] = magnitude
                    elif 'Sleep' in str(attribs):
                        result['sleepProtection'] = magnitude
                    elif 'Confus' in str(attribs):
                        result['confuseProtection'] = magnitude
                    elif 'Fear' in str(attribs):
                        result['fearProtection'] = magnitude
                    elif 'Knock' in str(attribs):
                        result['knockbackProtection'] = magnitude
    
    return result

def map_enhancements(boosts_allowed):
    """Map raw boost types to enhancement categories"""
    mapped = []
    for boost in boosts_allowed:
        if boost in BOOST_MAP:
            mapped.append(BOOST_MAP[boost])
    return mapped if mapped else ["Damage", "Accuracy", "Recharge", "EnduranceReduction"]

def convert_power(power_json):
    """Convert a single power from raw format to our format"""
    # Handle available_level (might be int or list)
    available_level = power_json.get('available_level', 1)
    if isinstance(available_level, list):
        available_level = available_level[0] if available_level else 1
    
    result = {
        "name": power_json.get('display_name', power_json.get('name', 'Unknown')),
        "available": available_level,
        "tier": 1,
        "maxSlots": power_json.get('max_boosts', 6),
        "allowedEnhancements": map_enhancements(power_json.get('boosts_allowed', [])),
        "allowedSetCategories": power_json.get('allowed_boostset_cats', [])
    }
    
    # Descriptive fields
    if power_json.get('display_help'):
        result['description'] = power_json['display_help']
    
    if power_json.get('display_short_help'):
        result['shortHelp'] = power_json['display_short_help']
    
    if power_json.get('icon'):
        result['icon'] = power_json['icon']
    
    if power_json.get('type'):
        result['powerType'] = power_json['type']
    
    # Targeting info
    if power_json.get('target_type'):
        result['targetType'] = power_json['target_type']
    
    if power_json.get('effect_area'):
        result['effectArea'] = power_json['effect_area']
    
    if power_json.get('max_targets_hit', 0) > 0:
        result['maxTargets'] = power_json['max_targets_hit']
    
    if power_json.get('arc', 0) > 0:
        result['arc'] = power_json['arc']
    
    if power_json.get('radius', 0) > 0:
        result['radius'] = power_json['radius']
    
    # Calculate tier
    level = result['available']
    if level == 0 or level == 1:
        result['tier'] = 1
    elif level <= 4:
        result['tier'] = 2
    elif level <= 10:
        result['tier'] = 3
    elif level <= 20:
        result['tier'] = 4
    else:
        result['tier'] = 5
    
    # Effects
    effects = {}
    
    # Basic power stats
    if power_json.get('accuracy', 0) != 0:
        effects['accuracy'] = power_json['accuracy']
    
    if power_json.get('range', 0) != 0:
        effects['range'] = power_json['range']
    
    if power_json.get('recharge_time', 0) != 0:
        effects['recharge'] = power_json['recharge_time']
    
    if power_json.get('endurance_cost', 0) != 0:
        effects['endurance'] = power_json['endurance_cost']
    
    if power_json.get('activation_time', 0) != 0:
        effects['cast'] = power_json['activation_time']
    
    # Extract damage
    damage_info = extract_damage_info(power_json.get('effects', []))
    effects.update(damage_info)
    
    # Extract ALL other effects
    target_type = power_json.get('target_type', 'Foe')
    all_effects = extract_all_effects(power_json.get('effects', []), target_type)
    effects.update(all_effects)
    
    if effects:
        result['effects'] = effects
    
    return result

def to_js_literal(obj, indent=0):
    """Convert Python dict to JavaScript object literal"""
    if obj is None:
        return "null"
    elif isinstance(obj, bool):
        return "true" if obj else "false"
    elif isinstance(obj, (int, float)):
        return str(obj)
    elif isinstance(obj, str):
        escaped = obj.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        return f'"{escaped}"'
    elif isinstance(obj, list):
        if not obj:
            return "[]"
        items = [to_js_literal(item, indent + 4) for item in obj]
        if all(isinstance(item, str) for item in obj):
            return "[" + ", ".join(items) + "]"
        else:
            spaces = " " * (indent + 4)
            inner = (",\n" + spaces).join(items)
            return "[\n" + spaces + inner + "\n" + (" " * indent) + "]"
    elif isinstance(obj, dict):
        if not obj:
            return "{}"
        spaces = " " * (indent + 4)
        lines = []
        for key, value in obj.items():
            val_str = to_js_literal(value, indent + 4)
            lines.append(f"{spaces}{key}: {val_str}")
        return "{\n" + ",\n".join(lines) + "\n" + (" " * indent) + "}"
    else:
        return str(obj)

def convert_powerset(powerset_dir, output_file=None):
    """Convert an entire powerset directory to a JavaScript file"""
    powerset_path = Path(powerset_dir)
    
    if not powerset_path.exists():
        print(f"Error: Directory not found: {powerset_dir}")
        return
    
    json_files = sorted(powerset_path.glob("*.json"))
    
    if not json_files:
        print(f"Error: No JSON files found in {powerset_dir}")
        return
    
    print(f"Found {len(json_files)} power files")
    
    powers = []
    for json_file in json_files:
        with open(json_file, 'r', encoding='utf-8') as f:
            power_data = json.load(f)
            converted = convert_power(power_data)
            powers.append(converted)
    
    powers.sort(key=lambda p: (p['available'], p['name']))
    
    powerset_name = powerset_path.name.replace('_', ' ').title()
    powerset_key = powerset_path.name.replace('_', '-')
    constant_name = powerset_path.name.upper() + "_POWERSET"
    
    category = "UNKNOWN"  # Should be set per powerset type
    
    output = []
    output.append("/**")
    output.append(f" * {powerset_name}")
    output.append(" * Extracted from raw_data_homecoming with comprehensive converter")
    output.append(" */")
    output.append("")
    output.append(f"const {constant_name} = {{")
    output.append(f'    name: "{powerset_name}",')
    output.append(f'    category: "{category}",')
    output.append(f'    description: "{powerset_name} powerset",')
    output.append(f'    icon: "{powerset_key}_set.png",')
    output.append("    powers: [")
    
    for i, power in enumerate(powers):
        is_last = (i == len(powers) - 1)
        power_js = to_js_literal(power, 8)
        power_lines = power_js.split('\n')
        output.append("        {")
        for line in power_lines[1:-1]:
            output.append(line)
        output.append("        }" + ("" if is_last else ","))
    
    output.append("    ]")
    output.append("};")
    output.append("")
    output.append("// Register to POWERSETS")
    output.append("if (typeof POWERSETS !== 'undefined') {")
    output.append(f"    POWERSETS['{powerset_key}'] = {constant_name};")
    output.append("} else if (typeof window !== 'undefined') {")
    output.append(f"    window.{constant_name} = {constant_name};")
    output.append("}")
    
    result = "\n".join(output)
    
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(result)
        print(f"Wrote {output_file}")
    else:
        print(result)
    
    print(f"\nConverted {len(powers)} powers")
    print("\nExtracted effects summary:")
    all_effect_types = set()
    for power in powers:
        if 'effects' in power:
            all_effect_types.update(power['effects'].keys())
    print(f"Effect types found: {', '.join(sorted(all_effect_types))}")
    
    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_powerset_comprehensive.py <powerset_directory> [output_file]")
        print("Example: python convert_powerset_comprehensive.py '../Raw Data Homecoming/powers/defender_buff/dark_miasma' dark-miasma.js")
        sys.exit(1)
    
    powerset_dir = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    convert_powerset(powerset_dir, output_file)
