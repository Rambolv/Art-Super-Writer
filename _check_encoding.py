#!/usr/bin/env python3
"""检查修罗都市文件的编码问题"""
import os
from collections import Counter

base = r'c:\AI\ASR WRITER\ASR WRITER\standalone\projects'

# 修罗都市原始文件
f1 = os.path.join(base, '修罗都市', 'chapters', '修罗都市.md')
# 雨过桃花原始文件
f2 = os.path.join(base, '雨过桃花', 'chapters', '雨过桃花.md')

with open(f1, 'rb') as f:
    raw1 = f.read()
with open(f2, 'rb') as f:
    raw2 = f.read()

print(f'修罗都市: {len(raw1)} 字节')
print(f'雨过桃花: {len(raw2)} 字节')
print()

print('修罗都市 前30字节hex:', raw1[:30].hex(' '))
print('雨过桃花 前30字节hex:', raw2[:30].hex(' '))
print()

# 修罗都市中哪些字节值最多
c1 = Counter(raw1)
print('修罗都市 最常见字节值:')
for byte_val, count in c1.most_common(15):
    ch = chr(byte_val) if 32 <= byte_val < 127 else '?'
    print(f'  0x{byte_val:02x} ({ch}): {count}次 ({count/len(raw1)*100:.1f}%)')

print()

# 检查 ef bf bd (UTF-8编码的U+FFFD) 的出现次数
fffd_bytes = b'\xef\xbf\xbd'
count_fffd = raw1.count(fffd_bytes)
print(f'修罗都市中 EF BF BD (U+FFFD) 出现: {count_fffd} 次')
print(f'占所有字节: {count_fffd*3/len(raw1)*100:.1f}%')
print(f'占所有3字节组合: {raw1.count(fffd_bytes) / (len(raw1)//3) * 100 if len(raw1)>0 else 0:.1f}%')

# 在文件中找到非 EF BF BD 的连续区域
print()
print('修罗都市中非替换字符的连续片段:')
i = 0
fragments = []
while i < len(raw1) - 2:
    if raw1[i:i+3] != fffd_bytes:
        # 找到非替换字符的片段
        start = i
        while i < len(raw1) - 2 and raw1[i:i+3] != fffd_bytes:
            i += 1
        frag = raw1[start:i]
        if len(frag) > 10:
            fragments.append(frag)
    else:
        i += 1

for frag in fragments[:5]:
    print(f'  长度{len(frag)}: {frag[:60].hex(" ")}')
    # 尝试用GBK解码
    try:
        decoded = frag.decode('gbk')
        print(f'    GBK解码: {repr(decoded[:30])}')
    except:
        print(f'    GBK解码失败')
    try:
        decoded = frag.decode('utf-8')
        print(f'    UTF-8解码: {repr(decoded[:30])}')
    except:
        print(f'    UTF-8解码失败')
