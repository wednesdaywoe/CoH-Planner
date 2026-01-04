# -*- coding: utf-8 -*-
r"""
City of Heroes: Homecoming - Epic Power Pool Converter
Extracts and converts epic/ancillary power pool data from raw JSON to planner format

Epic pools are:
- Unlocked at level 35
- Archetype-specific (organized by archetype folder)
- Often share display names but have different implementations

Usage:
    python convert_epic.py <epic_pool_name>
    Example: python convert_epic.py blaster_dark_mastery

Input:  C:\Projects\Raw Data Homecoming\powers\epic\{pool_name}\
Output: C:\Projects\CoH-Planner\js\data\epics\{archetype}\{pool_name}.js
"""

import json
import sys
import os
import re
from pathlib import Path

# Paths
RAW_DATA_DIR = Path(r"C:\Projects\Raw Data Homecoming\powers\epic")
OUTPUT_DIR = Path(r"C:\Projects\CoH-Planner\js\data\epics")

# Archetype class name mapping
ARCHETYPE_MAP = {
    '@Class_Blaster': 'blaster',
    '@Class_Controller': 'controller',
    '@Class_Defender': 'defender',
    '@Class_Scrapper': 'scrapper',
    '@Class_Tanker': 'tanker',
    '@Class_Peacebringer': 'peacebringer',
    '@Class_Warshade': 'warshade',
    '@Class_Brute': 'brute',
    '@Class_Stalker': 'stalker',
    '@Class_Dominator': 'dominator',
    '@Class_Corruptor': 'corruptor',
    '@Class_Mastermind': 'mastermind',
    '@Class_Arachnos_Soldier': 'arachnos_soldier',
    '@Class_Arachnos_Widow': 'arachnos_widow',
    '@Class_Sentinel': 'sentinel'
}

def extract_archetype_from_requires(requires_str):
    """Extract archetype from requires expression"""
    for class_name, archetype in ARCHETYPE_MAP.items():
        if class_name in requires_str:
            return archetype
    return None

def extract_archetype_from_pool_name(pool_name):
    """Extract archetype from pool name prefix"""
    # Common prefixes
    prefixes = {
        'blaster_': 'blaster',
        'controller_': 'controller',
        'defender_': 'defender',
        'scrapper_': 'scrapper',
        'tank_': 'tanker',
        'brute_': 'brute',
        'stalker_': 'stalker',
        'dominator_': 'dominator',
        'corruptor_': 'corruptor',
        'mastermind_': 'mastermind',
        'sentinel_': 'sentinel',
        'veat_': 'arachnos_soldier'  # VEAT pools work for both soldier/widow
    }
    
    for prefix, archetype in prefixes.items():
        if pool_name.startswith(prefix):
            return archetype
    
    # Non-prefixed pools are typically for specific archetypes
    # We'll determine from the first power's requires field
    return None

def get_epic_rank(index, available_levels):
    """
    Determine epic power rank based on index and available_level
    Epic pools follow different rules than regular pools
    """
    return index + 1  # Ranks 1-5 (or 1-4 for some pools)

def extract_effects(power_data, power_name):
    """Extract power effects from raw data"""
    effects = {}
    
    # Basic power info
    if power_data.get('accuracy'):
        effects['accuracy'] = power_data['accuracy']
    
    if power_data.get('range'):
        effects['range'] = power_data['range']
    
    if power_data.get('recharge_time'):
        effects['recharge'] = power_data['recharge_time']
    
    if power_data.get('endurance_cost'):
        effects['endurance'] = power_data['endurance_cost']
    
    if power_data.get('activation_time'):
        effects['activationTime'] = power_data['activation_time']
    
    # Effect area
    if power_data.get('effect_area'):
        effects['effectArea'] = power_data['effect_area']
        if power_data.get('radius', 0) > 0:
            effects['radius'] = power_data['radius']
        if power_data.get('arc', 0) > 0:
            effects['arc'] = power_data['arc']
    
    # Extract from effects array
    if 'effects' in power_data:
        for effect_group in power_data['effects']:
            extract_effect_templates(effect_group, effects, power_name)
    
    return effects

def extract_effect_templates(effect_group, effects, power_name):
    """Extract data from effect templates"""
    templates = effect_group.get('templates', [])
    
    for template in templates:
        attribs = template.get('attribs', [])
        aspect = template.get('aspect', '')
        scale = template.get('scale', 0)
        table_name = template.get('table', '')
        duration = template.get('duration', '0 seconds')
        magnitude = template.get('magnitude', 0)
        
        # Damage
        if aspect == 'Absolute' and any(dmg in a for a in attribs for dmg in ['_Dmg']):
            if 'damage' not in effects:
                effects['damage'] = {}
            
            for attr in attribs:
                if '_Dmg' in attr:
                    dmg_type = attr.replace('_Dmg', '').lower()
                    if dmg_type == 'special': 
                        dmg_type = 'special'
                    elif dmg_type == 'negative_energy':
                        dmg_type = 'negative'
                    
                    effects['damage']['type'] = dmg_type.title()
                    effects['damage']['scale'] = scale
                    effects['damage']['table'] = table_name
                    break
        
        # Defense
        elif aspect == 'Defense' or (aspect == 'Current' and 'Base_Defense' in attribs):
            if 'defense' not in effects:
                effects['defense'] = {}
            
            defense_types = {
                'Smashing_Def': 'smashing',
                'Lethal_Def': 'lethal',
                'Fire_Def': 'fire',
                'Cold_Def': 'cold',
                'Energy_Def': 'energy',
                'Negative_Energy_Def': 'negative',
                'Psionic_Def': 'psionic',
                'Toxic_Def': 'toxic'
            }
            
            for attr in attribs:
                if attr in defense_types:
                    def_type = defense_types[attr]
                    effects['defense'][def_type] = {
                        'scale': scale,
                        'table': table_name
                    }
                elif attr == 'Base_Defense':
                    effects['defense']['all'] = {
                        'scale': scale,
                        'table': table_name
                    }
        
        # Resistance
        elif aspect == 'Resistance':
            if 'resistance' not in effects:
                effects['resistance'] = {}
            
            resistance_types = {
                'Smashing_Dmg': 'smashing',
                'Lethal_Dmg': 'lethal',
                'Fire_Dmg': 'fire',
                'Cold_Dmg': 'cold',
                'Energy_Dmg': 'energy',
                'Negative_Energy_Dmg': 'negative',
                'Psionic_Dmg': 'psionic',
                'Toxic_Dmg': 'toxic'
            }
            
            for attr in attribs:
                if attr in resistance_types:
                    res_type = resistance_types[attr]
                    effects['resistance'][res_type] = {
                        'scale': scale,
                        'table': table_name
                    }
        
        # Healing
        elif aspect == 'Absolute' and any('Heal' in a or 'HitPoints' in a for a in attribs):
            if 'healing' not in effects:
                effects['healing'] = {}
            effects['healing']['scale'] = scale
            effects['healing']['table'] = table_name
        
        # Recovery/Regeneration
        elif 'Recovery' in attribs:
            if 'recovery' not in effects:
                effects['recovery'] = {}
            effects['recovery']['scale'] = scale
            effects['recovery']['table'] = table_name
        
        elif 'Regeneration' in attribs:
            if 'regeneration' not in effects:
                effects['regeneration'] = {}
            effects['regeneration']['scale'] = scale
            effects['regeneration']['table'] = table_name
        
        # Mez protection
        elif aspect in ['Cur', 'Current'] and magnitude > 0:
            mez_types = {
                'Held': 'hold',
                'Stunned': 'stun',
                'Sleep': 'sleep',
                'Immobilized': 'immobilize',
                'Terrorized': 'fear',
                'Confused': 'confuse',
                'Knockback': 'knockback',
                'Knockup': 'knockup',
                'Repel': 'repel'
            }
            
            for attr in attribs:
                if attr in mez_types:
                    if 'protection' not in effects:
                        effects['protection'] = {}
                    mez_type = mez_types[attr]
                    effects['protection'][mez_type] = magnitude

def get_allowed_enhancements(power_data):
    """Extract allowed enhancement types"""
    allowed = power_data.get('boosts_allowed', [])
    
    enhancement_map = {
        'Enhance Damage': 'Damage',
        'Enhance Accuracy': 'Accuracy',
        'Enhance Recharge Speed': 'Recharge',
        'Reduce Endurance Cost': 'EnduranceReduction',
        'Enhance Range': 'Range',
        'Enhance Damage Resistance': 'Resistance',
        'Enhance Defense Buff': 'DefenseBuff',
        'Enhance Defense Debuff': 'DefenseDebuff',
        'Enhance Heal': 'Heal',
        'Enhance Endurance Modification': 'EnduranceModification',
        'Enhance ToHit Buff': 'ToHitBuff',
        'Enhance ToHit Debuff': 'ToHitDeb',
        'Enhance Hold': 'Hold',
        'Enhance Stun': 'Stun',
        'Enhance Immobilize': 'Immobilize',
        'Enhance Sleep': 'Sleep',
        'Enhance Slow': 'Slow',
        'Enhance Confuse': 'Confuse',
        'Enhance Fear': 'Fear',
        'Enhance Fly': 'Flight',
        'Enhance Jump': 'Jump',
        'Enhance Run Speed': 'Run',
        'Enhance Knockback': 'Knockback',
        'Enhance Taunt': 'Taunt',
        'Reduce Interrupt Time': 'InterruptReduction'
    }
    
    simplified = []
    for enh in allowed:
        if enh in enhancement_map:
            simplified.append(enhancement_map[enh])
    
    return simplified

def convert_epic_pool(pool_name):
    """Convert a single epic pool"""
    pool_dir = RAW_DATA_DIR / pool_name
    index_file = pool_dir / "index.json"
    
    if not index_file.exists():
        print(f"✗ Epic pool not found: {pool_name}")
        return False
    
    print(f"\n{'='*60}")
    print(f"Converting Epic Pool: {pool_name}")
    print(f"{'='*60}")
    
    # Load pool index
    with open(index_file, 'r', encoding='utf-8') as f:
        pool_index = json.load(f)
    
    # Determine archetype from pool name first
    archetype = extract_archetype_from_pool_name(pool_name)
    
    # If not found from name, check first power's requires field
    if not archetype and pool_index.get('power_names'):
        first_power_name = pool_index['power_names'][0].split('.')[-1].lower() + '.json'
        first_power_file = pool_dir / first_power_name
        if first_power_file.exists():
            with open(first_power_file, 'r', encoding='utf-8') as f:
                first_power = json.load(f)
                requires = first_power.get('requires', '')
                archetype = extract_archetype_from_requires(requires)
    
    if not archetype:
        print(f"⚠ Warning: Could not determine archetype for {pool_name}")
        archetype = 'unknown'
    
    pool_data = {
        'id': pool_name,
        'name': pool_index['display_name'],
        'displayName': pool_index['display_name'],
        'archetype': archetype,
        'description': pool_index.get('display_help', ''),
        'icon': pool_index.get('icon', f'{pool_name}_set.png'),
        'requires': pool_index.get('requires', ''),
        'minLevel': 35,  # Epic pools unlock at 35
        'powers': []
    }
    
    available_levels = pool_index.get('available_level', [])
    power_names = pool_index.get('power_names', [])
    power_display_names = pool_index.get('power_display_names', [])
    power_short_helps = pool_index.get('power_short_helps', [])
    
    print(f"Pool: {pool_data['name']}")
    print(f"Archetype: {archetype}")
    print(f"Powers: {len(power_names)}")
    
    # Process each power
    for i, full_name in enumerate(power_names):
        power_file_name = full_name.split('.')[-1].lower() + '.json'
        power_file = pool_dir / power_file_name
        
        if not power_file.exists():
            print(f"  ⚠ Power file not found: {power_file_name}")
            continue
        
        with open(power_file, 'r', encoding='utf-8') as f:
            power_raw = json.load(f)
        
        display_name = power_display_names[i] if i < len(power_display_names) else power_raw['display_name']
        short_help = power_short_helps[i] if i < len(power_short_helps) else power_raw.get('display_short_help', '')
        available_level = available_levels[i] if i < len(available_levels) else 35
        
        power = {
            'name': display_name,
            'fullName': full_name,
            'rank': get_epic_rank(i, available_levels),
            'available': available_level,
            'description': power_raw.get('display_help', ''),
            'shortHelp': short_help,
            'icon': power_raw.get('icon', ''),
            'powerType': power_raw.get('type', 'Click'),
            'requires': power_raw.get('requires', ''),
            'maxSlots': power_raw.get('max_boosts', 6),
            'allowedEnhancements': get_allowed_enhancements(power_raw),
            'allowedSetCategories': power_raw.get('allowed_boostset_cats', []),
            'effects': extract_effects(power_raw, display_name)
        }
        
        pool_data['powers'].append(power)
        print(f"  [OK] {display_name} (Rank {power['rank']}, Level {available_level})")
    
    # Create output directory with archetype subfolder
    output_archetype_dir = OUTPUT_DIR / archetype
    output_archetype_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate JavaScript file
    output_file = output_archetype_dir / f"{pool_name}.js"
    
    js_content = f"""/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: {pool_data['name']}
 * Archetype: {archetype.replace('_', ' ').title()}
 * 
 * Auto-generated from game data
 * Source: {pool_dir}
 */

const EPIC_{pool_name.upper().replace('-', '_')} = {json.dumps(pool_data, indent=2)};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {{
    EPIC_POOLS['{pool_name}'] = EPIC_{pool_name.upper().replace('-', '_')};
}} else {{
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}}
"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n[DONE] Converted to: {output_file}")
    print(f"  Archetype: {archetype}")
    print(f"  Powers: {len(pool_data['powers'])}")
    
    return True

def main():
    if len(sys.argv) < 2:
        print("Usage: python convert_epic.py <epic_pool_name>")
        print("\nExample:")
        print("  python convert_epic.py blaster_dark_mastery")
        print("  python convert_epic.py munitions_mastery")
        return
    
    pool_name = sys.argv[1].lower().replace(' ', '_')
    
    print("City of Heroes: Homecoming - Epic Pool Converter")
    print("="*60)
    
    # Convert epic pool
    success = convert_epic_pool(pool_name)
    
    if success:
        print("\n" + "="*60)
        print("[SUCCESS] Conversion complete!")
        print("="*60)
    else:
        print("\n[ERROR] Conversion failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
