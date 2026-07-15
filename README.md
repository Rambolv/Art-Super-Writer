<div align="center">

# 🖋️ 超逸写手 · Art Super Writer

**让 AI 读懂你的长篇小说，再帮你接着写。**

*Let AI read your entire novel, then help you write the next chapter.*

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<br>

> 💬 **需要帮助？** 本地 LLM 部署咨询可付费协助（联系作者）。一般用户建议直接买 DeepSeek API——几块钱写一本书，省心省力。

*Need help? Paid consultation for local LLM deployment is available. Most users should just buy DeepSeek API — it costs pennies per novel and saves hours of setup.*

<br>

[🇨🇳 **中文文档**](#cn) &nbsp;&nbsp;|&nbsp;&nbsp; [🇬🇧 **English Documentation**](#en)

<br>

---

</div>

<a id="cn"></a>

# 🇨🇳 中文文档

---

## 🎯 优势和不足

### 它解决了什么

| 你遇到的麻烦 | 超逸写手怎么解决 |
|-------------|----------------|
| **AI 记不住前文**——写到后面忘了前面，角色性格全乱 | 写新章前，AI **自动分批阅读你全部已有章节**，读完完整故事才动笔 |
| **角色前后矛盾**——名字写错、性格飘忽、死人复活 | 🧠 **角色池**跟踪每个角色的性格/关系/状态，写作时自动注入 |
| **写完不知道好不好** | 🔍 **三个 AI 审查官**——严/衡/宽从 13 个维度打分，给具体修改 |
| **故事结构乱**——挖坑不填、支线丢失 | 🌳 **世界树**——主线/支线/伏笔一目了然 |
| **Token 费用高** | ⚡ **Slot 模式**——全文预热一次，后续写多章几乎零增量 |

### 不足

| 不足 | 说明 |
|------|------|
| 需要装 Python | 10 分钟搞定 |
| API 方案需付费 | DeepSeek 很便宜——写一本书几块钱 |
| 本地 LLM 写作质量不如 API | 7B/14B 本地模型的创意和细腻度不如云端大模型 |
| 不是全自动写书机 | 你需要构思和编辑——它是辅助，不是替代 |

### API vs 本地 LLM——怎么选

| | 本地 LLM（Slot 模式） | 云端 API（DeepSeek） |
|--|---------------------|---------------------|
| 💰 费用 | 几乎免费 | 几元/本书 |
| 📝 写作质量 | ⚠️ 一般 | ✅ 优秀 |
| 🔧 难度 | 需 8G+ 显卡 + 配置 | 注册→复制 Key，5 分钟 |
| 🏠 隐私 | ✅ 完全本地 | 通过 API 传到云端 |

> **建议：** 大多数用户买 API 就行，便宜省心。喜欢折腾且有显卡的用本地 LLM。

---

## ⚡ 30 秒快速开始

### 1. 装 Python

[python.org](https://python.org/downloads) 下载 3.10+，安装时**勾选 Add to PATH**。

### 2. 装依赖

```bash
cd standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
```

### 3. 启动

双击 **`超逸写手启动器.exe`**（有图形界面的启动器）。

或双击 `启动超逸写手.bat`。

浏览器打开 **http://127.0.0.1:8899**。

### 4. 连接 AI

**方案 A——云端 API（推荐）**

去 [platform.deepseek.com](https://platform.deepseek.com) 注册 → **API Keys** → 创建 Key → 复制 `sk-...`。

在软件 **⚙️ 设置** 中：添加 LLM 配置 → 供应商 DeepSeek → 模型 `deepseek-chat` → 粘贴 Key → **工作模式选 ⚡ Slot** → 保存 → 测试连接。

> **为什么推荐 Slot 模式？** `cache_prompt` 参数让 API 服务端缓存提示词——重复内容不重复计费。DeepSeek 同样支持（服务端通过 `prompt_cache_hit_tokens` 返回缓存命中量）。Stateless 兼容性最好但每次请求重新处理全部内容，Token 消耗更大。不确定就用 Stateless。

**方案 B——本地 LLM（有显卡的用户）**

见 [本地 LLM 部署教学](#本地-llm-部署教学)。

---

## 📂 分情况指南

### 情况 A：你已有文档，想继续写

**① 创建项目** → **📁 项目管理** → 输入名称 → 选类型 → 创建

**② 导入文件** → 点击项目 → **📥 导入章节文件** → 选 `.txt/.md` → 导入

**③ 锁定** → 点击 **🔒 锁定**

**④ AI 分析** → 点击 **🔍 分析** → 8 步流程（别刷新页面）

**⑤ 查看数据** → 🌳 世界树 / 🧠 角色池 / 📊 节奏控制台

**⑥ 写作** → ✍️ 写作台 → 填方向 → 发送 → 定稿

每写一章后回项目管理**重新分析**更新数据。

### 情况 B：新开一本书

创建 → 锁定 → 去写作台直接写第一章。写了 2-3 章后分析。

### 情况 C：本地 LLM 部署教学

**前提：** 8G+ NVIDIA 显卡。

**① 下载 llama.cpp**

[llama.cpp Releases](https://github.com/ggerganov/llama.cpp/releases) → 下载 Windows CUDA 版 → 解压到 `standalone/LLM/bin/`

**② 下载模型**

推荐 Qwen2.5-7B-Instruct GGUF 格式（HuggingFace / ModelScope），放到 `LLM/models/`

**③ 编写启动脚本**

在 `LLM/` 中创建 `start.bat`，参考以下优化参数（来自作者的实际部署）：

```bat
@echo off
bin\llama-server.exe ^
  -m "models\你的模型.gguf" ^
  -ngl 99 ^
  --flash-attn on ^
  --jinja ^
  --reasoning off ^
  -c 131072 ^
  -t 12 ^
  -b 1024 ^
  -ub 512 ^
  --cache-type-k q4_0 ^
  --cache-type-v q4_0 ^
  --mlock ^
  --host 127.0.0.1 ^
  --port 8080
pause
```

**参数说明：**

| 参数 | 值 | 作用 |
|------|-----|------|
| `-ngl 99` | 99 层 | 全部层放 GPU |
| `--flash-attn on` | 开 | 闪存注意力——大幅降低显存和加速推理 |
| `--jinja` | 开 | Jinja 模板引擎——更精确的提示词格式化 |
| `--reasoning off` | 关 | 禁用思考链——纯创作不需要推理步骤 |
| `-c 131072` | 128K | 上下文窗口大小 |
| `-t 12` | 12 线程 | CPU 线程数（按你 CPU 核心数调整） |
| `--cache-type-k q4_0` | q4_0 | KV 缓存量化——**大幅节省显存，128K 上下文也能跑** |
| `--cache-type-v q4_0` | q4_0 | 同上 |
| `--mlock` | 开 | 锁定内存——防止系统把模型换出到硬盘 |
| `--host/--port` | 127.0.0.1:8080 | 绑定本地地址 |

> 如果你的显存更大（如 RTX 4090 24G），可以开更大上下文：`-c 260000`。

**④ 在软件中配置**

⚙️ 设置 → 添加 LLM：

| 字段 | 值 |
|------|-----|
| 供应商 | 自托管 |
| 地址 | `http://127.0.0.1:8080` |
| 模型 | `qwen2.5-7b` |
| Key | 留空 |
| **模式** | ⚡ **Slot** |

测试连接 → ✅ 成功 → 在分角色参数中指定此 LLM → 保存。

---

## ✍️ 写作台——核心功能

### 发送流程

```
探测能力 → 模糊记忆(长文压缩) → 分批阅读全文 → 注入上下文 → 流式生成
```

### 写作方向怎么写

✅ "主角发现古城异常。暗中调查遇女记者，联手。要求：悬疑、对话自然、埋伏笔。"
❌ "写第四章"

**写什么：** 关键事件、角色互动、氛围、特殊要求。越具体越好。

### 右侧面板

| 面板 | 作用 |
|------|------|
| 📦 前置 SKILL | 你写的写作规则，AI 自动遵守 |
| 📋 写作上下文 | 世界树+角色+节奏数据自动注入 |
| 📖 行为规律 | 行为心理学原则参考 |

### 📦 SKILL 示例

新建 SKILL → 标题："对话规则"
内容："对话简短，一人一次≤三句。用动作带说话人。"

保存后勾选激活。支持导入 `.txt/.md/.docx/.xlsx/.json`。

---

## ⚙️ 配置详解

### LLM 工作模式

| 模式 | 说明 | 推荐 |
|------|------|------|
| ⚡ **Slot** | 发送 `slot_id` + `cache_prompt`——服务端缓存提示词，重复内容不重复计费。**DeepSeek 和 llama.cpp 都支持** | ✅ 推荐 |
| 🔵 Stateless | 标准 API——每次请求完整历史，兼容性最好但 Token 消耗大 | 不确定时选 |

> 设置页可**自动探测**模式，也可手动指定。

### 分角色参数

| 角色 | 温度 | 用途 |
|------|------|------|
| ✍️ 写作 | 0.8 | 生成内容 |
| 🔍 分析 | 0.7 | 分析结构 |
| 🔴 严审 | 0.3 | 严格审查 |
| 🟡 衡审 | 0.3 | 平衡审查 |
| 🟢 宽审 | 0.4 | 读者视角 |
| 🗳️ 投票 | 0.2 | 最终裁决 |
| 📚 技能 | 0.5 | 学习规律 |

### 质量门禁

通过 ≥ 75 | 修订 ≥ 50 | 人工 < 50（最多自动修订 3 轮）

---

## 📋 页面速览

| 页面 | 做什么 |
|------|--------|
| 🎨 创作台 | 欢迎页 |
| 📁 项目管理 | 创建/导入/锁定/分析 |
| ✍️ 写作台 | **核心——AI 辅助写作** |
| 🔍 审查室 | 三审官检查质量 |
| 🌳 世界树 | 主线/支线/伏笔 |
| 🧠 角色池 | 角色档案 |
| 📊 节奏控制台 | 评分+连续性 |
| ⚙️ 设置 | LLM/分角色/门禁 |
| 📋 历史日志 | 分析进度 |

---

## 📂 项目文件夹

```
projects/你的小说/
├── chapters/          ← 正式章节 + 写作方向
├── drafts/            ← 草稿(自动保存)
├── projectLog/v{N}/   ← 每次分析记录
│   ├── 分析报告_第1~5轮.md
│   └── writer_prompt_第001章.json ← 发给 AI 的完整提示词
├── worldTreeData/     ← 世界树
├── characterProfiles/   ← 角色池
├── tensionReports/    ← 节奏数据
├── reviews/           ← 审查记录
├── fuzzyMemory/       ← 长文压缩
├── skills/external/   ← 你的 SKILL → 写作时注入
└── skills/self/       ← AI 自动学习
```

---

## ❓ FAQ

**Q: 必须花钱吗？**
A: 本地 LLM 免费（需 8G+ 显卡）。API 很便宜，几块钱写一本书。

**Q: 要会编程吗？**
A: 不用。按教程敲几行命令。

**Q: 文风不对？**
A: 写作台右侧 📦 SKILL 创建规则。

**Q: 切页面会丢内容？**
A: 不会。自动存草稿。

**Q: 崩溃了？**
A: 刷新。数据在磁盘上。

**Q: 支持什么 AI？**
A: DeepSeek、OpenAI 兼容 API、本地 llama.cpp。

---

<br>
<br>

<a id="en"></a>

# 🇬🇧 English Documentation

---

## 🎯 Strengths & Limitations

### What It Solves

| Problem | Solution |
|---------|----------|
| **AI forgets earlier chapters** | Auto batch-reads entire novel before writing each chapter |
| **Character inconsistency** | Character pool tracks traits and auto-injects into prompts |
| **Can't tell if writing is good** | Triple AI reviewer pipeline (13 dimensions) |
| **Story structure chaos** | World Tree visualization |
| **High token costs** | Slot mode—context warmed once, reuse for all chapters |

### Limitations

| Limitation | Detail |
|-----------|--------|
| Requires Python setup | ~10 minutes |
| API costs money | Very cheap—~$0.50 per novel |
| Local LLM quality gap | Free but notably worse than cloud models |
| Not a one-click book generator | You still plan and edit—it's an assistant |

### Local LLM vs API

| | Local LLM | Cloud API (DeepSeek) |
|--|----------|---------------------|
| 💰 Cost | Free | ~$0.50/novel |
| 📝 Quality | ⚠️ Mediocre | ✅ Excellent |
| 🔧 Setup | GPU + config | Sign up → key → done |
| 🏠 Privacy | ✅ Local | Cloud |

> **Recommendation:** Most users should just buy API. It's dirt cheap and far simpler. If you enjoy tinkering and have a GPU, local is viable.

---

## ⚡ Quick Start

### 1. Install Python

[python.org](https://python.org/downloads) → download 3.10+ → **check Add to PATH**.

### 2. Install Dependencies

```bash
cd standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
```

### 3. Launch

Double-click **`超逸写手启动器.exe`** (GUI launcher).

Or `启动超逸写手.bat`.

Open **http://127.0.0.1:8899**.

### 4. Connect to AI

**Option A—Cloud API (Recommended)**

[platform.deepseek.com](https://platform.deepseek.com) → sign up → **API Keys** → create → copy `sk-...`.

In ⚙️ Settings: add LLM → provider DeepSeek → model `deepseek-chat` → paste key → **mode ⚡ Slot** → save → test.

> **Why Slot mode?** `cache_prompt` enables server-side prompt caching—repeated content isn't billed repeatedly. DeepSeek supports this (returns `prompt_cache_hit_tokens`). Stateless has best compatibility but re-processes full history each request, costing more tokens. When in doubt, use Stateless.

**Option B—Local LLM**

See [Local LLM Setup](#local-llm-setup) below.

---

## 📂 Scenarios

### A: Existing Document

Create project → Import → Lock → Analyze → Write.

### B: New Novel

Create → Lock → Write Chapter 1 directly. Analyze after 2-3 chapters.

### C: Local LLM Setup

**Requirements:** 8GB+ NVIDIA GPU.

**① Download llama.cpp** from [Releases](https://github.com/ggerganov/llama.cpp/releases) (Windows CUDA build) → extract to `standalone/LLM/bin/`

**② Download model** (e.g., Qwen2.5-7B-Instruct GGUF) → place in `LLM/models/`

**③ Create `start.bat`** with optimized parameters:

```bat
bin\llama-server.exe ^
  -m "models/your-model.gguf" ^
  -ngl 99 ^
  --flash-attn on ^
  --jinja ^
  --reasoning off ^
  -c 131072 ^
  -t 12 ^
  -b 1024 ^
  -ub 512 ^
  --cache-type-k q4_0 ^
  --cache-type-v q4_0 ^
  --mlock ^
  --host 127.0.0.1 ^
  --port 8080
pause
```

**Key parameters:**

| Param | Value | Purpose |
|-------|-------|---------|
| `-ngl 99` | 99 layers | All layers on GPU |
| `--flash-attn on` | on | Flash attention—drastically reduces VRAM and speeds inference |
| `--jinja` | on | Jinja template engine—better prompt formatting |
| `--reasoning off` | off | Disable chain-of-thought—creative writing needs no reasoning |
| `-c 131072` | 128K | Context window size |
| `-t 12` | 12 threads | CPU threads (adjust per your CPU) |
| `--cache-type-k q4_0` | q4_0 | KV cache quantization—**critical for running 128K context on limited VRAM** |
| `--cache-type-v q4_0` | q4_0 | Ditto |
| `--mlock` | on | Lock memory—prevent OS swapping model to disk |

> With RTX 4090 24GB, increase to `-c 260000`.

**④ Configure in app**

⚙️ Settings → add LLM: provider = Self-hosted, URL = `http://127.0.0.1:8080`, model = `qwen2.5-7b`, key = empty, **mode = ⚡ Slot**.

---

## ✍️ Writer Desk

**Flow:** Probe → compress (if text too long) → batch-read all chapters → inject context → stream generate.

**Writing direction:** Be specific. Include key events, character interactions, atmosphere, special requirements.

**SKILL system:** Writing rules AI follows. Check to activate. Import supports `.txt/.md/.docx/.xlsx/.json`.

---

## ⚙️ Configuration

### Work Mode

| Mode | Description | Recommend |
|------|-------------|-----------|
| ⚡ **Slot** | `slot_id` + `cache_prompt`—server-side prompt caching. **Supported by both DeepSeek and llama.cpp** | ✅ Default |
| 🔵 Stateless | Standard API—full history each request. Best compatibility but higher token usage | When unsure |

Auto-detect available, or manually set.

### Role Parameters

| Role | Temp | Purpose |
|------|------|---------|
| ✍️ Writer | 0.8 | Generate content |
| 🔍 Analysis | 0.7 | Story structure |
| 🔴 Strict | 0.3 | Rigorous review |
| 🟡 Balanced | 0.3 | Balanced review |
| 🟢 Lenient | 0.4 | Reader perspective |
| 🗳️ Voter | 0.2 | Final verdict |
| 📚 Skill | 0.5 | Learn patterns |

### Quality Gate

Pass ≥ 75 | Revise ≥ 50 | Manual < 50 (max 3 auto-revision cycles)

---

## 📋 Pages

| Page | Purpose |
|------|---------|
| 🎨 Creative Desk | Welcome |
| 📁 Project Manager | Create/import/lock/analyze |
| ✍️ Writer | **Core—AI-assisted writing** |
| 🔍 Review Room | Triple-reviewer quality check |
| 🌳 World Tree | Plot/branches/foreshadowing |
| 🧠 Character Pool | Character profiles |
| 📊 Rhythm Console | Scores + continuity |
| ⚙️ Settings | LLM/roles/gate |
| 📋 History Log | Analysis progress |

---

## ❓ FAQ

**Q: Is it free?**
A: Local LLM is free (needs 8GB+ GPU). API costs ~$0.50 per novel.

**Q: Need coding skills?**
A: No. Just follow the commands.

**Q: AI style doesn't match?**
A: Create SKILL rules in Writer sidebar.

**Q: Lose work switching pages?**
A: No. Auto-saved drafts.

**Q: Crash?**
A: Refresh. Data is on disk.

**Q: What models?**
A: DeepSeek, OpenAI-compatible, local llama.cpp.

---

# 📄 License

MIT © 2026 Rambolv
