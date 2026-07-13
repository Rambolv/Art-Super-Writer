<div align="center">

# 🖋️ 超逸写手 — Art Super Writer

**AI 辅助长篇小说创作系统 | AI-Assisted Novel Writing System**

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![HTML5](https://img.shields.io/badge/Frontend-Vanilla_JS-important?logo=html5)
[![Flask](https://img.shields.io/badge/Backend-Flask-black?logo=flask)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Rambolv/Art-Super-Writer?style=social)](https://github.com/Rambolv/Art-Super-Writer)

> **让每一位创作者都能拥有专属的 AI 编辑团队**  
> **Give every writer their own AI editorial team**

</div>

---

<p align="center">
  <a href="#cn">🇨🇳 中文</a> · <a href="#en">🇬🇧 English</a>
</p>

---

<a id="cn"></a>

# 🇨🇳 超逸写手

## 📋 概述

**超逸写手** 是一个面向长篇小说创作者的 **AI 辅助写作系统**。与传统 AI 写作工具不同，它模拟了一整套**专业编辑团队工作流**——从读者角度的深度分析，到多风格审查官的严格评审，再到带有完整故事上下文的辅助写作。

### 🎯 目标用户

- 长篇小说创作者 / 网文作者
- 希望用 AI 提升写作效率但不想失去创作掌控感的人
- 需要专业级故事分析（结构、角色、节奏）的写作者

---

## ✨ 核心特性

| 模块 | 功能 |
|------|------|
| 🧠 **AI 读者分析** | 8 步多轮对话深度阅读 → 剧情结构 / 角色档案 / 节奏数据 / 综合 JSON |
| ✍️ **AI 辅助写作** | 自动注入世界树+角色池+节奏数据作为上下文，流式 LLM 生成 |
| 🔍 **AI 审查流水线** | S1 机械闸(19条规则) → S2 三审查官(严/衡/宽) → 夹逼投票 → 质量门禁 → 自动修订 |
| 🌳 **世界树** | 四维剧情可视化：主干(主线) / 枝丫(支线) / 芽(伏笔) / 根系(世界观) |
| 🧠 **角色池** | 六芒星雷达图、角色卡折叠、自定义 AI 分析、一致性警告 |
| 📊 **节奏控制台** | 逐章阅读体验曲线、读者问题追踪、连续性健康度仪表盘 |
| 🔐 **安全存储** | API Key XOR+Base64 加密 + 机器指纹绑定 |
| 🌐 **双语言界面** | 中文 / English 一键切换 |
| 💾 **本地持久化** | 全部数据写入磁盘，刷新/重启不丢失，支持多项目并行 |

---

## 🚀 快速开始

### 前提条件

- **Python 3.10+**（[下载](https://python.org/downloads)）
- **一个 LLM API**（推荐 [DeepSeek](https://platform.deepseek.com/)，也支持 OpenAI 兼容 API / 本地 llama.cpp）

### 一键启动

```bash
git clone https://github.com/Rambolv/Art-Super-Writer.git
cd Art-Super-Writer/standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
python launcher.py
```

浏览器打开 **http://127.0.0.1:8899**

> 💡 Windows 用户也可双击 `启动超逸写手.bat`

---

## 📖 完整使用流程

### 1️⃣ 配置 API Key

进入 **⚙️ 设置** → 选择 LLM 供应商 → 输入 API Key → 「🔑 保存」→ 「🔌 测试连接」

支持多 LLM 配置：分析用 DeepSeek、写作用 Qwen 本地模型等，可分别设置。

### 2️⃣ 创建 / 导入项目

进入 **📁 项目管理**：
- **新建**：输入名称、故事前提、类型 → 「✨ 创建」
- **导入**：选择 `.md` / `.txt` 文件 → 「📥 导入」（自动设为第一章）

### 3️⃣ 锁定项目

在项目列表中点击「🔒 锁定」，锁定后所有模块以该项目为核心运作。
2. 点击「🔒 锁定」按钮
3. 锁定后，所有功能模块（写作台/审查室/世界树/角色池等）均以该项目为核心运作

### 第四步：AI 分析

1. 点击「🧠 角色池」（或其他分析相关页面）
2. 点击「🔄 AI 重新分析」按钮
3. AI 将执行 **8 步多轮对话**：
   - 第 1 轮：逐章阅读体验
   - 第 2 轮：故事结构提取（主线/支线/伏笔/设定）
   - 第 3 轮：角色印象分析
   - 第 4 轮：节奏感受评估
   - 第 5 步：综合 JSON 数据生成

> ⚠️ 分析过程中请勿刷新页面。分析完成后数据自动保存到磁盘。

### 第五步：查看分析结果

分析完成后，可以在各模块查看结果：

- **🌳 世界树** — 主线推进到哪些节点、支线状态、未解决伏笔（按紧急度排序）、世界观设定
- **🧠 角色池** — 每个角色的定位、特点、行事风格、在意/害怕、人际关系、言行一致性警告
- **📊 节奏控制台** — 每章翻页吸引力评分、情感变化曲线、读者最想知道的问题

### 第六步：AI 辅助写作

1. 点击「✍️ 写作台」
2. 左侧是写作表单：
   - **写作方向**：输入本章想要写的内容方向
   - **温度参数**：调高 = 更有创意，调低 = 更稳定
   - **字数目标**：设定本章目标字数
3. 点击「✍️ 开始写作」，AI 将**流式生成**内容（实时显示）
4. 生成完成后可以：
   - 「💾 保存草稿」→ 保存到 `drafts/` 文件夹
   - 「📝 定稿到章节」→ 正式写入 `chapters/` 文件夹
   - 「📊 分析本章」→ 对本章内容进行独立分析

> 💡 AI 写作时会自动注入：世界树数据、角色档案、节奏数据、写作建议——确保角色一致性和情节连贯性。

### 第七步：审查与修订

1. 点击「🔍 审查室」
2. 选择要审查的章节 → 点击「🔍 审查」
3. 审查流水线自动执行：

```
⚙️ S1 机械闸（19 条正则规则 + 连续性引擎）
   ├── 标点检查：半角标点混入、破折号过量、省略号滥用
   ├── AI 禁用句式：总结性短语、二元对比模板、句首填充词、自问自答
   ├── 结构检查：段落长度均匀性、句子单一性
   └── 连续性检查：角色缺席、支线停滞、伏笔超期、死角色活跃
        ↓
🔴 S2 严审官（温度 0.3，严格标准）
🟡 S2 衡审官（温度 0.3，综合评价）
🟢 S2 宽审官（温度 0.4，关注亮点）
        ↓
🗳️ 夹逼定理投票（三审取中值 + 13 维度加权）
        ↓
🚪 质量门禁（通过≥75 / 修订≥50 / 人工<50）
        ↓
🔄 如需修订 → AI 自动修订 → 重审 → 最多 3 次迭代
```

4. 编辑器支持 **撤销/重做**（Ctrl+Z / Ctrl+Y）
5. 点击建议卡片可**自动定位并应用修改**

### 第八步：定稿与管理

- 审查通过后，在编辑器中点击「✅ 已定稿」确认
- 在「项目管理」页可查看项目统计：章节数、角色数、总字数、均分
- 点击「💾 导出到磁盘文件夹」将所有数据写入磁盘

### 日常使用循环

```
📝 写作 → 🔍 审查 → 🔄 修订 → ✅ 定稿
   ↑                              ↓
   └──── 分析结果回流注入 ←────────┘
```

每次写完新章后，建议重新运行 AI 分析以更新世界树和角色数据，让下一章的写作拥有最新上下文。

---

## 🏗️ 项目结构

```
standalone/
├── index.html              # 💎 单文件前端应用（~16K 行，CSS+HTML+JS）
├── server.py               # 🐍 Python HTTP API 服务器（Flask，端口 8899）
├── launcher.py             # 🚀 一键启动脚本
├── 启动超逸写手.bat          # 🪟 Windows 一键启动
├── start_server.bat        # 🪟 仅启动服务器
│
├── docs/                   # 📚 开发文档
│   ├── 设计决策记录.md       # 所有技术决策记录
│   ├── 快速开发文档.md       # 开发指南
│   ├── LLM交互流程文档.md    # LLM 提示词与交互流程
│   └── 审查室数据流图.md     # 审查模块数据流
│
├── projects/               # 📂 小说项目数据（.gitignore 排除）
│   └── {项目名}/
│       ├── project.json     # 项目元数据
│       ├── chapters/        # 章节文件 .md
│       ├── drafts/          # 草稿
│       ├── worldTreeData/   # 世界树分析结果（版本化）
│       ├── characterProfiles/ # 角色分析结果（版本化）
│       ├── tensionReports/  # 节奏分析结果（版本化）
│       ├── fuzzyMemory/     # 模糊记忆上下文
│       ├── projectLog/      # 分析日志（版本化）
│       ├── skills/          # AI 学习的写作技巧
│       ├── config/          # 审查状态、故事状态
│       └── story_state.json # 角色位置/情节线/伏笔/时间线
│
└── .gitignore
```

---

## 💡 架构亮点

### 纯前端 + 本地服务器架构

```
浏览器 (index.html)              Python 服务器 (server.py)
┌─────────────────────┐         ┌──────────────────────┐
│  SPA 应用             │  HTTP  │  文件 API              │
│  • 所有 UI 逻辑       │ ←────→ │  • 读/写/删文件         │
│  • LLM 调用（直接）    │        │  • 项目元数据管理       │
│  • 数据分析与渲染      │        │  • 锁定状态管理         │
│  • localStorage 缓存  │        │  • 文件夹创建           │
└─────────────────────┘         └──────────────────────┘
       │                                │
       │  LLM API (直接浏览器调用)        │  磁盘
       ▼                                ▼
  DeepSeek / OpenAI / ...         projects/{项目名}/
```

- **LLM 调用直接从浏览器发出**，不经过后端代理（避免服务器成为瓶颈）
- **磁盘是主存储**，localStorage 仅做缓存（服务器离线时可用）
- **纯静态前端**，可部署到任何静态服务器

### 版本化分析结果

每次 AI 分析生成一个版本号，数据写入 `worldTreeData/v{N}/`、`characterProfiles/v{N}/` 等子文件夹。支持在模块顶部切换查看历史版本。

### SKILL 系统（写作技巧学习）

AI 分析完成后，自动从作品中学习写作技巧并保存到 `skills/` 文件夹。写作时可选择导入特定 SKILL 作为 LLM 提示词上下文。

---

## 🔧 配置多个 LLM

进入 **⚙️ 设置 → 分角色参数配置**，可为不同角色指定不同 LLM：

| 角色 | 推荐 LLM | 说明 |
|------|----------|------|
| 🔍 分析 | DeepSeek V4 | 上下文大，成本低 |
| ✍️ 写作 | 任意 | 按写作风格偏好选择 |
| 🔴 严审 | DeepSeek / GPT | 严格标准 |
| 🟡 衡审 | 同上 | 综合评价 |
| 🟢 宽审 | 同上 | 关注亮点 |
| 📚 技能学习 | 与分析一致 | 后台运行 |

也支持**本地模型**（如通过 llama.cpp 启动的 Qwen），在设置中添加供应商为 `http://127.0.0.1:8080/v1` 即可。

---

## 🤝 贡献

欢迎提交 Issue 和 PR。如果您想贡献代码，请先阅读 `docs/` 目录下的开发文档。

---

## 📄 许可

[MIT](LICENSE)

---

<a id="en"></a>

# 🇬🇧 Art Super Writer

## 📋 Overview

**Art Super Writer** is an AI-assisted novel writing system designed for long-form fiction creators. Unlike conventional AI writing tools, it simulates a **complete professional editorial workflow**—from deep reader-perspective analysis, through multi-style reviewer scrutiny, to context-rich AI-assisted writing.

### 🎯 Who It's For

- Novelists and web fiction authors
- Writers who want AI efficiency without losing creative control
- Anyone needing professional-grade story analysis (structure, characters, pacing)

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🧠 **AI Reader Analysis** | 8-step multi-turn dialogue → plot structure / character profiles / pacing data / comprehensive JSON |
| ✍️ **AI Writing Assistant** | Auto-injects world tree + character pool + pacing data as context, streaming LLM generation |
| 🔍 **AI Review Pipeline** | S1 Mechanical Gate(19 rules) → S2 Three Reviewers → Squeeze Voting → Quality Gate → Auto Revision |
| 🌳 **World Tree** | Quad-dimensional visualization: Trunk(main plot) / Branches(subplots) / Buds(foreshadowing) / Roots(worldbuilding) |
| 🧠 **Character Pool** | Hexagram radar chart, collapsible cards, custom AI analysis, consistency warnings |
| 📊 **Pacing Console** | Chapter-by-chapter engagement curves, reader questions tracker, continuity health dashboard |
| 🔐 **Secure Storage** | XOR+Base64 API key encryption with machine fingerprint binding |
| 🌐 **Bilingual UI** | Chinese / English one-click switch |
| 💾 **Local Persistence** | All data written to disk, survives refresh/restart, multi-project support |

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** ([Download](https://python.org/downloads))
- **An LLM API key** ([DeepSeek](https://platform.deepseek.com/) recommended, also supports OpenAI-compatible APIs / local llama.cpp)

### One-Click Launch

```bash
git clone https://github.com/Rambolv/Art-Super-Writer.git
cd Art-Super-Writer/standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
python launcher.py
```

Open **http://127.0.0.1:8899** in your browser.

> 💡 Windows users can also double-click `启动超逸写手.bat`.

---

## 📖 Usage Guide

### 1️⃣ Configure API Key

Go to **⚙️ Settings** → Select LLM provider → Enter API Key → **Save** → **Test Connection**

Supports multiple LLM configurations: use DeepSeek for analysis, Qwen local model for writing, etc.

### 2️⃣ Create / Import Project

Go to **📁 Project Management**:
- **Create**: Enter name, premise, genre → **Create**
- **Import**: Select `.md` / `.txt` files → **Import** (auto-sets as Chapter 1)

### 3️⃣ Lock Project

Click **Lock** on your project. All modules operate around the locked project.

### 4️⃣ AI Analysis

Click **Re-analyze**. The AI performs an 8-step multi-turn dialogue analysis. Results appear in World Tree, Character Pool, and Pacing Console.

### 5️⃣ AI-Assisted Writing

Go to **✍️ Writing Desk** → Enter writing direction → Set temperature → Set word count target → **Start Writing**

The AI auto-injects world tree data, character profiles, pacing data, and writing skills as context.

### 6️⃣ Review & Revise

Go to **🔍 Review Room** → Select chapter → **Review**

The pipeline runs: S1 Mechanical Gate → S2 Three Reviewers → Squeeze Voting → Quality Gate → Auto Revision (up to 3 iterations).

---

## 🏗️ Architecture

```
Browser (index.html)              Python Server (server.py)
┌─────────────────────┐         ┌──────────────────────┐
│  SPA Application     │  HTTP  │  File API             │
│  • All UI logic      │ ←────→ │  • Read/Write/Delete  │
│  • Direct LLM calls  │        │  • Project metadata   │
│  • Data rendering    │        │  • Lock state         │
│  • localStorage      │        │  • Folder creation    │
└─────────────────────┘         └──────────────────────┘
       │                                │
       │  LLM API (browser direct)       │  Disk
       ▼                                ▼
  DeepSeek / OpenAI / ...         projects/{project}/
```

- **LLM calls are made directly from the browser** (no backend proxy)
- **Disk is primary storage**, localStorage is cache-only
- **Pure static frontend**, deployable anywhere

---

## 🤝 Contributing

Issues and PRs welcome. Please read `docs/` for development documentation.

---

## 📄 License

[MIT](LICENSE)
│       ├── characterProfiles/ # 角色档案/批量备份
│       ├── worldTreeData/   # 世界树 JSON
│       ├── tensionReports/  # 节奏报告
│       ├── fuzzyMemory/     # 模糊记忆
│       ├── projectLog/      # 分析日志
│       ├── skills/          # 写作技巧库
│       ├── config/          # 项目配置
│       ├── styleMemory/     # 风格记忆
│       └── referenceNotes/  # 参考笔记
```

---

## 设计理念

| # | 原则 | 说明 |
|---|------|------|
| 1 | **LLM 以读者身份分析** | AI 扮演刚读完小说的普通读者，而非文学评论家 |
| 2 | **分析结果回流写作** | 世界树/角色池/节奏数据自动注入写作台 LLM 上下文 |
| 3 | **一次写好** | 追求单次写作质量，不过度依赖多轮修订 |
| 4 | **展示与注入并行** | 数据既要给人看，也要同时注入 AI 写作上下文 |
| 5 | **LLM 自行归类输出** | LLM 直接输出结构化 JSON，前端只负责存储和展示 |
| 6 | **免强制心理学框架** | 不做 OCEAN/Dark Triad 硬性标定，读者自然描述角色 |
| 7 | **世界树 ≠ 模糊记忆** | 世界树 = 精确结构（无损）；模糊记忆 = 压缩回退（有损） |
| 8 | **夹逼定理优选** | 三审取中间值，避免极端评分，数学上保证稳定性 |

---

## 配置说明

### 质量门禁阈值

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 通过阈值 | 75 | ≥此分直接通过 |
| 修订阈值 | 50 | ≥此分自动修订 |
| 最大迭代次数 | 3 | 修订重审最多轮数 |
| 严审最低维度分 | 5 | 任何维度低于此分 → 人工处理 |

---

## 优劣势分析

### ✅ 优势

- **零配置** — 仅需浏览器 + Python，无需 npm/node/数据库
- **单文件架构** — 前端全部在一个 HTML 文件中，易于理解和修改
- **深度分析** — 8 步多轮对话提取丰富的故事洞察
- **读者视角** — AI 以读者而非机器视角评判
- **夹逼审查** — 三审官+数学投票，避免单一评判偏差

### ❌ 局限性

- **需 API Key** — 必须有 DeepSeek 或兼容 LLM 的 API Key
- **依赖网络** — AI 功能需要互联网连接
- **纯前端架构** — HTML5 原生界面，无 React/Vue 框架
- **单用户** — 无多用户或协作功能

---

## 路线图

| 状态 | 功能 |
|:----:|------|
| ✅ | 项目管理、AI 分析、世界树、角色池、节奏控制台 |
| ✅ | 写作台（流式生成 + 上下文注入 + 定稿） |
| ✅ | 审查室（S1 机械闸 + S2 三审 + 夹逼投票 + 质量门禁 + 修订循环） |
| ✅ | API Key 加密、双语言切换、磁盘持久化 |
| 🔜 | S0 输入闸、连续性引擎增强、写作技能学习器 |
| 🔜 | Docker 部署、macOS/Linux 启动脚本 |

---

## 常见问题

**Q: API Key 安全吗？**
A: Key 使用 XOR + Base64 加密 + 机器指纹绑定存储，不会明文暴露。

**Q: 分析需要多长时间？**
A: 取决于小说长度，通常 5 章约 2-5 分钟。分析过程中请勿刷新页面。

**Q: 数据存在哪里？**
A: 全部数据在 `projects/{项目名}/` 文件夹中，纯文件存储，可随时备份。

**Q: 刷新页面数据会丢失吗？**
A: 不会。所有数据即时写入磁盘，刷新/重启自动恢复。

---

# 🇬🇧 English

## Overview

**Art Super Writer** is an AI-assisted novel writing system that simulates a **complete editorial workflow**:

| Role | Responsibility |
|------|---------------|
| 🧠 **AI Analyst** | 8-step multi-turn deep reading — extracts plot structure, character profiles, pacing data |
| ✍️ **AI Writing Assistant** | Injects world tree / character pool / rhythm data as context for writing the next chapter |
| 🔍 **AI Reviewer** | Three reviewers (Strict / Balanced / Lenient) in parallel + Squeeze Theorem voting + Quality Gate |
| 📊 **AI Reader** | Provides feedback from a real reader's perspective — page-turner scores, burning questions |

> 🎯 **Target Audience**: Novelists, web fiction authors, anyone who wants to leverage AI for better writing.

---

## Features (All Completed ✅)

| Module | Features |
|--------|----------|
| 📁 **Project Management** | Create / lock / delete projects, import `.md` / `.txt` files |
| 🧠 **AI Reader Analysis** | 8-step multi-turn: chapter reading → structure → characters → rhythm → unified JSON |
| ✍️ **Writing Studio** | Context injection, streaming LLM generation, save drafts, finalize chapters |
| 🔍 **Review Chamber** | S1 Gate (19 regex + continuity engine) → S2 Three Reviewers → Squeeze voting → Quality Gate → Revision loop |
| 🌳 **World Tree** | 4D visualization: Trunk / Branches / Buds (foreshadowing) / Roots (world-building) |
| 🧠 **Character Pool** | Hexagon radar chart, collapsible cards, add/edit/delete characters, custom AI analysis |
| 📊 **Tension Console** | Per-chapter reading metrics, top reader questions, pacing assessment, continuity dashboard |
| 🔐 **API Key Security** | XOR + Base64 encryption with machine fingerprint binding |
| 🌐 **Bilingual UI** | Chinese / English one-click switch |
| 💾 **Local Persistence** | All data written to disk immediately |
| 📋 **History Log** | Analysis logs + operation logs with timeline |

---

## Quick Start

### Prerequisites

- **Python 3.10+** ([Download](https://python.org/downloads))
- **DeepSeek API Key** ([Get one](https://platform.deepseek.com/))

### Installation

```bash
git clone https://github.com/Rambolv/Art-Super-Writer.git
cd Art-Super-Writer/standalone
python -m venv .venv
.venv\Scripts\activate
python launcher.py
```

Open `http://127.0.0.1:8899` in your browser.

> 💡 Windows users can also double-click `start_server.bat`.

---

## Complete Usage Flow

### Step 1: Configure API Key

1. Click ⚙️ Settings in the left navigation
2. Select **DeepSeek** under LLM Provider
3. Enter your API Key, click 🔑 Save Key
4. Click 🔌 Test Connection to verify

### Step 2: Create / Import Project

1. Click 📁 Project Management
2. Right panel → 🆕 Create New Project → enter name, premise, genre → click ✨ Create
3. Or click 📥 Import → select your existing `.md` or `.txt` chapter files → 📥 Import

### Step 3: Lock Project

1. Find your project in the project list
2. Click the 🔒 Lock button
3. Once locked, all modules operate on this project

### Step 4: AI Analysis

1. Click 🧠 Character Pool (or any analysis-related page)
2. Click 🔄 Re-Analyze button
3. AI performs an **8-step multi-turn dialogue**:
   - Round 1: Chapter-by-chapter reading experience
   - Round 2: Story structure extraction (main plot / subplots / foreshadowing / world-building)
   - Round 3: Character impression analysis
   - Round 4: Rhythm and pacing assessment
   - Step 5: Unified JSON data generation

> ⚠️ Do not refresh the page during analysis. Data is auto-saved to disk upon completion.

### Step 5: Explore Analysis Results

- **🌳 World Tree** — Main plot milestones, subplot status, unresolved foreshadowing (by urgency)
- **🧠 Character Pool** — Each character: role, traits, decision style, cares/fears, relationships, consistency warnings
- **📊 Tension Console** — Per-chapter page-turner scores, emotion curves, top reader questions

### Step 6: AI-Assisted Writing

1. Click ✍️ Writing Studio
2. Left panel — writing form:
   - **Direction**: Describe what you want to write in this chapter
   - **Temperature**: Higher = more creative, Lower = more consistent
   - **Word Target**: Set target word count
3. Click ✍️ Start Writing — AI generates content with **streaming** (real-time display)
4. After generation:
   - 💾 Save Draft → saves to `drafts/` folder
   - 📝 Finalize to Chapter → writes to `chapters/` folder
   - 📊 Analyze Chapter → independent chapter analysis

> 💡 The AI Writer automatically receives: world tree data, character profiles, rhythm data, and writing advice — ensuring consistency.

### Step 7: Review & Revise

1. Click 🔍 Review Chamber
2. Select chapter → Click 🔍 Review
3. The review pipeline runs automatically:

```
⚙️ S1 Mechanical Gate (19 regex rules + Continuity Engine)
   ├── Punctuation: half-width mixing, excessive dashes, ellipsis abuse
   ├── AI-banned: summary phrases, binary contrast, sentence fillers, rhetorical questions
   ├── Structure: paragraph length uniformity, sentence monotony
   └── Continuity: absent characters, stalled subplots, overdue foreshadowing, dead character activity
        ↓
🔴 S2 Strict Reviewer  (temp 0.3, rigorous)
🟡 S2 Balanced Reviewer (temp 0.3, comprehensive)
🟢 S2 Lenient Reviewer  (temp 0.4, highlights strengths)
        ↓
🗳️ Squeeze Theorem Voting (median of 3 reviews + 13-dimension weighting)
        ↓
🚪 Quality Gate (PASS ≥75 / REVISE ≥50 / MANUAL <50)
        ↓
🔄 If revision needed → AI auto-revise → re-review → up to 3 iterations
```

4. Editor supports **Undo / Redo** (Ctrl+Z / Ctrl+Y)
5. Click suggestion cards to **auto-locate and apply changes**

### Step 8: Finalize & Manage

- After passing review, click ✅ Approved in the editor
- In Project Management, view stats: chapter count, character count, total words, average score
- Click 💾 Export to Disk to persist all data

### Daily Workflow Loop

```
✍️ Write → 🔍 Review → 🔄 Revise → ✅ Finalize
   ↑                              ↓
   └── Analysis feedback injection ←──┘
```

After each new chapter, re-run AI analysis to update world tree and character data.

---

## Project Structure

```
standalone/
├── index.html              # Main app (~5300 lines)
├── server.py               # Python HTTP API server (port 8899)
├── launcher.py             # One-click launcher
├── start_server.bat        # Server-only startup
│
├── projects/               # All novel project data
│   └── {project_name}/
│       ├── chapters/        # Chapter .md files
│       ├── drafts/          # Writing drafts
│       ├── reviews/         # Review records (JSON)
│       ├── characters/      # Individual character JSON
│       ├── characterProfiles/ # Character profiles / bulk backup
│       ├── worldTreeData/   # World tree JSON
│       ├── tensionReports/  # Rhythm reports
│       ├── fuzzyMemory/     # Fuzzy memory
│       ├── projectLog/      # Analysis logs
│       ├── skills/          # Writing skill library
│       ├── config/          # Project config
│       ├── styleMemory/     # Style memory
│       └── referenceNotes/  # Reference notes
```

---

## Design Philosophy

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **LLM as Reader** | AI roleplays a regular reader, not a literary critic |
| 2 | **Analysis Feeds Writing** | World tree / character / rhythm data auto-injected into Writer context |
| 3 | **Write Well Once** | Aim for quality in a single pass |
| 4 | **Show & Inject** | Display insights AND feed them to AI simultaneously |
| 5 | **LLM Self-Classification** | LLM outputs structured JSON; frontend only stores and displays |
| 6 | **No Mandatory Psychology** | No OCEAN / Dark Triad; natural descriptions suffice |
| 7 | **World Tree ≠ Fuzzy Memory** | World Tree = lossless; Fuzzy Memory = lossy compression |
| 8 | **Squeeze Theorem Voting** | Median of 3 reviews eliminates extremes, mathematically stable |

---

## Configuration

### Quality Gate Thresholds

| Parameter | Default | Description |
|-----------|---------|-------------|
| Pass Threshold | 75 | Score ≥ this → PASS |
| Revise Threshold | 50 | Score ≥ this → auto-revise |
| Max Iterations | 3 | Max revision cycles |
| Strict Min Dimension | 5 | Any dimension below → MANUAL |

---

## Pros & Cons

### ✅ Advantages

- **Zero setup** — Browser + Python only
- **Single-file** — Entire frontend in one HTML file
- **Deep analysis** — 8-step multi-turn dialogue
- **Reader perspective** — AI judges as a real reader
- **Squeeze review** — Three reviewers + mathematical voting
- **Encrypted keys** — XOR+Base64 + machine fingerprint

### ❌ Limitations

- **Requires API Key** — DeepSeek or compatible LLM API key needed
- **Internet-dependent** — AI features require network
- **Vanilla frontend** — HTML5 native UI, no framework
- **Single-user** — No collaboration features

---

## Roadmap

| Status | Feature |
|:------:|---------|
| ✅ | Project management, AI analysis, World Tree, Character Pool, Tension Console |
| ✅ | Writing Studio (streaming + context injection + finalization) |
| ✅ | Review Chamber (S1 gate + S2 reviewers + squeeze voting + quality gate + revision loop) |
| ✅ | API Key encryption, bilingual UI, disk persistence |
| 🔜 | S0 input gate, enhanced continuity engine, writing skill learner |
| 🔜 | Docker deployment, macOS/Linux launcher scripts |

---

## FAQ

**Q: Is my API Key secure?**
A: Keys stored with XOR + Base64 encryption + machine fingerprint — never plaintext.

**Q: How long does analysis take?**
A: Typically 2-5 minutes for 5 chapters. Do not refresh during analysis.

**Q: Where is data stored?**
A: All data in `projects/{project_name}/` folder — backup anytime.

**Q: Will data be lost on refresh?**
A: No. All data written to disk immediately, auto-restored on refresh.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for storytellers | 为讲故事的人而做**

[⬆ Back to top / 回到顶部](#-超逸写手--art-super-writer)

</div>
