#!/usr/bin/env python3
"""Parse incarnate power JSON files and generate incarnate-power-info.js"""

import json
import os
import re
from pathlib import Path

# Mapping of file prefixes to tier names - different for each slot
TIER_MAPPINGS = {
    'alpha': {
        '_boost': 't1',
        '_core_boost': 't2_core',
        '_radial_boost': 't2_radial',
        '_core_paragon': 't3_core_1',
        '_radial_paragon': 't3_radial_1',
        '_partial_core_revamp': 't3_core_2',
        '_partial_radial_revamp': 't3_radial_2',
        '_total_core_revamp': 't4_core',
        '_total_radial_revamp': 't4_radial'
    },
    'hybrid': {
        '_genome': 't1',
        '_core_genome': 't2_core',
        '_radial_genome': 't2_radial',
        '_core_embodiment': 't3_core_1',
        '_radial_embodiment': 't3_radial_1',
        '_partial_core_graft': 't3_core_2',
        '_partial_radial_graft': 't3_radial_2',
        '_total_core_graft': 't4_core',
        '_total_radial_graft': 't4_radial'
    },
    'interface': {
        '_interface': 't1',
        '_core_interface': 't2_core',
        '_radial_interface': 't2_radial',
        '_core_flawless_interface': 't3_core_1',
        '_radial_flawless_interface': 't3_radial_1',
        '_partial_core_conversion': 't3_core_2',
        '_partial_radial_conversion': 't3_radial_2',
        '_total_core_conversion': 't4_core',
        '_total_radial_conversion': 't4_radial'
    },
    'judgement': {
        '_judgement': 't1',
        '_core_judgement': 't2_core',
        '_radial_judgement': 't2_radial',
        '_core_final_judgement': 't3_core_1',
        '_radial_final_judgement': 't3_radial_1',
        '_partial_core_judgement': 't3_core_2',
        '_partial_radial_judgement': 't3_radial_2',
        '_total_core_judgement': 't4_core',
        '_total_radial_judgement': 't4_radial'
    },
    'destiny': {
        '_invocation': 't1',
        '_core_invocation': 't2_core',
        '_radial_invocation': 't2_radial',
        '_core_epiphany': 't3_core_1',
        '_radial_epiphany': 't3_radial_1',
        '_partial_core_invocation': 't3_core_2',
        '_partial_radial_invocation': 't3_radial_2',
        '_total_core_invocation': 't4_core',
        '_total_radial_invocation': 't4_radial'
    },
    'lore': {
        '_ally': 't1',
        '_core_ally': 't2_core',
        '_radial_ally': 't2_radial',
        '_core_superior_ally': 't3_core_1',
        '_radial_superior_ally': 't3_radial_1',
        '_partial_core_improved_ally': 't3_core_2',
        '_partial_radial_improved_ally': 't3_radial_2',
        '_total_core_improved_ally': 't4_core',
        '_total_radial_improved_ally': 't4_radial'
    }
}

def extract_stat_from_help(help_text):
    """Extract stat information from display_help text"""
    if not help_text:
        return None
    
    # Remove HTML tags
    help_text = re.sub(r'<[^>]+>', '', help_text)
    help_text = help_text.strip()
    
    return help_text

def parse_power_file(filepath):
    """Parse a single incarnate power JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return {
            'name': data.get('display_name', 'Unknown'),
            'desc': extract_stat_from_help(data.get('display_help', '')),
            'short': data.get('display_short_help', ''),
        }
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        return None

def parse_slot_folder(slot_name, folder_path):
    """Parse all power files in a slot folder"""
    powers = {}
    
    if not os.path.isdir(folder_path):
        print(f"Folder not found: {folder_path}")
        return powers
    
    # Get the tier mapping for this slot
    tier_mapping = TIER_MAPPINGS.get(slot_name, {})
    if not tier_mapping:
        print(f"Warning: No tier mapping for slot '{slot_name}'")
        return powers
    
    # Get all JSON files
    json_files = sorted([f for f in os.listdir(folder_path) if f.endswith('.json')])
    
    # Sort suffixes by length (longest first) to match longer suffixes before shorter ones
    sorted_suffixes = sorted(tier_mapping.items(), key=lambda x: len(x[0]), reverse=True)
    
    for json_file in json_files:
        # Skip index.json
        if json_file == 'index.json':
            continue
        
        filepath = os.path.join(folder_path, json_file)
        
        # Extract power name and tier
        base_name = json_file.replace('.json', '')
        
        # Find matching tier suffix
        tier = None
        power_name = base_name
        
        for suffix, tier_id in sorted_suffixes:
            if base_name.endswith(suffix):
                tier = tier_id
                power_name = base_name[:-len(suffix)]
                break
        
        if not tier:
            print(f"Warning: Could not determine tier for {json_file}")
            continue
        
        # Parse the file
        power_data = parse_power_file(filepath)
        if not power_data:
            continue
        
        # Add to powers dict
        if power_name not in powers:
            powers[power_name] = {}
        
        powers[power_name][tier] = {
            'desc': power_data['desc'],
            'targets': 'Self',
            'range': '0',
            'radius': '0',
            'arc': '0',
            'effects': [],
            'baseStats': {}
        }
    
    return powers

def main():
    base_path = r"C:\Projects\CoH-Planner\incarnate_raw_data"
    
    slots = {
        'alpha': 'Alpha',
        'hybrid': 'Hybrid',
        'interface': 'Interface',
        'judgement': 'Judgement',
        'destiny': 'Destiny',
        'lore': 'Lore'
    }
    
    all_data = {}
    
    for folder_name, display_name in slots.items():
        folder_path = os.path.join(base_path, folder_name)
        print(f"Parsing {display_name} slot...")
        
        powers = parse_slot_folder(folder_name, folder_path)
        if powers:
            all_data[folder_name] = powers
            print(f"  Found {len(powers)} powers")
    
    # Generate JavaScript output
    js_output = "// Auto-generated from raw incarnate power JSON files\n\n"
    js_output += "const IncarnatePowerInfo = {\n"
    
    for slot_key, powers_dict in sorted(all_data.items()):
        js_output += f"  {slot_key}: {{\n"
        
        for power_name, tiers in sorted(powers_dict.items()):
            js_output += f"    '{power_name}': {{\n"
            
            for tier_id, tier_data in sorted(tiers.items()):
                js_output += f"      '{tier_id}': {{\n"
                js_output += f"        desc: {json.dumps(tier_data['desc'])},\n"
                js_output += f"        targets: 'Self',\n"
                js_output += f"        range: '0',\n"
                js_output += f"        radius: '0',\n"
                js_output += f"        arc: '0',\n"
                js_output += f"        effects: [],\n"
                js_output += f"        baseStats: {{}},\n"
                js_output += f"        damageType: 'None'\n"
                js_output += f"      }},\n"
            
            js_output += f"    }},\n"
        
        js_output += f"  }},\n"
    
    js_output += "};\n"
    
    # Write output file
    output_path = r"C:\Projects\CoH-Planner\js\incarnate-power-info.js"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_output)
    
    print(f"\nGenerated {output_path}")
    print(f"Total slots: {len(all_data)}")
    print(f"Total powers: {sum(len(powers) for powers in all_data.values())}")

if __name__ == "__main__":
    main()
