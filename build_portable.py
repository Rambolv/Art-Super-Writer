#!/usr/bin/env python3
"""超逸写手 — 绿色便携版打包工具"""

import os, sys, shutil, zipfile
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent
ZIP_NAME = PROJECT_ROOT / "Art-Super-Writer-Portable.zip"
TEMP_DIR = PROJECT_ROOT / "_build_temp"

INCLUDE_FILES = [
    "index.html", "server.py", "launcher.py", "README.md",
    "launcher.ps1", "超逸写手启动器.exe", "alipay_qr.png",
    "start_server.bat", "启动超逸写手.bat",
]

INCLUDE_DIRS = ["projects", "docs"]

EXCLUDE = ["__pycache__", ".git", ".venv", "_check_", "_temp",
           "check_brace", ".jsonl", ".bak", "index.html.bak"]

def should_exclude(p):
    for e in EXCLUDE:
        if e in str(p):
            return True
    return False

def build():
    print("=" * 55)
    print("  超逸写手 — 绿色便携版打包工具")
    print("=" * 55)
    print()

    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR)
    inner = TEMP_DIR / "Art-Super-Writer"
    inner.mkdir(parents=True)

    count = 0
    for f in INCLUDE_FILES:
        src = PROJECT_ROOT / f
        if src.exists():
            shutil.copy2(src, inner / f)
            count += 1

    for d in INCLUDE_DIRS:
        src = PROJECT_ROOT / d
        if src.exists():
            dst = inner / d
            for root, dirs, files in os.walk(src):
                rp = Path(root)
                rel = rp.relative_to(src)
                if should_exclude(rel):
                    continue
                (inner / d / rel).mkdir(parents=True, exist_ok=True)
                for file in files:
                    if should_exclude(file):
                        continue
                    fp = rp / file
                    if fp.stat().st_size > 2 * 1024 * 1024:
                        continue
                    shutil.copy2(fp, inner / d / rel / file)
            count += 1

    # 首次安装脚本
    (inner / "首次运行-安装依赖.bat").write_text("""@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ================================================
echo    首次运行：安装依赖
echo ================================================
python -m venv .venv
.venv\\Scripts\\pip install flask requests chardet --quiet
echo.
echo ✅ 安装完成！双击"启动超逸写手.bat"开始使用
pause
""", encoding="utf-8")

    # 日常启动脚本
    (inner / "启动超逸写手.bat").write_text("""@echo off
chcp 65001 >nul
title 超逸写手
cd /d "%~dp0"
if not exist ".venv\\Scripts\\python.exe" (
    echo ⚠️ 请先运行"首次运行-安装依赖.bat"
    pause
    exit /b 1
)
start "" http://127.0.0.1:8899
.venv\\Scripts\\python server.py
pause
""", encoding="utf-8")

    (inner / "使用说明.txt").write_text("""超逸写手 使用说明
================
首次使用：双击「首次运行-安装依赖.bat」等待完成
日常使用：双击「启动超逸写手.bat」
前提条件：已安装 Python 3.10+（https://python.org）
详情：查看 README.md
""", encoding="utf-8")

    print(f"  已打包 {count+3} 项")

    if ZIP_NAME.exists():
        ZIP_NAME.unlink()
    with zipfile.ZipFile(ZIP_NAME, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(TEMP_DIR):
            for file in files:
                fp = Path(root) / file
                zf.write(fp, fp.relative_to(TEMP_DIR))

    size = ZIP_NAME.stat().st_size / 1024 / 1024
    shutil.rmtree(TEMP_DIR)
    print(f"  ✅ 完成: {ZIP_NAME.name} ({size:.1f} MB)")
    print(f"  {ZIP_NAME.absolute()}")

if __name__ == "__main__":
    build()
