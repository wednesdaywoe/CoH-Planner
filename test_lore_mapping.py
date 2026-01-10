#!/usr/bin/env python3

# Check the mapping
lore_mapping = {
    'Arachnos': 'arachnos',
    'Banished': 'banished_pantheon',
    'Banished Pantheon': 'banished_pantheon',
    'Carnival': 'carnival',
    'Carnival of Shadows': 'carnival',
    'Cimeroran': 'cimeroran',
    'Clockwork': 'clockwork',
    'Drones': 'robotic_drones',
    'Robotic Drones': 'robotic_drones',
    'Elementals': 'storm_elemental',
    'IDF': 'idf',
    'Knives': 'knives_of_vengeance',
    'Knives of Artemis': 'knives_of_vengeance',
    'Lights': 'polar_lights',
    'Polar Lights': 'polar_lights',
    'Longbow': 'longbow',
    'Nemesis': 'nemesis',
    'Phantoms': 'phantom',
    'Rikti': 'rikti',
    'Rularuu': 'rularuu',
    'Seers': 'seers',
    'Talons': 'talons_of_vengeance',
    'Talons of Vengeance': 'talons_of_vengeance',
    'Tsoo': 'tsoo',
    'Vanguard': 'vanguard',
    'WarWorks': 'warworks',
    'Praetorian Clockwork': 'warworks'
}

# Load power info to verify all keys are present
with open('js/incarnate-power-info.js', 'r') as f:
    content = f.read()
    # Extract lore section
    lore_start = content.find('lore: {')
    lore_end = content.find('  };', lore_start)
    lore_section = content[lore_start:lore_end]
    
    # Check each mapping
    print('Lore power mapping verification:')
    for ui_name, data_key in lore_mapping.items():
        search_str = "'" + data_key + "':"
        if search_str in lore_section:
            print(f'✓ {ui_name:25} -> {data_key}')
        else:
            print(f'✗ {ui_name:25} -> {data_key} (NOT FOUND)')
