@echo off
chcp 65001 >nul
title 超逸写手 — Art Super Writer 启动器

echo ================================================
echo    超逸写手 — Art Super Writer
echo    正在启动，请稍候...
echo ================================================
echo.

cd /d "%~dp0"

:: 检查文件
if not exist "server.py" (
    echo ❌ 找不到 server.py
    pause
    exit /b 1
)
if not exist "index.html" (
    echo ❌ 找不到 index.html
    pause
    exit /b 1
)

:: 检查 venv
if exist ".venv\Scripts\python.exe" (
    set PYTHON=.venv\Scripts\python.exe
) else (
    where python >nul 2>&1
    if errorlevel 1 (
        echo ❌ 找不到 Python
        pause
        exit /b 1
    )
    set PYTHON=python
)

:: 检查端口是否被占用
netstat -an | find "127.0.0.1:8899" >nul 2>&1
if not errorlevel 1 (
    echo ✅ 服务器已在运行
    start "" "http://127.0.0.1:8899/"
    echo 💡 按任意键退出...
    pause >nul
    exit /b 0
)

:: 启动后端服务器（隐藏窗口）
echo 🚀 启动后端服务器...
start /B "" "%PYTHON%" "server.py"

:: 等待服务器就绪
echo ⏳ 等待服务器就绪...
set WAIT_COUNT=0
:WAIT_LOOP
set /a WAIT_COUNT+=1
if %WAIT_COUNT% gtr 60 (
    echo ❌ 服务器启动超时
    echo 请尝试手动运行: "%PYTHON%" server.py
    pause
    exit /b 1
)
:: 检查端口是否已监听
netstat -an | find "127.0.0.1:8899" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto WAIT_LOOP
)

:: 额外等1秒确保完全就绪
timeout /t 1 /nobreak >nul

echo ✅ 服务器已就绪
echo 🌐 打开前端页面...
start "" "http://127.0.0.1:8899/"

echo.
echo ================================================
echo  ✅ ASR Writer 运行中
echo  📡 http://127.0.0.1:8899
echo  💡 关闭此窗口即可停止服务器
echo ================================================
echo.

:: 保持窗口打开，等待用户关闭
"%PYTHON%" -c "import time; time.sleep(999999)" 2>nul
