import sys, json
sys.path.insert(0, r'C:/Projects/CoH-Planner/tools/bin-crawler')
from bin_crawler.parser._pigg import BinResolver
from bin_crawler.parser._boostsets import parse_boostsets
resolver = BinResolver(r'C:/Users/jiiwi/OneDrive/Desktop/CoH/i2401-bin-server-develop/piggs')
p = resolver.read_to_tempfile('boostsets.bin')
sets = parse_boostsets(str(p))
out = [{'name': s.name, 'display_name': s.display_name, 'rarity': s.rarity, 'category': s.category} for s in sets]
print(json.dumps(out))
