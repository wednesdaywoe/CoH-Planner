import re
import os

ROOT = os.path.dirname(os.path.dirname(__file__))
TARGET = os.path.join(ROOT, 'js', 'data', 'powersets')

SEPARATOR_REGEX = re.compile(r'},\n\s*{')

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, text):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def find_top_name(text):
    # find name: "..." that appears before 'powers:'
    m = re.search(r'name\s*:\s*"([^"]+)"', text)
    if not m:
        return None
    # ensure it's before powers:
    powers_idx = text.find('powers:')
    if powers_idx == -1:
        return None
    if m.start() < powers_idx:
        return m.group(1)
    return None


def extract_powers_block(text):
    idx = text.find('powers:')
    if idx == -1:
        return None, None, None
    start_bracket = text.find('[', idx)
    if start_bracket == -1:
        return None, None, None
    # find matching closing bracket
    depth = 0
    i = start_bracket
    while i < len(text):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                end_bracket = i
                break
        i += 1
    else:
        return None, None, None
    return start_bracket, end_bracket, text[start_bracket+1:end_bracket]


def split_entries(block_text):
    # split on '},\n<whitespace>{' keeping braces around entries
    parts = SEPARATOR_REGEX.split(block_text)
    # After splitting we lost the separators; rebuild entries by ensuring braces
    entries = []
    for i, part in enumerate(parts):
        s = part.strip()
        if not s:
            continue
        # Add braces if missing
        if not s.startswith('{'):
            s = '{' + s
        if not s.endswith('}'):
            s = s + '}'
        entries.append(s)
    return entries


def entry_name(entry_text):
    # try both quoted and unquoted key styles
    m = re.search(r'"name"\s*:\s*"([^"]+)"', entry_text)
    if m:
        return m.group(1)
    m = re.search(r'name\s*:\s*"([^"]+)"', entry_text)
    if m:
        return m.group(1)
    return None


def is_incomplete(entry_text):
    # Consider incomplete if it lacks 'effects' and lacks 'description' and lacks 'shortHelp'
    if 'effects' in entry_text:
        return False
    if 'description' in entry_text:
        return False
    if 'shortHelp' in entry_text or 'short_help' in entry_text:
        return False
    return True


def process_file(path):
    text = read_file(path)
    top_name = find_top_name(text)
    if not top_name:
        return False, 'no top name'
    sb, eb, block = extract_powers_block(text)
    if block is None:
        return False, 'no powers block'
    entries = split_entries(block)
    if not entries:
        return False, 'no entries'
    new_entries = []
    seen = set()
    removed = []
    for entry in entries:
        en = entry_name(entry)
        if en is None:
            # keep ambiguous entries
            new_entries.append(entry)
            continue
        if en == top_name:
            removed.append((en, 'same-as-powerset'))
            continue
        if en in seen:
            removed.append((en, 'duplicate'))
            continue
        if is_incomplete(entry):
            removed.append((en, 'incomplete'))
            continue
        seen.add(en)
        new_entries.append(entry)
    if not removed:
        return False, 'no changes'
    # reconstruct block with same indentation as original
    indent_match = re.search(r'\n(\s*)\{', block)
    if indent_match:
        indent = indent_match.group(1)
    else:
        indent = '        '
    joined = (',\n' + indent).join(e.strip() for e in new_entries)
    # put back surrounding brackets and replace
    new_block = '\n' + indent + joined + '\n    '
    new_text = text[:sb+1] + new_block + text[eb:]
    # backup original
    backup_path = path + '.bak'
    if not os.path.exists(backup_path):
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(text)
    write_file(path, new_text)
    return True, removed


def main():
    results = {}
    for fn in os.listdir(TARGET):
        if not fn.endswith('.js'):
            continue
        path = os.path.join(TARGET, fn)
        changed, info = process_file(path)
        results[fn] = (changed, info)
    # print summary
    for fn, (changed, info) in results.items():
        if changed:
            print(f'Updated: {fn} -> removed: {info}')
        else:
            print(f'No change: {fn} ({info})')

if __name__ == '__main__':
    main()
