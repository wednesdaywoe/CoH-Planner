#!/usr/bin/env python3
"""
City of Heroes Powerset Converter
Converts raw JSON power data to JavaScript powerset files
Compatible with the CoH Planner architecture
"""
import json
import sys
from pathlib import Path

# Map raw boost types to our enhancement categories
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
    "Reduce Interrupt Time": "InterruptReduction"
}

def extract_damage_info(effects):
    """Extract all damage info including types, scales, and DoTs"""
    if not effects:
        return None
    
    damage_info = {}
    
    # Map attribute names to damage types
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
    
    # Aggregate damage by type
    instant_damage_by_type = {}
    dot_damage_by_type = {}
    
    for effect in effects:
        if 'templates' in effect:
            for template in effect['templates']:
                attribs = template.get('attribs', [])
                scale = template.get('scale', 0.0)
                duration = template.get('duration', '0 seconds')
                target = template.get('target', '')
                aspect = template.get('aspect', '')
                
                if scale <= 0:
                    continue
                
                # Skip self-buffs
                if target == 'Self' and aspect == 'Strength':
                    continue
                
                # Skip if this has ALL damage types (procs)
                dmg_count = len([a for a in attribs if '_Dmg' in a])
                if dmg_count >= 7:
                    continue
                
                for attr_name, damage_type in damage_type_map.items():
                    if attr_name in attribs:
                        if duration == '0 seconds':
                            # Instant damage
                            if damage_type in instant_damage_by_type:
                                instant_damage_by_type[damage_type] += scale
                            else:
                                instant_damage_by_type[damage_type] = scale
                        else:
                            # DoT
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
    
    return damage_info if damage_info else None

def extract_debuffs(effects, target_type='Foe'):
    """Extract debuff and buff information"""
    stats = {}
    if not effects:
        return None
    
    for effect in effects:
        if 'templates' in effect:
            for template in effect['templates']:
                attribs = template.get('attribs', [])
                duration = template.get('duration', '0 seconds')
                scale = template.get('scale', 0.0)
                magnitude = template.get('magnitude', 0.0)
                table = template.get('table', '')
                
                # Determine buff vs debuff
                is_debuff_table = 'Debuff' in table or 'DeBuff' in table
                is_buff_table = 'Buff' in table
                
                if not is_debuff_table and not is_buff_table:
                    is_debuff_table = (target_type == 'Foe')
                    is_buff_table = (target_type in ['Self', 'Friend', 'Ally'])
                
                # ToHit buff/debuff
                if 'ToHit' in attribs and duration != '0 seconds':
                    if is_debuff_table:
                        stats['tohitDebuff'] = abs(scale)
                    elif is_buff_table:
                        stats['tohitBuff'] = abs(scale)
                
                # Defense buff/debuff
                if any('Defense' in attr for attr in attribs) and duration != '0 seconds':
                    if is_debuff_table:
                        stats['defenseDebuff'] = abs(scale)
                    elif is_buff_table:
                        stats['defenseBuff'] = abs(scale)
                
                # Damage buff/debuff
                if 'Damage' in attribs and duration != '0 seconds':
                    if is_debuff_table:
                        stats['damageDebuff'] = abs(scale)
                    elif is_buff_table:
                        stats['damageBuff'] = abs(scale)
                
                # Stun (magnitude-based)
                if 'Stunned' in attribs or any('Stun' in a for a in attribs):
                    if magnitude > 0:
                        stats['stun'] = magnitude
                        try:
                            dur_value = float(duration.split()[0])
                            if dur_value > 0:
                                stats['stunDuration'] = dur_value
                        except:
                            pass
                
                # Duration
                if duration != '0 seconds' and (scale != 0 or magnitude != 0):
                    try:
                        dur_value = float(duration.split()[0])
                        if dur_value > 0 and 'buffDuration' not in stats:
                            stats['buffDuration'] = dur_value
                    except:
                        pass
    
    return stats if stats else None

def map_enhancements(boosts_allowed):
    """Map raw boost types to our categories"""
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
        "tier": 1,  # Will be calculated
        "maxSlots": power_json.get('max_boosts', 6),
        "allowedEnhancements": map_enhancements(power_json.get('boosts_allowed', [])),
        "allowedSetCategories": power_json.get('allowed_boostset_cats', [])
    }
    
    # Optional descriptive fields
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
    
    # Calculate tier based on available level
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
    
    # Damage and DoT
    damage_info = extract_damage_info(power_json.get('effects', []))
    if damage_info:
        if 'damage' in damage_info:
            effects['damage'] = damage_info['damage']
        if 'dotDamage' in damage_info:
            effects['dotDamage'] = damage_info['dotDamage']
    
    # Buffs/Debuffs/Stats
    target_type = power_json.get('target_type', 'Foe')
    stats = extract_debuffs(power_json.get('effects', []), target_type)
    if stats:
        effects.update(stats)
    
    if effects:
        result['effects'] = effects
    
    return result

def to_js_literal(obj, indent=0):
    """Convert Python dict to JavaScript object literal (unquoted keys)"""
    if obj is None:
        return "null"
    elif isinstance(obj, bool):
        return "true" if obj else "false"
    elif isinstance(obj, (int, float)):
        return str(obj)
    elif isinstance(obj, str):
        # Escape quotes and newlines
        escaped = obj.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        return f'"{escaped}"'
    elif isinstance(obj, list):
        if not obj:
            return "[]"
        items = [to_js_literal(item, indent + 4) for item in obj]
        if all(isinstance(item, str) for item in obj):
            # Simple string array on one line
            return "[" + ", ".join(items) + "]"
        else:
            # Multi-line array
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
    
    # Read all JSON files
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
    
    # Sort by available level, then by name
    powers.sort(key=lambda p: (p['available'], p['name']))
    
    # Determine powerset name and category from directory
    powerset_name = powerset_path.name.replace('_', ' ').title()
    powerset_key = powerset_path.name.replace('_', '-')
    constant_name = powerset_path.name.upper() + "_POWERSET"
    
    # Guess category (you may want to make this more sophisticated)
    category = "Blaster_RANGED"  # Default, should be parameterized
    
    # Generate JavaScript
    output = []
    output.append("/**")
    output.append(f" * {powerset_name} - Blaster Primary")
    output.append(" * Extracted from raw_data_homecoming with updated converter")
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
        # Remove outer braces and add proper indentation
        power_lines = power_js.split('\n')
        output.append("        {")
        for line in power_lines[1:-1]:  # Skip first { and last }
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
    
    # Write to file or print
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(result)
        print(f"Wrote {output_file}")
    else:
        print(result)
    
    print(f"\nConverted {len(powers)} powers")
    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_powerset.py <powerset_directory> [output_file]")
        print("Example: python convert_powerset.py 'C:/Projects/CoH Planner/Raw Data Homecoming/powers/blaster_ranged/archery' archery.js")
        sys.exit(1)
    
    powerset_dir = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    convert_powerset(powerset_dir, output_file)
