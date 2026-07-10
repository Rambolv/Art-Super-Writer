code = open(r'c:\AI\ASR WRITER\ASR WRITER\standalone\_temp.js','r',encoding='utf-8').read()
lines = code.split('\n')
depth = 0
in_template = False
in_string = False
str_char = None
skip_next = False

for i, line in enumerate(lines):
    if in_template:
        # Check if this line closes the template
        if line.strip().endswith('`;') or line.strip().endswith('`'):
            in_template = False
        continue
    
    for j, ch in enumerate(line):
        if skip_next:
            skip_next = False
            continue
        
        if in_string:
            if ch == '\\':
                skip_next = True
                continue
            if ch == str_char:
                in_string = False
            continue
        
        if ch == '`' and not in_template:
            # Check if there's a template expression inside
            in_template = True
            depth += 1  # The template itself
            # Skip to end of template literal
            continue
        
        if ch == '"' or ch == "'":
            in_string = True
            str_char = ch
            continue
        
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
    
    if depth != 0 and not in_template:
        print(f'Line {i+1}: depth={depth}, text={line[:100]}')

print(f'Final depth: {depth}')
