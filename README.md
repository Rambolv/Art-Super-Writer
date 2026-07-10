<div align="center">

# 🖋️ 超逸写手 — Art Super Writer

**AI 辅助长篇小说创作系统**  
**AI-Assisted Novel Writing System**

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![HTML5](https://img.shields.io/badge/Frontend-HTML5_SSA-orange?logo=html5)](https://html.spec.whatwg.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Rambolv/Art-Super-Writer?style=social)](https://github.com/Rambolv/Art-Super-Writer)

> **让每一位创作者都能拥有专属的 AI 编辑团队**  
> **Give every writer their own AI editorial team**

</div>

---

## 📋 Table of Contents / 目录

- [Overview / 概述](#overview--概述)
- [Features / 功能特性](#features--功能特性)
- [Tech Stack / 技术栈](#tech-stack--技术栈)
- [Quick Start / 快速开始](#quick-start--快速开始)
- [Usage Guide / 使用指南](#usage-guide--使用指南)
- [Project Structure / 项目结构](#project-structure--项目结构)
- [Design Philosophy / 设计理念](#design-philosophy--设计理念)
- [Pros & Cons / 优劣势分析](#pros--cons--优劣势分析)
- [Configuration / 配置说明](#configuration--配置说明)
- [Data Flow / 数据流程](#data-flow--数据流程)
- [Roadmap / 开发路线图](#roadmap--开发路线图)
- [Troubleshooting / 常见问题](#troubleshooting--常见问题)
- [License / 许可证](#license--许可证)

---

## Overview / 概述

### 🇨🇳 中文

**超逸写手（Art Super Writer）** 是一款 AI 辅助长篇小说创作系统。它不像普通的写作工具那样只做文字编辑，而是模拟了一个**完整的编辑团队工作流**：

1. **AI 读者** — 通读你的小说，从普通读者视角反馈阅读体验
2. **AI 分析师** — 提取剧情结构（主线、支线、伏笔）、角色档案、节奏数据
3. **AI 写作助手** — 基于分析结果，辅助你创作下一章，保持角色一致性和情节连贯性
4. **AI 审查官** — 三位不同风格的审查官（严审/衡审/宽审）并行评审，通过夹逼定理投票选出最佳方案

> 🎯 **目标用户**：长篇小说创作者、网文作者、任何希望借助 AI 提升写作效率和质量的人。

### 🇬🇧 English

**Art Super Writer (ASR Writer)** is an AI-assisted novel writing system. Unlike ordinary writing tools, it simulates a **complete editorial workflow**:

1. **AI Reader** — Reads your entire novel and provides feedback from a real reader's perspective
2. **AI Analyst** — Extracts plot structure (main plot, subplots, foreshadowing), character profiles, and pacing data
3. **AI Writing Assistant** — Uses analysis results to help you write the next chapter, maintaining character consistency and plot coherence
4. **AI Reviewers** — Three reviewers (Strict / Balanced / Lenient) evaluate in parallel, using Squeeze Theorem voting to select the best result

> 🎯 **Target Audience**: Novel writers, web fiction authors, and anyone who wants to leverage AI to improve writing efficiency and quality.

---

## Features / 功能特性

### ✅ Completed / 已完成

| Feature / 功能 | Description / 说明 |
|----------------|-------------------|
| 📁 **Project Management** | Create / select / lock / delete projects; import `.md` / `.txt` files |
| ⚙️ **Settings Panel** | LLM provider / API Key (encrypted + dual-mode management) / quality gate thresholds / 13-dimension weights |
| 🤖 **AI Reader Analysis** | 8-step multi-turn dialogue with DeepSeek API to analyze full novel |
| 🌳 **World Tree** | Visualize main plot, subplots, foreshadowing ("buds"), world-building ("roots") |
| 🧠 **Character Pool** | Character cards with personality tags, traits, relationships, consistency warnings |
| 📊 **Tension Console** | Per-chapter reading experience, reader questions, pacing guidance |
| 🔐 **API Key Security** | XOR + Base64 encryption with machine fingerprint binding |
| 🌐 **I18n Support** | Chinese / English language switching |
| 💾 **Local Persistence** | All data saved to disk files in project folders |

### ⏳ Planned / 待开发

| Feature / 功能 | Description / 说明 |
|----------------|-------------------|
| ✍️ **Writing Studio** | Core writer module — inject world tree, character pool, rhythm data as AI context |
| 🔍 **Review Chamber** | S1 regex gate + S2 three reviewers + Squeeze Theorem voting + quality gate |
| 📜 **History Log** | Project operation history timeline |

---

## Tech Stack / 技术栈

| Layer / 层 | Technology / 技术 |
|-------------|-------------------|
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript (Single Page Application, ~2000 lines in one file) |
| **Backend** | Python 3 + `http.server` (port 8899, for disk I/O) |
| **Chart** | Chart.js v4.4.7 (quality trends) |
| **LLM API** | DeepSeek API (browser-side direct call) |
| **Encryption** | XOR + Base64 (API Key protection) |

### Why Vanilla JS? / 为什么用纯 JS？

- Zero build tooling — edit and refresh, instant feedback
- Zero dependencies — just a browser and Python
- Single HTML file — easy to share, back up, and deploy

---

## Quick Start / 快速开始

### Prerequisites / 前提条件

- **Python 3.10+** installed ([Download](https://python.org/downloads))
- A **DeepSeek API key** ([Get one here](https://platform.deepseek.com/))

### Installation / 安装

**Option 1: One-click launcher (recommended)**

```bash
# Clone the repo
git clone https://github.com/Rambolv/Art-Super-Writer.git
cd Art-Super-Writer

# Set up virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS / Linux

# Install dependencies (only http.server, which is built-in; no extra packages needed)

# Launch
python launcher.py
```

**Option 2: Manual start**

```bash
# Start the Python backend server
.venv\Scripts\python server.py

# Then open index.html in your browser
# Or simply double-click start_server.bat (Windows)
```

Then open `http://127.0.0.1:8899` (server auto-serves `index.html`).

### First Steps / 首次使用

1. **Create a project** → Enter a project name and click "Create"
2. **Lock the project** → Click the lock icon to enable other modules
3. **Import your novel** → Upload `.md` or `.txt` files
4. **Add your API Key** → Go to Settings, enter your DeepSeek API Key
5. **Analyze** → Click the "Analyze" button, AI will read and analyze your entire novel
6. **Explore results** → View World Tree, Character Pool, Tension Console

---

## Usage Guide / 使用指南

### 📁 Project Management / 项目管理

```
[Create Project] → Enter name → Lock project 🔒
    ↓
[Import Files] → Upload .md/.txt files (multi-file supported)
    ↓
[Analyze] → One-click, AI Reader analyzes the full novel
    ↓
[Explore Modules] → World Tree / Character Pool / Tension Console
```

### 🏠 Home Page

- **Create new project** — Name your writing project
- **Select existing project** — Click to switch
- **Lock system** — Prevents accidental use of unrelated modules

### 🌳 World Tree / 世界树

Visualizes your novel's structure through four metaphors:

| Metaphor / 隐喻 | Meaning / 含义 |
|----------------|---------------|
| **Trunk (主干)** | Main plot events, ordered chronologically with importance scores |
| **Branches (枝丫)** | Subplots in progress, with relation score to main plot |
| **Buds (芽)** | Unresolved foreshadowing, sorted by reader urgency |
| **Roots (根系)** | World-building: locations, rules, history, other settings |

### 🧠 Character Pool / 角色池

Each character has:
- Role classification (Protagonist / Antagonist / Major / Minor)
- Personality traits and decision-making style
- What they care about and fear most
- Relationship map with other characters
- Consistency warnings (behaviors that might break character)

### 📊 Tension Console / 节奏控制台

- Per-chapter reading appeal and emotion scores
- Top questions readers want answered
- Overall pacing assessment and next chapter guidance

---

## Project Structure / 项目结构

```
standalone/
├── index.html               # Main app (single HTML file, all UI/CSS/JS)
├── server.py                # Python HTTP API server (port 8899)
├── launcher.py              # One-click launcher script
├── start_server.bat         # Server startup batch file (Windows)
├── README.md                # This file
├── .gitignore               # Git ignore rules
│
├── projects/                # All your novel projects
│   ├── __asr_writer_meta__/ # System metadata (API keys, etc.)
│   └── {project_name}/      # Each project's folder
│       ├── chapters/        # Chapter files (.md)
│       ├── drafts/          # Draft versions
│       ├── reviews/         # Review records
│       ├── worldTreeData/   # Plot structure data (JSON)
│       ├── characterProfiles/ # Character profiles
│       ├── tensionReports/  # Pacing reports
│       ├── fuzzyMemory/     # Fuzzy memory (compressed summaries)
│       ├── projectLog/      # Analysis logs and reports
│       ├── skills/          # Writing skill library
│       │   ├── external/    # External skill rules
│       │   └── self/        # Self-learned strengths/weaknesses
│       ├── config/          # Project settings
│       ├── styleMemory/     # Style memory
│       └── referenceNotes/  # Reference notes
│
├── 快速开发文档.md            # Quick dev guide (Chinese)
├── 设计决策记录.md            # Design decisions (Chinese)
├── 项目开发记录.md            # Development log (Chinese)
├── 项目状态.md                # Project status (Chinese)
├── 会话上下文.md              # Session context (Chinese)
├── LLM交互流程文档.md         # LLM interaction flow (Chinese)
└── 历史对话记录.txt           # Chat history
```

---

## Design Philosophy / 设计理念

### 🇨🇳 核心原则

| # | Principle / 原则 | Description / 说明 |
|---|-----------------|-------------------|
| 1 | **LLM 以读者身份分析** | AI is a regular reader who just finished your novel, not a literary critic |
| 2 | **分析结果回流写作** | World Tree / Character Pool / Rhythm data feeds into Writer prompt |
| 3 | **一次写好** | Write well in one pass, don't rely on multiple review cycles |
| 4 | **展示与注入并行** | Show data to user AND inject it into AI writing context simultaneously |
| 5 | **LLM 自行归类** | LLM outputs structured JSON directly, frontend only saves and displays |
| 6 | **免心理学框架** | No OCEAN / Dark Triad — readers describe characters naturally |
| 7 | **世界树 ≠ 模糊记忆** | World Tree = precise structure (lossless); Fuzzy Memory = fallback compression (lossy) |

### 🇬🇧 Core Principles

1. **LLM as a Reader** — AI roleplays a regular reader who just finished the novel
2. **Analysis Feeds Writing** — All analysis results are injected into the Writer's prompt
3. **Write Well Once** — Aim for quality in a single pass, not iterative fixes
4. **Show & Inject** — Display insights to the user AND feed them to the AI simultaneously
5. **LLM Self-Classification** — LLM outputs structured JSON directly; frontend is pure display
6. **Psychology-Free** — No mandatory OCEAN/Dark Triad frameworks; natural descriptions suffice
7. **World Tree ≠ Fuzzy Memory** — World Tree is precise (lossless); Fuzzy Memory is compression (lossy)

---

## Pros & Cons / 优劣势分析

### ✅ Advantages / 优势

| # | Advantage / 优势 | Detail / 说明 |
|---|-----------------|---------------|
| 1 | **Zero setup** / 零配置 | Just a browser + Python, no npm/node/database needed |
| 2 | **Single HTML file** / 单文件 | Entire frontend is one file (~2000 lines) — easy to understand and modify |
| 3 | **Deep analysis** / 深度分析 | 8-step multi-turn dialogue extracts rich story insights |
| 4 | **Reader perspective** / 读者视角 | AI judges like a real reader, not a machine |
| 5 | **Encrypted API keys** / 加密密钥 | XOR+Base64 + machine fingerprint — safe from leaks |
| 6 | **Disk persistence** / 磁盘持久化 | Every operation writes to disk immediately — no data loss |
| 7 | **Bilingual UI** / 双语界面 | Chinese/English switchable with one click |

### ❌ Limitations / 局限性

| # | Limitation / 局限 | Detail / 说明 |
|---|------------------|---------------|
| 1 | **Requires API Key** / 需 API Key | Must have DeepSeek or compatible LLM API key |
| 2 | **No offline mode** / 无离线模式 | AI features require internet connection |
| 3 | **Writing Studio WIP** / 写作台未完成 | Core writer module is placeholder (planned) |
| 4 | **Review Chamber WIP** / 审查室未完成 | 3-reviewer pipeline is placeholder (planned) |
| 5 | **Basic UI** / 基础界面 | HTML5-only UI, no React/Vue, less polished than framework-based apps |
| 6 | **Single-user** / 单用户 | No multi-user or collaboration features |
| 7 | **Windows batch script** / 仅 Windows 启动脚本 | `start_server.bat` is Windows-only (but `server.py` works cross-platform) |

---

## Configuration / 配置说明

### LLM Providers / LLM 供应商

| Provider / 供应商 | Env Variable / 环境变量 | Default Model / 默认模型 |
|-------------------|------------------------|--------------------------|
| [DeepSeek](https://platform.deepseek.com/) | `DEEPSEEK_API_KEY` | `deepseek-v4-flash` |
| [OpenAI](https://platform.openai.com/) | `OPENAI_API_KEY` | `gpt-4o` |
| Custom / 自定义 | `CUSTOM_API_KEY` | Custom URL |

### Quality Gate Defaults / 质量门禁默认值

| Parameter / 参数 | Default / 默认值 | Recommended Range / 推荐范围 |
|------------------|-----------------|------------------------------|
| Pass Threshold / 通过阈值 | 75 | 70–80 |
| Revise Threshold / 修订阈值 | 50 | 45–55 |
| Max Iterations / 最大迭代 | 3 | 3 |
| Min Dimension Score / 严审最低分 | 5 | 5 |

### 13 Review Dimensions / 13 个审查维度

All default weight: `1.0`

1. Plot / 情节
2. Characters / 角色
3. Dialogue / 对话
4. Pacing / 节奏
5. Writing Style / 文风
6. Consistency / 一致性
7. Emotional Impact / 情感冲击
8. Originality / 原创性
9. Readability / 可读性
10. AI-tone Detection / AI 味检测
11. Character Psychology / 角色心理
12. Social Interaction / 社会互动
13. Exceptional Authenticity / 例外真实性

---

## Data Flow / 数据流程

```
User Inputs Chapter
        ↓
┌─────────────────────────────────────────────────┐
│            AI Reader Analysis (8 steps)          │
│                                                   │
│  Step 1: Probe model capacity (context limit)     │
│  Step 2: Batch read (split by token budget)       │
│  Step 3: Reading experience (appeal, emotion)     │
│  Step 4: Story structure (plot, subplots, etc.)   │
│  Step 5: Character impressions (all characters)   │
│  Step 6: Overall feeling (pacing, expectations)   │
│  Step 7: Skill evaluation (editor perspective)    │
│  Step 8: Output structured JSON                   │
└───────────────────────┬─────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│                   Analysis Results                     │
├─────────────────┬─────────────────┬───────────────────┤
│   🌳 World Tree  │  🧠 Character    │  📊 Tension       │
│   (plot struct)  │  Pool (profiles) │  Console (rhythm) │
├─────────────────┼─────────────────┼───────────────────┤
│   Trunk         │  Role tags       │  Per-chapter      │
│   Branches      │  Traits/Models   │  appeal scores    │
│   Buds          │  Relationships   │  Reader questions │
│   Roots         │  Consistency     │  Pacing guidance  │
└─────────────────┴─────────────────┴───────────────────┘
        ↓                        ↓
  Display to User        Inject into Writer Prompt
```

### Fuzzy Memory / 模糊记忆机制

When total tokens exceed **55K**, old chapters are automatically compressed to L3 (400-word summaries), keeping the latest **5 chapters** intact. This prevents AI context overflow while preserving critical recent context.

```
Token Budget Decision:
  Total ≤ 55K → Send full text
  Total > 55K → Compress old chapters (L3, ~400 words)
               + Keep last 5 chapters intact
```

---

## Roadmap / 开发路线图

### ✅ Completed / 已完成 (v1.0)

- [x] Project management (create/select/lock/delete/import)
- [x] Settings panel (LLM provider, API Key, quality gate)
- [x] API Key encryption + dual-mode management
- [x] AI Reader analysis (8-step multi-turn dialogue)
- [x] Fuzzy memory downgrade (auto-compress when >55K tokens)
- [x] World Tree visualization page
- [x] Tension Console visualization page
- [x] Character Pool visualization page
- [x] Settings export/import
- [x] Language switching (CN/EN)

### 🔄 In Progress / 开发中 (v1.1)

- [ ] Writing Studio — inject context from all analysis modules
- [ ] Review Chamber — S1 regex + S2 three reviewers + voting

### 📅 Planned / 计划中 (v1.2+)

- [ ] History Log — project operation timeline
- [ ] Batch analysis for multiple projects
- [ ] Full fuzzy memory pipeline (L0 → L4 compression)
- [ ] Custom reviewer prompts
- [ ] Export to publishing formats (PDF, EPUB)

---

## Troubleshooting / 常见问题

### ❓ FAQ / 常见问题

**Q: What do I need to run this? / 运行需要什么？**  
A: Python 3.10+ and a DeepSeek (or OpenAI) API key. No database, no npm, no Docker.

**Q: Is my API key safe? / API 密钥安全吗？**  
A: Yes. Keys are encrypted with XOR + Base64 and bound to your machine's hardware fingerprint. Never sent anywhere except to the LLM provider.

**Q: Can I use OpenAI instead of DeepSeek? / 可以用 OpenAI 代替 DeepSeek 吗？**  
A: Yes. Go to Settings → LLM Provider, choose OpenAI, and enter your key.

**Q: How do I update / 怎么更新？**  
A: Just `git pull`. Your projects and data are stored in the `projects/` folder and won't be overwritten.

**Q: The analysis seems stuck / 分析卡住了怎么办？**  
A: Check your API key in Settings and click "Test Connection". Ensure your internet is stable. Large novels (>100K tokens) take longer.

### ⚠️ Known Issues / 已知问题

- Analysis depends on a valid API Key saved in `_apiKeysCache`
- Example projects may contain placeholder content
- Imported files need re-processing for chapter splitting logic

---

## License / 许可证

本项目采用 **MIT License** 开源。

```
MIT License

Copyright (c) 2026 Rambolv

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
```

---

<div align="center">

**Made with ❤️ for novel writers everywhere**

[GitHub](https://github.com/Rambolv/Art-Super-Writer) · [Report Bug](https://github.com/Rambolv/Art-Super-Writer/issues) · [Request Feature](https://github.com/Rambolv/Art-Super-Writer/issues)

</div>
