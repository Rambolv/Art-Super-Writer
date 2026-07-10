#!/usr/bin/env python3
"""Analyze encoding of the corrupted file."""
from pathlib import Path
from collections import Counter

p = Path(r'projects/修罗都市/chapters/修罗都市.md')
raw = p.read_bytes()

print(f'File size: {len(raw)} bytes')
print()

# Check what bytes look like
print('=== First 200 bytes hex ===')
for i in range(0, min(200, len(raw)), 16):
    hex_str = ' '.join(f'{b:02x}' for b in raw[i:i+16])
    ascii_str = ''.join(chr(b) if 32 <= b < 127 else '.' for b in raw[i:i+16])
    print(f'{i:04x}: {hex_str:<48s} {ascii_str}')

# Check GBK ratio
gbk_count = 0
for i in range(len(raw)-1):
    if 0x81 <= raw[i] <= 0xFE and 0x40 <= raw[i+1] <= 0xFE:
        gbk_count += 1
print(f'\nPossible GBK 2-byte sequences: {gbk_count} / {len(raw)//2} max')

# UTF-8 valid multi-byte
utf8_mb = 0
i = 0
while i < len(raw):
    b = raw[i]
    if b < 0x80:
        i += 1
    elif 0xC0 <= b <= 0xDF and i+1 < len(raw) and 0x80 <= raw[i+1] <= 0xBF:
        utf8_mb += 1
        i += 2
    elif 0xE0 <= b <= 0xEF and i+2 < len(raw) and 0x80 <= raw[i+1] <= 0xBF and 0x80 <= raw[i+2] <= 0xBF:
        utf8_mb += 1
        i += 3
    else:
        i += 1
print(f'Valid UTF-8 multi-byte sequences: {utf8_mb}')

# Byte value distribution (top 20)
byte_counts = Counter(raw)
print('\nMost common byte values:')
for byte, count in byte_counts.most_common(20):
    ch = chr(byte) if 32 <= byte < 127 else '.'
    print(f'  0x{byte:02x} ({ch}): {count} ({(count/len(raw))*100:.1f}%)')

# Check for the UTF-8 BOM/replacement char patterns
ef_bf_bd_count = 0
for i in range(len(raw)-2):
    if raw[i] == 0xef and raw[i+1] == 0xbf and raw[i+2] == 0xbd:
        ef_bf_bd_count += 1
print(f'\nU+FFFD (replacement character) occurrences in raw bytes: {ef_bf_bd_count}')
print(f'That means {ef_bf_bd_count * 3} bytes ({ef_bf_bd_count*3/len(raw)*100:.1f}%) are replacement chars')
