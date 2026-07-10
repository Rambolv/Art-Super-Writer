@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 🚀 启动 ASR Writer 本地服务器...
.venv\Scripts\python server.py
pause
