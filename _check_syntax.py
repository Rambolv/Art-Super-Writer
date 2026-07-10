import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract script content
m = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
if not m:
    print("No script found")
    exit()

code = m.group(1)
lines = code.split('\n')
print(f"Script lines: {len(lines)}")

# Count all braces ignoring string/template content
braces = 0
parens = 0
in_sq = False
in_dq = False
in_tm = False
escaped = False

for i, ch in enumerate(code):
    # Skip escaped chars
    if escaped:
        escaped = False
        continue
    if ch == '\\' and (in_sq or in_dq or in_tm):
        escaped = True
        continue
    
    # Toggle string states
    if ch == "'" and not in_dq and not in_tm:
        in_sq = not in_sq
    elif ch == '"' and not in_sq and not in_tm:
        in_dq = not in_dq
    elif ch == '`' and not in_sq and not in_dq:
        in_tm = not in_tm
    
    if not in_sq and not in_dq and not in_tm:
        if ch == '{': braces += 1
        elif ch == '}': braces -= 1
        elif ch == '(': parens += 1
        elif ch == ')': parens -= 1

print(f"Final braces balance: {braces} (should be 0)")
print(f"Final parens balance: {parens} (should be 0)")

if braces != 0 or parens != 0:
    print("\nScanning for imbalance location...")
    braces = 0
    parens = 0
    in_sq = False
    in_dq = False
    in_tm = False
    escaped = False
    line_num = 1
    report_interval = 200
    
    for i, ch in enumerate(code):
        if ch == '\n':
            line_num += 1
            if line_num % report_interval == 0:
                pass  # silent
        
        if escaped:
            escaped = False
            continue
        if ch == '\\' and (in_sq or in_dq or in_tm):
            escaped = True
            continue
        
        if ch == "'" and not in_dq and not in_tm:
            in_sq = not in_sq
        elif ch == '"' and not in_sq and not in_tm:
            in_dq = not in_dq
        elif ch == '`' and not in_sq and not in_dq:
            in_tm = not in_tm
        
        if not in_sq and not in_dq and not in_tm:
            if ch == '{': braces += 1
            elif ch == '}': 
                braces -= 1
                if braces < 0:
                    print(f"  Extra }} at line {line_num}")
                    braces = 0
            elif ch == '(': parens += 1
            elif ch == ')': 
                parens -= 1
                if parens < 0:
                    print(f"  Extra ) at line {line_num}")
                    parens = 0
    
    print(f"  Ended with braces={braces}, parens={parens}")

    # Find where the large depth starts
    print("\nFinding where depth spikes...")
    braces = 0
    in_sq = False
    in_dq = False
    in_tm = False
    escaped = False
    line_num = 1
    last_normal = 0
    for i, ch in enumerate(code):
        if ch == '\n':
            if braces >= 10:
                print(f"  Depth {braces} at line {line_num} (was {last_normal})")
                break
            last_normal = braces
            line_num += 1
        
        if escaped:
            escaped = False
            continue
        if ch == '\\' and (in_sq or in_dq or in_tm):
            escaped = True
            continue
        
        if ch == "'" and not in_dq and not in_tm and not escaped:
            in_sq = not in_sq
        elif ch == '"' and not in_sq and not in_tm and not escaped:
            in_dq = not in_dq
        elif ch == '`' and not in_sq and not in_dq and not escaped:
            in_tm = not in_tm
        
        if not in_sq and not in_dq and not in_tm:
            if ch == '{': braces += 1
            elif ch == '}': braces -= 1
            elif ch == '(': parens += 1
            elif ch == ')': parens -= 1
