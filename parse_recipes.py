#!/usr/bin/env python3
"""Parse Incarnate.recipe file and generate incarnate-components.js"""

import re
from collections import defaultdict

# Parse recipe file
recipe_file = r"C:\Projects\CoH-Planner\incarnate_raw_data\Incarnate.recipe"

recipes = {}
current_recipe = None

with open(recipe_file, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.rstrip()
        
        # Check for recipe start
        if line.startswith('DetailRecipe '):
            match = re.match(r'DetailRecipe\s+(\w+)', line)
            if match:
                current_recipe = match.group(1)
                recipes[current_recipe] = {
                    'salvage': [],
                    'power': None,
                    'incarnate': None
                }
        
        # Parse salvage components
        if current_recipe and line.strip().startswith('SalvageComponent '):
            match = re.match(r'\s*SalvageComponent\s+(\d+)\s+(\S+)', line)
            if match:
                qty = match.group(1)
                comp = match.group(2)
                # Remove S_ prefix
                comp = comp.replace('S_', '')
                recipes[current_recipe]['salvage'].append(f"{qty}x {comp}")
        
        # Parse power component (prerequisite)
        if current_recipe and line.strip().startswith('PowerComponent '):
            match = re.match(r'\s*PowerComponent\s+\d+\s+(\S+)', line)
            if match:
                recipes[current_recipe]['power'] = match.group(1)
        
        # Parse incarnate reward
        if current_recipe and line.strip().startswith('IncarnateReward '):
            match = re.match(r'\s*IncarnateReward\s+(\S+)', line)
            if match:
                recipes[current_recipe]['incarnate'] = match.group(1)

# Now find Agility recipes
print("=" * 80)
print("AGILITY RECIPES FOUND:")
print("=" * 80)

agility_recipes = {k: v for k, v in recipes.items() if 'Agility' in k and 'Alpha' not in k}

for recipe_name in sorted(agility_recipes.keys()):
    recipe = agility_recipes[recipe_name]
    print(f"\n{recipe_name}:")
    print(f"  Reward: {recipe['incarnate']}")
    print(f"  Salvage: {recipe['salvage']}")
    print(f"  Requires: {recipe['power']}")
