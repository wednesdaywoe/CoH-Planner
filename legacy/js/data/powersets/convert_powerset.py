#!/usr/bin/env python3
"""
City of Heroes Powerset Converter
Converts raw JSON power data to JavaScript powerset files
Compatible with the CoH Planner architecture
"""
import json
import sys
from pathlib import Path

# Global archetype modifier tables cache
ARCHETYPE_TABLES = {}

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

def load_archetype_tables(tables_dir, archetype):
    """Load archetype modifier tables from the tables directory"""
    global ARCHETYPE_TABLES
    
    # Use cached if already loaded
    if archetype in ARCHETYPE_TABLES:
        return ARCHETYPE_TABLES[archetype]
    
    tables_path = Path(tables_dir)
    archetype_file = tables_path / f"{archetype}.json"
    
    if not archetype_file.exists():
        print(f"Warning: Archetype table not found: {archetype_file}")
        return None
    
    try:
        with open(archetype_file, 'r', encoding='utf-8') as f:
            tables_data = json.load(f)
            ARCHETYPE_TABLES[archetype] = tables_data.get('named_tables', {})
            return ARCHETYPE_TABLES[archetype]
    except Exception as e:
        print(f"Error loading archetype tables: {e}")
        return None

def apply_archetype_modifier(scale, table_name, archetype, level, tables_dir):
    """Apply archetype modifier to a scale value"""
    if not archetype or not table_name:
        return scale
    
    # Load tables if needed
    tables = load_archetype_tables(tables_dir, archetype)
    if not tables:
        return scale
    
    # Get the specific modifier table (case-insensitive lookup)
    modifier_table = None
    table_name_lower = table_name.lower()
    for key, value in tables.items():
        if key.lower() == table_name_lower:
            modifier_table = value
            break
    
    if not modifier_table:
        # Silently return scale without modifier if table not found
        # (Many tables like "Melee_Ones" are just 1.0 multipliers anyway)
        return scale
    
    # Index into table (0-indexed, so level-1)
    # Clamp level to valid range
    level_idx = max(0, min(len(modifier_table) - 1, level - 1))
    modifier = modifier_table[level_idx]
    
    # Apply modifier
    return scale * modifier

def extract_mez_protection(effects, archetype, level, tables_dir):
    """Extract mez protection information with archetype modifiers applied"""
    if not effects:
        return None
    
    protection = {}
    
    # Mez attribute mapping
    mez_attrs = {
        'Held': 'hold',
        'Stunned': 'stun',
        'Sleep': 'sleep',
        'Immobilized': 'immobilize',
        'Terrorized': 'fear',
        'Confused': 'confuse'
    }
    
    for effect in effects:
        if 'templates' not in effect:
            continue
        
        for template in effect['templates']:
            aspect = template.get('aspect', '')
            target = template.get('target', '')
            
            # Look for mez protection (negative magnitude on self)
            if aspect == 'Current' and target == 'Self':
                attribs = template.get('attribs', [])
                scale = template.get('scale', 0.0)
                table_name = template.get('table', '')
                
                # Must have a negative scale for protection
                if scale >= 0:
                    continue
                
                # Apply archetype modifier if we have a table
                if table_name and archetype:
                    final_magnitude = apply_archetype_modifier(
                        scale, table_name, archetype, level, tables_dir
                    )
                else:
                    final_magnitude = scale
                
                # Extract protections
                for attr, prot_name in mez_attrs.items():
                    if attr in attribs:
                        # Store as positive magnitude (remove negative sign)
                        protection[prot_name] = abs(final_magnitude)
    
    return protection if protection else None

def extract_typed_defense(effects, archetype, level, tables_dir):
    """Extract typed defense/resistance with archetype modifiers"""
    if not effects:
        return None
    
    typed_defense = {}
    typed_resistance = {}
    
    # Damage type mapping
    damage_types = {
        'Smashing_Dmg': 'smashing',
        'Lethal_Dmg': 'lethal',
        'Fire_Dmg': 'fire',
        'Cold_Dmg': 'cold',
        'Energy_Dmg': 'energy',
        'Negative_Energy_Dmg': 'negative',
        'Psionic_Dmg': 'psionic',
        'Toxic_Dmg': 'toxic'
    }
    
    for effect in effects:
        if 'templates' not in effect:
            continue
        
        for template in effect['templates']:
            aspect = template.get('aspect', '')
            target = template.get('target', '')
            attribs = template.get('attribs', [])
            scale = template.get('scale', 0.0)
            table_name = template.get('table', '')
            
            # Skip if not self-targeted
            if target != 'Self':
                continue
            
            # Apply archetype modifier if applicable
            if table_name and archetype:
                final_value = apply_archetype_modifier(
                    scale, table_name, archetype, level, tables_dir
                )
            else:
                final_value = scale
            
            # Defense
            if aspect == 'Strength' and 'Defense' in attribs:
                for dmg_attr, dmg_type in damage_types.items():
                    if dmg_attr in attribs:
                        typed_defense[dmg_type] = final_value
            
            # Resistance
            if aspect == 'Resistance':
                for dmg_attr, dmg_type in damage_types.items():
                    if dmg_attr in attribs:
                        typed_resistance[dmg_type] = final_value
    
    result = {}
    if typed_defense:
        result['defense'] = typed_defense
    if typed_resistance:
        result['resistance'] = typed_resistance
    
    return result if result else None

def extract_debuff_resistance(effects, archetype, level, tables_dir):
    """Extract resistance to debuffs (not damage resistance)"""
    if not effects:
        return None
    
    debuff_res = {}
    
    # Map attribute names to debuff resistance types
    debuff_attrs = {
        'ToHit': 'tohit',
        'Base_Defense': 'defense',
        'Defense': 'defense',
        'RechargeTime': 'recharge',
        'Recharge': 'recharge',
        'RunningSpeed': 'movement',
        'FlyingSpeed': 'movement',
        'JumpingSpeed': 'movement',
        'JumpHeight': 'movement',
        'Regeneration': 'regeneration',
        'Recovery': 'recovery',
        'Endurance': 'endurance',
        'MaxEndurance': 'endurance',
        'Heal': 'healing',
        'Damage': 'damage'
    }
    
    # Damage type attributes (NOT debuff resistance)
    damage_attrs = {'Smashing_Dmg', 'Lethal_Dmg', 'Fire_Dmg', 'Cold_Dmg', 
                    'Energy_Dmg', 'Negative_Energy_Dmg', 'Psionic_Dmg', 'Toxic_Dmg'}
    
    # Mez attributes (handled by mez protection extraction)
    mez_attrs = {'Held', 'Stunned', 'Sleep', 'Immobilized', 'Terrorized', 'Confused'}
    
    for effect in effects:
        if 'templates' not in effect:
            continue
        
        for template in effect['templates']:
            aspect = template.get('aspect', '')
            target = template.get('target', '')
            attribs = template.get('attribs', [])
            scale = template.get('scale', 0.0)
            table_name = template.get('table', '')
            
            # Must be resistance aspect on self with positive scale
            if aspect != 'Resistance' or target != 'Self' or scale <= 0:
                continue
            
            # Skip if it's damage resistance
            if any(attr in damage_attrs for attr in attribs):
                continue
            
            # Skip if it's mez resistance (already handled by protection)
            if any(attr in mez_attrs for attr in attribs):
                continue
            
            # Apply archetype modifier if available
            if table_name and archetype:
                final_value = apply_archetype_modifier(
                    scale, table_name, archetype, level, tables_dir
                )
            else:
                final_value = scale
            
            # Extract debuff resistances
            for attr, res_type in debuff_attrs.items():
                if attr in attribs:
                    # Aggregate if we see the same type multiple times
                    if res_type in debuff_res:
                        debuff_res[res_type] = max(debuff_res[res_type], final_value)
                    else:
                        debuff_res[res_type] = final_value
    
    return debuff_res if debuff_res else None

def extract_healing(effects, archetype, level, tables_dir):
    """Extract healing information with archetype modifiers"""
    if not effects:
        return None
    
    healing_info = {}
    
    for effect in effects:
        if 'templates' not in effect:
            continue
        
        for template in effect['templates']:
            aspect = template.get('aspect', '')
            target = template.get('target', '')
            attribs = template.get('attribs', [])
            scale = template.get('scale', 0.0)
            table_name = template.get('table', '')
            stack_type = template.get('stack', '')
            
            # Look for healing (Absolute aspect on Self with Heal_Dmg attribute)
            if aspect == 'Absolute' and target == 'Self' and 'Heal_Dmg' in attribs:
                # Apply archetype modifier if available
                if table_name and archetype:
                    final_value = apply_archetype_modifier(
                        scale, table_name, archetype, level, tables_dir
                    )
                else:
                    final_value = scale
                
                healing_info['scale'] = final_value
                
                # Check if it stacks (per-target healing like Dark Regeneration)
                if stack_type == 'Stack':
                    healing_info['perTarget'] = True
                
                break
    
    return healing_info if healing_info else None

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

def convert_power(power_json, archetype=None, level=50, tables_dir=None):
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
    tier_level = result['available']
    if tier_level == 0 or tier_level == 1:
        result['tier'] = 1
    elif tier_level <= 4:
        result['tier'] = 2
    elif tier_level <= 10:
        result['tier'] = 3
    elif tier_level <= 20:
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
    
    # Archetype-specific effects if tables available
    if tables_dir and archetype:
        # Mez Protection
        protection = extract_mez_protection(
            power_json.get('effects', []), 
            archetype, 
            level, 
            tables_dir
        )
        if protection:
            effects['protection'] = protection
        
        # Typed defense/resistance
        typed_stats = extract_typed_defense(
            power_json.get('effects', []),
            archetype,
            level,
            tables_dir
        )
        if typed_stats:
            effects.update(typed_stats)
        
        # Debuff Resistance
        debuff_res = extract_debuff_resistance(
            power_json.get('effects', []),
            archetype,
            level,
            tables_dir
        )
        if debuff_res:
            effects['debuffResistance'] = debuff_res
        
        # Healing
        healing_info = extract_healing(
            power_json.get('effects', []),
            archetype,
            level,
            tables_dir
        )
        if healing_info:
            effects['healing'] = healing_info
    
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

def convert_powerset(powerset_dir, output_file=None, archetype=None, level=50, tables_dir=None):
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
    
    # Auto-detect archetype from first power if not specified
    if not archetype:
        with open(json_files[0], 'r', encoding='utf-8') as f:
            first_power = json.load(f)
            archetypes = first_power.get('archetypes', [])
            if archetypes:
                archetype = archetypes[0]
                print(f"Auto-detected archetype: {archetype}")
    
    powers = []
    for json_file in json_files:
        with open(json_file, 'r', encoding='utf-8') as f:
            power_data = json.load(f)
            converted = convert_power(power_data, archetype, level, tables_dir)
            powers.append(converted)
    
    # Sort by available level, then by name
    powers.sort(key=lambda p: (p['available'], p['name']))
    
    # Determine powerset name and category from directory
    powerset_name = powerset_path.name.replace('_', ' ').title()
    powerset_key = powerset_path.name.replace('_', '-')
    
    # Include archetype in constant name for uniqueness
    if archetype:
        constant_name = f"{archetype.upper()}_{powerset_path.name.replace('-', '_').upper()}_POWERSET"
        registration_key = f"{archetype}/{powerset_key}"
    else:
        constant_name = powerset_path.name.replace('-', '_').upper() + "_POWERSET"
        registration_key = powerset_key
    
    # Guess category (should be parameterized)
    category = "Unknown"
    
    # Generate JavaScript
    output = []
    output.append("/**")
    output.append(f" * {powerset_name}")
    output.append(f" * Character Level: {level}")
    if archetype:
        output.append(f" * Archetype: {archetype}")
    output.append(" * Extracted from raw_data_homecoming with archetype modifiers applied")
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
    output.append(f"    POWERSETS['{registration_key}'] = {constant_name};")
    output.append("} else if (typeof window !== 'undefined') {")
    output.append(f"    window.{constant_name} = {constant_name};")
    output.append("}")
    
    result = "\n".join(output)
    
    # Write to file or print
    if output_file:
        # Ensure output directory exists
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(result)
        print(f"Wrote {output_file}")
    else:
        print(result)
    
    print(f"\nConverted {len(powers)} powers at level {level}")
    if archetype:
        print(f"Applied {archetype} archetype modifiers")
    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_powerset.py <powerset_directory> [output_file] [--archetype=<at>] [--level=<level>] [--tables=<tables_dir>]")
        print("Example: python convert_powerset.py 'C:/Raw Data/powers/tanker_defense/dark_armor' dark-armor.js --archetype=tanker --level=50 --tables='C:/Raw Data/tables'")
        sys.exit(1)
    
    powerset_dir = sys.argv[1]
    output_file = None
    archetype = None
    level = 50
    tables_dir = None
    
    # Parse arguments
    for arg in sys.argv[2:]:
        if arg.startswith('--archetype='):
            archetype = arg.split('=', 1)[1]
        elif arg.startswith('--level='):
            level = int(arg.split('=', 1)[1])
        elif arg.startswith('--tables='):
            tables_dir = arg.split('=', 1)[1]
        elif not arg.startswith('--'):
            output_file = arg
    
    convert_powerset(powerset_dir, output_file, archetype, level, tables_dir)
