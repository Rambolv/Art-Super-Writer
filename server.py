#!/usr/bin/env python3
"""ASR Writer 独立版 — 本地 API 服务器

提供文件夹创建、文件读写等磁盘操作能力。
HTML 前端通过 fetch() 调用此服务器。

启动:
    .venv\\Scripts\\python server.py
    
    或双击 start_server.bat
"""

import os
import json
import sys
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# ─── 配置 ───
PORT = 8899
BASE_DIR = Path(__file__).parent.resolve()
PROJECTS_DIR = BASE_DIR / "projects"
PROJECTS_DIR.mkdir(exist_ok=True)

# ─── 启动前清理端口 ───
def _clean_port(port):
    """杀掉占用指定端口的旧进程，防止重复启动"""
    import subprocess, signal
    try:
        # Windows: netstat 查 PID，taskkill 杀掉
        result = subprocess.run(
            ['netstat', '-ano'], capture_output=True, text=True, timeout=5
        )
        for line in result.stdout.splitlines():
            if f':{port}' in line and 'LISTENING' in line:
                parts = line.strip().split()
                pid = parts[-1]
                if pid and pid.isdigit():
                    subprocess.run(['taskkill', '/F', '/PID', pid],
                                   capture_output=True, timeout=3)
                    print(f"  已清理旧进程 PID={pid}")
    except Exception:
        pass  # 清理失败不影响启动

_clean_port(PORT)

# ─── 文件夹结构定义 ───
FOLDER_STRUCTURE = [
    "chapters",              # 写作台：章节文件
    "drafts",                # 写作台：草稿版本
    "reviews",               # 审查室：审查记录
    "reviewHistory",         # 审查室：审查历史JSON
    "worldTreeData",         # 世界树：结构化数据
    "characterProfiles",     # 角色池：心理档案
    "characterAnalysis",     # 角色池：深度分析
    "tensionReports",        # 节奏控制台：张力报告
    "config",                # 设置：配置
    "projectLog",            # 历史日志：日志条目
    "fuzzyMemory",           # 模糊记忆：上下文+报告
    "skills/external",       # 写作技巧库：外部引入
    "skills/self",           # 写作技巧库：本文优劣总结
    "styleMemory",           # 写作技巧库：风格记忆
    "referenceNotes",        # 写作技巧库：参考笔记
]


class RequestHandler(BaseHTTPRequestHandler):
    """处理来自 HTML 前端的 API 请求。"""

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            self._json_response({"status": "ok", "projects_dir": str(PROJECTS_DIR)})

        elif path == "/api/projects":
            projects = [d.name for d in PROJECTS_DIR.iterdir() if d.is_dir() and not d.name.startswith('__')]
            self._json_response({"projects": projects})

        elif path == "/api/lock/read":
            lock_file = PROJECTS_DIR / "__lock__"
            locked = lock_file.read_text('utf-8').strip() if lock_file.exists() else ''
            self._json_response({"locked": locked})

        elif path == "/api/project/meta":
            qs = parse_qs(parsed.query)
            name = qs.get('project', [''])[0].strip()
            if not name or not (PROJECTS_DIR / name).exists():
                self._error(404, "项目不存在")
                return
            meta_path = PROJECTS_DIR / name / "project.json"
            if meta_path.exists():
                data = json.loads(meta_path.read_text('utf-8'))
                self._json_response(data)
            else:
                self._json_response({"name": name})

        elif path.startswith("/api/project/") and path.endswith("/exists"):
            name = path.split("/")[3]
            exists = (PROJECTS_DIR / name).exists()
            self._json_response({"exists": exists, "path": str(PROJECTS_DIR / name)})

        else:
            # 静态文件服务（支持 localStorage 持久化）
            serve_path = path.lstrip('/')
            if not serve_path: serve_path = 'index.html'
            filepath = BASE_DIR / serve_path
            if filepath.exists() and filepath.is_file():
                self.send_response(200)
                self._cors_headers()
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                ext = filepath.suffix.lower()
                mime_map = {
                    '.html': 'text/html; charset=utf-8',
                    '.js': 'application/javascript; charset=utf-8',
                    '.css': 'text/css; charset=utf-8',
                    '.json': 'application/json; charset=utf-8',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.svg': 'image/svg+xml',
                    '.ico': 'image/x-icon',
                }
                self.send_header('Content-Type', mime_map.get(ext, 'application/octet-stream'))
                self.send_header('Content-Length', filepath.stat().st_size)
                self.end_headers()
                with open(filepath, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self._error(404, "Not Found")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(length) if length else b""

        # upload-form 直接用原始二进制
        if path == "/api/project/upload-form":
            self._handle_upload_form(raw_body)
            return

        # 其他端点：解码为 UTF-8 JSON
        body = raw_body.decode("utf-8") if raw_body else "{}"
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            data = {}

        if path == "/health":
            self._json_response({"status": "ok", "version": "1.0"})

        elif path == "/api/lock/save":
            name = data.get("name", "").strip()
            lock_file = PROJECTS_DIR / "__lock__"
            if name:
                lock_file.write_text(name, encoding='utf-8')
            else:
                if lock_file.exists(): lock_file.unlink()
            self._json_response({"saved": True, "locked": name})

        elif path == "/api/project/create":
            name = data.get("name", "").strip()
            if not name:
                self._error(400, "缺少项目名称")
                return
            result = self._create_project_folders(name)
            self._json_response(result)

        elif path == "/api/project/repair-folders":
            name = data.get("name", "").strip()
            if not name:
                self._error(400, "缺少项目名称")
                return
            result = self._repair_project_folders(name)
            self._json_response(result)

        elif path == "/api/project/delete":
            name = data.get("name", "").strip()
            if not name:
                self._error(400, "缺少项目名称")
                return
            import shutil
            target = PROJECTS_DIR / name
            if target.exists():
                shutil.rmtree(target)
                self._json_response({"deleted": True, "path": str(target)})
            else:
                self._json_response({"deleted": False, "reason": "不存在"})

        elif path == "/api/project/meta":
            name = data.get("project", "").strip()
            action = data.get("action", "")
            if not name:
                self._error(400, "缺少项目名")
                return
            meta_path = PROJECTS_DIR / name / "project.json"
            if action == "save":
                meta_data = data.get("data", {})
                meta_path.parent.mkdir(parents=True, exist_ok=True)
                meta_path.write_text(json.dumps(meta_data, ensure_ascii=False, indent=2), encoding='utf-8')
                self._json_response({"saved": True, "path": str(meta_path)})
            elif action == "load":
                if meta_path.exists():
                    d = json.loads(meta_path.read_text('utf-8'))
                    self._json_response(d)
                else:
                    self._json_response({"name": name})
            else:
                self._error(400, "未知操作")

        elif path == "/api/project/upload-raw":
            qs = parse_qs(parsed.query)
            name = qs.get('project', [''])[0].strip()
            subfolder = qs.get('folder', [''])[0].strip()
            filename = qs.get('filename', [''])[0].strip()
            if not all([name, subfolder, filename]):
                self._error(400, "缺少参数"); return
            raw_bytes = raw_body
            text = self._decode_with_detection(raw_bytes)
            filepath = PROJECTS_DIR / name / subfolder / filename
            filepath.parent.mkdir(parents=True, exist_ok=True)
            filepath.write_text(text, encoding='utf-8')
            self._json_response({"saved": True, "path": str(filepath)})

        elif path == "/api/project/save-file":
            name = data.get("project", "")
            subfolder = data.get("folder", "")
            filename = data.get("filename", "")
            content = data.get("content", "")
            if not name or not filename:
                self._error(400, "缺少参数")
                return
            filepath = PROJECTS_DIR / name / subfolder / filename
            filepath.parent.mkdir(parents=True, exist_ok=True)
            filepath.write_text(content, encoding="utf-8")
            self._json_response({"saved": True, "path": str(filepath)})

        elif path == "/api/project/upload":
            name = data.get("project", "").strip()
            subfolder = data.get("folder", "").strip()
            filename = data.get("filename", "").strip()
            content_b64 = data.get("content_b64", "")
            if not all([name, subfolder, filename, content_b64]):
                self._error(400, "缺少参数"); return
            import base64
            raw_bytes = base64.b64decode(content_b64)
            # 去除 BOM 标记
            for bom in [b'\xef\xbb\xbf', b'\xfe\xff', b'\xff\xfe']:
                if raw_bytes.startswith(bom):
                    raw_bytes = raw_bytes[len(bom):]
                    break
            text = self._decode_with_detection(raw_bytes)
            filepath = PROJECTS_DIR / name / subfolder / filename
            filepath.parent.mkdir(parents=True, exist_ok=True)
            filepath.write_text(text, encoding="utf-8")
            self._json_response({"saved": True, "path": str(filepath)})

        elif path == "/api/project/read-file":
            name = data.get("project", "").strip()
            subfolder = data.get("folder", "").strip()
            filename = data.get("filename", "").strip()
            if not all([name, subfolder, filename]):
                self._error(400, "缺少参数")
                return
            filepath = PROJECTS_DIR / name / subfolder / filename
            if not filepath.exists():
                self._error(404, "文件不存在")
                return
            text = filepath.read_text(encoding="utf-8")
            self._json_response({"content": text, "path": str(filepath)})

        elif path == "/api/project/list-files":
            name = data.get("project", "").strip()
            subfolder = data.get("folder", "").strip()
            if not name:
                self._error(400, "缺少项目名")
                return
            folder_path = PROJECTS_DIR / name / subfolder if subfolder else PROJECTS_DIR / name
            if not folder_path.exists():
                self._json_response({"files": []})
                return
            files = sorted([f.name for f in folder_path.iterdir() if f.is_file()])
            self._json_response({"files": files, "path": str(folder_path)})

        else:
            self._error(404, "Not Found")

    # ─── 辅助方法 ───

    def _create_project_folders(self, name):
        """为项目创建完整的文件夹结构（已存在则补全缺失的文件夹）。"""
        project_dir = PROJECTS_DIR / name
        if not project_dir.exists():
            project_dir.mkdir(parents=True)
        created = []
        for folder in FOLDER_STRUCTURE:
            (project_dir / folder).mkdir(parents=True, exist_ok=True)
            created.append(folder)
        # 更新项目信息文件
        info = {
            "name": name,
            "created_at": __import__("datetime").datetime.now().isoformat(),
            "folders": FOLDER_STRUCTURE,
        }
        (project_dir / "project.json").write_text(
            json.dumps(info, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        return {"created": True, "folders": created, "path": str(project_dir)}

    def _handle_upload_form(self, raw_body):
        """处理 multipart/form-data 文件上传"""
        content_type = self.headers.get('Content-Type', '')
        boundary = ''
        if 'boundary=' in content_type:
            boundary = content_type.split('boundary=')[1].split(';')[0].strip()
            if boundary.startswith('"') and boundary.endswith('"'):
                boundary = boundary[1:-1]
        if not boundary:
            self._error(400, "缺少 boundary")
            return
        project_name = ''; subfolder = ''; filename = ''; file_data = b''
        parts = raw_body.split(('--' + boundary).encode())
        for part in parts:
            if b'Content-Disposition' not in part: continue
            header_end = part.find(b'\r\n\r\n')
            if header_end < 0: continue
            headers_raw = part[:header_end].decode('utf-8', errors='replace')
            body_part = part[header_end+4:]
            if body_part.endswith(b'\r\n'): body_part = body_part[:-2]
            if 'name="project"' in headers_raw:
                project_name = body_part.decode('utf-8', errors='replace').strip()
            elif 'name="folder"' in headers_raw:
                subfolder = body_part.decode('utf-8', errors='replace').strip()
            elif 'name="file"' in headers_raw:
                if 'filename="' in headers_raw:
                    fstart = headers_raw.index('filename="') + 10
                    fend = headers_raw.index('"', fstart)
                    filename = headers_raw[fstart:fend]
                file_data = body_part
        if not all([project_name, subfolder, filename]):
            self._error(400, "缺少参数"); return

        text = self._decode_with_detection(file_data)
        filepath = PROJECTS_DIR / project_name / subfolder / filename
        filepath.parent.mkdir(parents=True, exist_ok=True)
        filepath.write_text(text, encoding='utf-8')
        self._json_response({"saved": True, "path": str(filepath)})

    def _decode_with_detection(self, raw_bytes):
        """智能编码检测 + 乱码验证，返回正确解码的文本"""
        import chardet

        # 1. 先用 chardet 检测编码
        detect_result = chardet.detect(raw_bytes)
        detected_enc = detect_result.get('encoding', 'utf-8') or 'utf-8'
        detected_conf = detect_result.get('confidence', 0)

        # 统一编码名称
        enc_map = {
            'gb2312': 'gbk', 'gb18030': 'gbk', 'hz': 'gbk',
            'iso-8859-1': 'utf-8', 'ascii': 'utf-8',
            'utf-16': 'utf-16-le', 'utf-16le': 'utf-16-le', 'utf-16be': 'utf-16-be',
            'big5': 'big5', 'shift_jis': 'shift_jis', 'euc-kr': 'euc-kr',
        }
        normalized_enc = enc_map.get(detected_enc.lower(), detected_enc)

        # 2. 尝试用检测到的编码解码
        candidates = []
        tried = set()

        def _try_decode(enc):
            if enc in tried: return None
            tried.add(enc)
            # 先尝试严格解码
            try:
                decoded = raw_bytes.decode(enc)
                return decoded
            except:
                pass
            # 严格解码失败，尝试替换模式（处理文件中的个别坏字节）
            try:
                decoded = raw_bytes.decode(enc, errors='replace')
                return decoded
            except:
                return None

        # 按优先级尝试编码
        priority_encs = [normalized_enc, 'utf-8', 'gbk', 'gb18030',
                         'utf-16-le', 'utf-16-be', 'big5', 'shift_jis', 'euc-kr']

        for enc in priority_encs:
            result = _try_decode(enc)
            if result is not None:
                candidates.append((enc, result))

        if not candidates:
            # 全失败，用 utf-8 替换模式保底
            return raw_bytes.decode('utf-8', errors='replace')

        # 3. 乱码检测：对每个候选编码结果抽样验证
        def _is_garbled(text):
            """检测文本是否包含大量乱码"""
            if len(text) < 50: return False
            # 取前中后三段样本
            samples = [
                text[:min(500, len(text)//3)],
                text[len(text)//2:len(text)//2 + min(500, len(text)//3)],
                text[-min(500, len(text)//3):]
            ]
            garbled_chars = 0
            total_chars = 0
            for s in samples:
                for ch in s:
                    total_chars += 1
                    cp = ord(ch)
                    # 乱码特征：在CJK范围外的奇怪字符
                    # 常见乱码产生的字符集中在 U+0000-U+02AF, U+0380-U+03FF, U+2000-U+206F
                    if cp < 0x20: continue  # 控制字符跳过
                    if 0x20 <= cp < 0x7F: continue  # ASCII 可打印字符
                    if 0x4E00 <= cp <= 0x9FFF: continue  # CJK统一汉字
                    if 0x3400 <= cp <= 0x4DBF: continue  # CJK扩展A
                    if 0x3000 <= cp <= 0x303F: continue  # CJK符号
                    if 0xFF00 <= cp <= 0xFFEF: continue  # 全角字符
                    if 0xFE30 <= cp <= 0xFE4F: continue  # CJK兼容符号
                    if 0x2000 <= cp <= 0x206F: continue  # 通用标点
                    if 0x00A0 <= cp <= 0x00FF: continue  # Latin-1补充
                    if 0x0100 <= cp <= 0x024F: continue  # 拉丁扩展
                    # 其他字符判为乱码
                    garbled_chars += 1
            ratio = garbled_chars / max(total_chars, 1)
            return ratio > 0.15  # 超过15%的字符是乱码则判定为乱码

        # 4. 选第一个无乱码的候选，如果有乱码则继续尝试
        for enc, decoded in candidates:
            if not _is_garbled(decoded):
                return decoded

        # 5. 所有候选都有乱码，选乱码最少的
        best_text = candidates[0][1]
        best_garbled = float('inf')
        for enc, decoded in candidates:
            try:
                # 用 \ufffd 计数作为乱码程度的近似
                g_count = decoded.count('\ufffd')
                if g_count < best_garbled:
                    best_garbled = g_count
                    best_text = decoded
            except:
                pass
        return best_text

    def _json_response(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self._cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def _cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _error(self, code, msg):
        self._json_response({"error": msg}, code)

    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")


def main():
    server = HTTPServer(("127.0.0.1", PORT), RequestHandler)
    print(f"🚀 ASR Writer 本地服务器启动: http://127.0.0.1:{PORT}")
    print(f"📁 项目目录: {PROJECTS_DIR}")
    print("按 Ctrl+C 停止服务器")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
        server.server_close()


if __name__ == "__main__":
    main()
