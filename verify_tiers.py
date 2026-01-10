#!/usr/bin/env python3

import json
import re

# Load power info
with open('js/incarnate-power-info.js', 'r') as f:
    content = f.read()

# Extract the IncarnatePowerInfo object
# Find the start and end of the object
start = content.find('const IncarnatePowerInfo = {') + len('const IncarnatePowerInfo = ')
end = content.rfind('};') + 2
json_str = content[start:end]

# Replace trailing commas before closing braces (not valid JSON)
json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)

try:
    data = json.loads(json_str)
except json.JSONDecodeError as e:
    print(f"JSON parsing error: {e}")
    # Try manual parsing if JSON fails
    print("Checking tier counts manually...")
    
    expected_tiers = ['t1', 't2_core', 't2_radial', 't3_core_1', 't3_core_2', 't3_radial_1', 't3_radial_2', 't4_core', 't4_radial']
    
    for slot in ['alpha', 'hybrid', 'interface', 'judgement', 'destiny', 'lore']:
        # Extract slot data
        slot_start = content.find(f"  {slot}: {{")
        if slot_start == -1:
            continue
        slot_end = content.find("\n  },", slot_start) + len("\n  },")
        slot_content = content[slot_start:slot_end]
        
        # Count powers in this slot by counting power entries
        power_matches = re.findall(r"    '([^']+)':", slot_content)
        powers = list(set(power_matches))
        
        print(f"\n{slot.upper()} slot: {len(powers)} powers")
        
        # Check first few powers for tier completeness
        for power in powers[:3]:
            tier_matches = re.findall(f"'{power}':" + r"[^}}]*?'(t\d[a-z0-9_]*)': {{", slot_content)
            tier_matches = list(set(tier_matches))
            print(f"  {power}: {len(tier_matches)} tiers - {sorted(tier_matches)}")
