"""ASR Writer 一键启动器"""
import subprocess, time, webbrowser, sys, os, urllib.request, socket

BASE = os.path.dirname(os.path.abspath(__file__ if not getattr(sys,"frozen",False) else sys.executable))
PORT = 8899; SRV = f"http://127.0.0.1:{PORT}"
PY = os.path.join(BASE, ".venv", "Scripts", "python.exe")
if not os.path.isfile(PY): PY = "python"
HTML = os.path.join(BASE, "index.html")

print("="*48)
print("  超逸写手 - Art Super Writer  启动器")
print("="*48)

for f in [HTML, os.path.join(BASE,"server.py")]:
    if not os.path.isfile(f):
        print(f"文件不存在: {f}"); input(); sys.exit(1)

s = socket.socket()
try:
    s.connect(("127.0.0.1", PORT)); s.close()
    try:
        if urllib.request.urlopen(f"{SRV}/api/health",timeout=2).status==200:
            print("服务器已在运行")
            webbrowser.open(f"file:///{HTML.replace(os.sep,'/')}")
            input(); sys.exit(0)
    except: pass
    print(f"端口{PORT}被占用"); input(); sys.exit(1)
except: s.close()

print("启动服务器...")
p = subprocess.Popen([PY, os.path.join(BASE,"server.py")], cwd=BASE)
print("等待就绪", end="", flush=True)
for i in range(60):
    time.sleep(0.5)
    try:
        if urllib.request.urlopen(f"{SRV}/api/health",timeout=1).status==200:
            print(" ok"); webbrowser.open(f"file:///{HTML.replace(os.sep,'/')}")
            print("关闭此窗口即可停止"); p.wait(); sys.exit(0)
    except: print(".", end="", flush=True)
print(" fail"); p.kill(); input()
