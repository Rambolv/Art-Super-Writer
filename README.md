<div align="center">

# 🖋️ 超逸写手 — Art Super Writer

**AI 辅助长篇小说创作系统 | AI-Assisted Novel Writing System**

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![HTML5](https://img.shields.io/badge/Frontend-HTML5_VanillaJS-orange?logo=html5)](https://html.spec.whatwg.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> 让每一位创作者都能拥有专属的 AI 编辑团队
> Give every writer their own AI editorial team

</div>

---

## 📖 语言 / Language

本 README 完整提供中英双语。软件界面可通过右上角 **中文/EN** 按钮一键切换。
This README is fully bilingual. The app UI supports one-click Chinese/English switching via the top-right **中文/EN** button.

---

# 🇨🇳 中文版

## 概述

**超逸写手（Art Super Writer）** 是一款 AI 辅助长篇小说创作系统。它模拟了一个**完整的编辑团队工作流**：

| 角色 | 职责 |
|------|------|
| 🧠 **AI 分析师** | 8 步多轮对话深度阅读你的小说，提取剧情结构、角色档案、节奏数据 |
| ✍️ **AI 写作助手** | 基于分析结果，注入世界树/角色池/节奏数据作为上下文，辅助创作下一章 |
| 🔍 **AI 审查官** | 三位不同风格审查官（严审/衡审/宽审）并行评审 + 夹逼定理投票 + 质量门禁 |
| 📊 **AI 读者** | 从真实读者视角反馈阅读体验，标注翻页吸引力和读者想知道的问题 |

> 🎯 **目标用户**：长篇小说创作者、网文作者、任何希望借助 AI 提升写作效率和质量的人。

---

## 功能特性（全部已完成 ✅）

| 模块 | 功能 |
|------|------|
| 📁 **项目管理** | 创建/锁定/删除项目，导入 `.md`/`.txt` 文件 |
| 🧠 **AI 读者分析** | 8 步多轮对话全自动分析：逐章阅读→故事结构→角色印象→节奏感受→综合JSON |
| ✍️ **写作台** | 上下文注入（世界树/角色池/节奏），流式 LLM 生成，保存草稿，定稿到章节 |
| 🔍 **审查室** | S1 机械闸（19 条正则+连续性引擎）→ S2 三审查官（严/衡/宽）→ 夹逼投票 → 质量门禁 → 修订循环 |
| 🌳 **世界树** | 四维可视化：主干（主线）/ 枝丫（支线）/ 芽（伏笔）/ 根系（世界观设定） |
| 🧠 **角色池** | 六芒星雷达图、角色卡折叠展开、添加/编辑/删除角色、自定义 AI 角色分析 |
| 📊 **节奏控制台** | 逐章阅读体验数据、读者最想知道的问题、整体节奏评估、连续性指标仪表盘 |
| 🔐 **API Key 加密** | XOR + Base64 加密 + 机器指纹绑定，双模式密钥管理 |
| 🌐 **双语言** | 中文/English 一键切换 |
| 💾 **本地持久化** | 全部数据写入磁盘文件夹，刷新/重启不丢失 |
| 📋 **历史日志** | 分析日志 + 操作日志，含时间线和会话标记 |

---

## 快速开始

### 前提条件

- **Python 3.10+**（[下载](https://python.org/downloads)）
- **DeepSeek API Key**（[获取](https://platform.deepseek.com/)）

### 安装

```bash
git clone https://github.com/Rambolv/Art-Super-Writer.git
cd Art-Super-Writer/standalone
python -m venv .venv
.venv\Scripts\activate
python launcher.py
```

浏览器打开 `http://127.0.0.1:8899`。

> 💡 Windows 用户也可以直接双击 `start_server.bat`。

---

## 完整使用流程

### 第一步：配置 API Key

1. 点击左侧导航「⚙️ 设置」
2. 在「LLM 供应商」选择 **DeepSeek**
3. 输入你的 API Key，点击「🔑 保存密钥」
4. 点击「🔌 测试连接」确认可用

### 第二步：创建/导入项目

1. 点击「📁 项目管理」
2. 右侧「🆕 创建新项目」→ 输入小说名称、故事前提、类型 → 点击「✨ 创建」
3. 或者点击「📥 导入作品」→ 选择已有的 `.md` 或 `.txt` 章节文件 →「📥 导入」

### 第三步：锁定项目

1. 在项目列表中，找到你的项目
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

## 项目结构

```
standalone/
├── index.html              # 主应用（单文件，~5300行）
├── server.py               # Python HTTP API 服务器（端口 8899）
├── launcher.py             # 一键启动脚本
├── 启动超逸写手.bat          # 一键启动批处理
├── start_server.bat        # 仅启动服务器
│
├── projects/               # 所有小说项目数据
│   └── {项目名}/
│       ├── chapters/        # 章节 .md 文件
│       ├── drafts/          # 写作草稿
│       ├── reviews/         # 审查记录 JSON
│       ├── characters/      # 角色独立 JSON
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
