code = open(r'c:\AI\ASR WRITER\ASR WRITER\standalone\_temp.js','r',encoding='utf-8').read()
depth = 0
in_str = False
in_tmpl = False
sc = None
for i, ch in enumerate(code):
    if in_str:
        if ch == '\\': continue
        if ch == sc: in_str = False
        continue
    if in_tmpl:
        if ch == '`': in_tmpl = False
        continue
    if ch == '`': in_tmpl = True; continue
    if ch in '"\'':
        in_str = True
        sc = ch
        continue
    if ch == '{': depth += 1
    if ch == '}':
        depth -= 1
        if depth < 0:
            print(f'Extra }} at position {i}')
            start = max(0, i-100)
            print(code[start:i+10])
            break
print(f'Final depth: {depth}')
