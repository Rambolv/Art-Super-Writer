<div align="center">

# 🖋️ 超逸写手 · Art Super Writer

**让 AI 读懂你的长篇小说，再帮你接着写。**

*Let AI read your entire novel, then help you write the next chapter.*

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<br>

<kbd>🇨🇳 中文</kbd> · <kbd>🇬🇧 English</kbd>

</div>

---

# 🇨🇳 中文文档

## 优势与不足

### 它解决了什么

| 你用 AI 写作时遇到的问题 | 超逸写手怎么解决 |
|-------------------------|----------------|
| **AI 记不住前文**——写到第五章，AI 忘了第一章的内容，角色性格全乱 | 写新章前，AI **自动分批阅读你的全部已有章节**，读完才动笔 |
| **角色前后矛盾**——名字写错、性格飘忽、前面死掉的人后面又活了 | 🧠 **角色池**自动跟踪每个角色的性格/关系/状态，写作时注入提示词 |
| **写完不知道好不好**——让 AI 评价，只会说"写得不错" | 🔍 **三审流水线**——严/衡/宽三个 AI 审稿官从 13 个维度打分 |
| **故事结构一团乱**——挖了坑忘了填，支线写着写着丢了 | 🌳 **世界树可视化**——主线在哪、支线进度、哪些伏笔该收了 |
| **节奏感差**——该紧张的地方平淡，该收尾的地方拖沓 | 📊 **节奏控制台**——逐章吸引力评分 + 连续性健康检查 |
| **每次写新章要手动粘贴前文给 AI** | ✍️ **自动注入上下文**——世界树 + 角色档案 + 节奏数据 + 写作建议 |
| **Token 费用高**——天天写，天天花钱 | 💰 **Slot 模式**——用本地 LLM 时全文只预热一次，后续写多章几乎零增量成本 |

### 不足——诚实地说

| 不足 | 具体说明 |
|------|---------|
| **需要一点动手能力** | 需要安装 Python 和几个依赖，大约 10 分钟。不是"双击就能用"的类型。 |
| **API 方案需要付费** | 用云端 AI（DeepSeek 等）需要充值。不过很便宜，写一本几十万字的小说只要几块钱。 |
| **本地 LLM 写作质量不如 API** | 用你自己电脑跑本地模型（7B/14B）虽然完全免费，但**创意性、文笔细腻度、角色把控能力明显不如 DeepSeek/GPT-4 这类云端大模型**。这是一个取舍：省钱 vs 质量。 |
| **不是全自动写书机** | 你仍然需要构思剧情、编辑 AI 生成的内容。它是辅助工具，不是替代品。 |

### 本地 LLM vs 云端 API——如何选？

| | 本地 LLM（Slot 模式） | 云端 API（DeepSeek） |
|--|---------------------|---------------------|
| 💰 **费用** | 几乎免费（只有电费） | 写一本几十万字约几元 |
| 📝 **写作质量** | ⚠️ 一般——创意性、细腻度不如大模型 | ✅ 优秀——目前最强中文写作能力之一 |
| 🔧 **上手难度** | 需要 8G+ 显存 NVIDIA 显卡，配置稍复杂 | 注册账号复制 Key 即可，几分钟搞定 |
| 🚀 **分析能力** | 可接受——分析故事结构够用 | ✅ 出色——理解力、洞察力更强 |
| 🏠 **隐私** | ✅ 完全本地，不上传任何内容 | 内容通过 API 发送到云端 |

> **建议：** 如果你预算有限且有一块不错的显卡，本地 LLM 是性价比之选。如果你追求最佳写作质量，用 DeepSeek API，成本极低。也可以混合使用——分析用本地 LLM 省钱，写作用 API 保证质量。

---

## ⚡ 30 秒快速开始

### 第一步：安装 Python

打开 [python.org](https://python.org/downloads)，下载 Python 3.10+，安装时**务必勾选 "Add Python to PATH"**。

### 第二步：下载项目并安装依赖

```bash
# 下载后解压，进入目录
cd standalone

# 创建虚拟环境（只需要做一次）
python -m venv .venv

# 激活虚拟环境
.venv\Scripts\activate

# 安装依赖（只需要做一次）
pip install flask requests
```

> 国内用户如果下载慢：`pip install flask requests -i https://pypi.tuna.tsinghua.edu.cn/simple`

### 第三步：启动

```bash
.venv\Scripts\python server.py
```

浏览器打开 **http://127.0.0.1:8899**，看到界面即完成。

> 也可以直接双击 `启动超逸写手.bat` 或 `超逸写手启动器.exe`

### 第四步：连接 AI（选一种）

**方案 A：云端 API（推荐新手）**

1. 去 [platform.deepseek.com](https://platform.deepseek.com) 注册 → 左侧 **API Keys** → 创建一个 Key → 复制 `sk-` 开头的密钥
2. 在软件设置页（⚙️）添加 LLM 配置：供应商选 DeepSeek，模型填 `deepseek-chat`，粘贴 Key
3. 点保存 → 测试连接 → ✅ 成功

**方案 B：本地 LLM（适合有显卡的用户）**

1. 在 `standalone/` 同级创建 `LLM/` 文件夹，放入 llama.cpp 和模型文件
2. 创建 `LLM/start.bat` 启动 llama.cpp 服务
3. 软件设置页添加 LLM 配置：供应商选"自托管"，地址 `http://127.0.0.1:8080`，**工作模式选 Slot**
4. 点保存 → 测试连接 → ✅ 成功

> 详细的本地 LLM 部署教程见下方。

---

## 📂 分情况详细指南

### 情况一：你已有写好的文档，想继续写

**① 创建项目**
左边栏 **📁 项目管理** → 输入项目名称 → 选小说类型 → **「✨ 创建」**

**② 导入文件**
点击项目卡片 → **「📥 导入章节文件」** → 选 `.txt` 或 `.md` → 导入

**③ 锁定项目**
点 **🔒 锁定**（锁定后所有模块以此项目为核心运作）

**④ AI 分析（8 步）**
点 **🔍 分析**——不要刷新页面。

AI 会依次执行：探测能力 → 分批阅读全文 → 阅读体验评价 → 故事结构提取 → 角色印象分析 → 整体感受 → 技能评价 → 输出 JSON。

完成后世界树、角色池、节奏数据全部生成。

**⑤ 查看分析结果**
- 🌳 **世界树**：主线到哪了、支线进度、伏笔有没有收
- 🧠 **角色池**：每个角色的性格档案和行为模型
- 📊 **节奏控制台**：各章吸引力评分

**⑥ 开始写作**
去 **✍️ 写作台** → 填写作方向 → 发送 → AI 生成 → 编辑 → 定稿。

写完一章后**回项目管理重新分析**，更新数据后再写下一章。

---

### 情况二：新开一本书，从零写

**① 创建 + 锁定项目**（同上）
**② 直接去写作台写第一章**——新项目可以先不分析
**③ 写了 2~3 章后回项目管理点分析**——之后每写一章就重新分析一次

---

### 情况三：本地 LLM 部署教学

**前提：** 你有一块 8G+ 显存的 NVIDIA 显卡。

**① 安装显卡驱动和 CUDA**
NVIDIA 官网下载 Game Ready Driver 和 CUDA Toolkit。

**② 下载 llama.cpp**
从 [llama.cpp Releases](https://github.com/ggerganov/llama.cpp/releases) 下载 Windows 版本（选 `llama-bXXXX-bin-win-cuda-cuXX.x-x64.zip`），解压到 `standalone/LLM/`

**③ 下载模型**
推荐 **Qwen2.5-7B-Instruct** 或 **Qwen2.5-14B-Instruct**（中文能力强）。从 HuggingFace 或 ModelScope 下载 GGUF 格式，放到 `LLM/models/`

**④ 编写启动脚本**
在 `LLM/` 中创建 `start.bat`：

```bat
@echo off
cd /d "%~dp0"
llama-server.exe ^
  -m models/qwen2.5-7b-instruct-q4_k_m.gguf ^
  --host 127.0.0.1 --port 8080 ^
  --ctx-size 65536 ^
  -ngl 99 ^
  --slot-save-path slots/
pause
```

参数说明：
- `--ctx-size 65536`：上下文窗口 64K（越大能一次读完的章节越多）
- `-ngl 99`：全部层放 GPU（充分发挥显卡）
- `--slot-save-path slots/`：持久化 slot 缓存，重启后预热好的上下文还能用

**⑤ 在软件中配置**
**⚙️ 设置** → 添加 LLM 配置：

| 字段 | 值 |
|------|-----|
| 供应商 | 自托管 |
| API 地址 | `http://127.0.0.1:8080` |
| 模型 | `qwen2.5-7b` |
| API Key | 留空 |
| **工作模式** | ⚡ **Slot** |

> **为什么选 Slot 模式？** llama.cpp 的 Slot 机制会让 AI 缓存在服务端。全文分批阅读时，每批的上下文被保留；写下一章时直接复用——**上下文只预热一次**，后续每次写新章几乎零额外开销。如果用 Stateless，每次请求都重新处理完整历史，Slot 是 llama.cpp 用户的最大优势。

---

## 📋 界面速览——11 个页面

| 页面 | 做什么 |
|------|--------|
| 🎨 创作台 | 欢迎页 |
| 📁 项目管理 | 新建/导入/锁定项目，AI 分析入口 |
| ✍️ **写作台** | **核心——AI 辅助写新章节** |
| 🔍 审查室 | 三审官检查章节质量，给修改建议 |
| 🌳 世界树 | 故事结构：主线/支线/伏笔/世界观 |
| 🧠 角色池 | 每个角色的性格档案 |
| 📊 节奏控制台 | 逐章评分 + 连续性健康检查 |
| ⚙️ 设置 | LLM 配置、分角色参数、质量门禁 |
| 📋 历史日志 | 查看分析进度和完整对话记录 |
| 🤖 全自动长篇写作 | 开发中 |

---

## 📖 各页面详解

### ✍️ 写作台（核心功能）

**界面布局：**

```
┌──────────────────────────┬──────────────────┐
│ 📖 项目信息               │ 📖 项目统计       │
│                          │ 📦 前置SKILL      │
│ 章节号 | 写作方向          │ (写作规则卡片)    │
│ 温度   | 目标字数          │                  │
│ [💾 保存] [📤 发送给LLM]  │ 📋 写作上下文     │
├──────────────────────────┤ (自动注入数据)    │
│ 📖 原文参考（可折叠）      │                  │
├──────────────────────────┤ 📖 行为规律      │
│ 生成结果:                 │                  │
│ [🔄重新生成][📌定稿][🔍分析]│                 │
│ [流式显示的内容文本框]     │                  │
└──────────────────────────┴──────────────────┘
```

**发送按钮的完整流程：**

```
① 探测模型能力 → ② 模糊记忆（长文压缩）
→ ③ 分批阅读全文 → ④ 注入上下文
→ ⑤ 流式生成新章节内容
```

**写作方向怎么填：**

✅ **好的：** "主角发现古城有异常。暗中调查时遇到女记者，两人决定合作。要求：悬疑氛围、对话自然、为反转埋伏笔。"

❌ **差的：** "写第四章"

**写作方向写什么：** 关键事件、角色互动、氛围基调、特殊要求（避免什么、强调什么）。**越具体，生成结果越接近你的预期。**

**按钮说明：**

| 按钮 | 干什么 | 注意 |
|------|--------|------|
| 💾 保存提示词 | 把写作方向保存到磁盘 | 切换章节时自动加载 |
| 📤 发送给LLM | 触发 AI 写新章节 | 按钮变灰表示生成中 |
| 🔄 重新生成 | 不满意重来一遍 | 上一版不保留 |
| 📌 定稿 | 正式保存为章节 | 已定稿的章节再次定稿会弹确认框 |
| 🔍 分析本章 | 对本章做质量分析 | 只看本章，不看全文 |

**生成过程注意事项：**
- 生成内容**实时流式显示**在文本框里
- 橙色提示：**等生成完成再编辑**，中途修改可能导致 AI 后续输出错乱
- 如果全文很长（100K+ tokens），分批阅读需要几分钟——耐心等，去历史日志看进度

### 📦 前置 SKILL——控制 AI 文风

你写给 AI 的**写作规则**。创建后勾选 = 激活，AI 写作时自动遵守。

```
标题：对话规则
内容：对话简短有力，一人一次不超过三句。
用动作带出说话人，不要用"说道""回答道"。
```

**导入支持：** `.txt` `.md` `.docx` `.xlsx` `.json`（Word 自动提取文本，Excel 提取全部表格）

### 🌳 世界树 · 🧠 角色池 · 📊 节奏控制台

这三页都有**版本选择器**（顶部下拉菜单），可切换不同分析版本：

| 页面 | 核心数据 |
|------|---------|
| 🌳 世界树 | 主线节点·支线进度·伏笔排序·世界观 |
| 🧠 角色池 | 性格标签·行为模型·关系网·一致性警告 |
| 📊 节奏控制台 | 吸引力评分·情感曲线·连续性健康度 |

### 🔍 审查室

选择章节 → **🔍 审查** → 自动执行：

```
S1 机械闸（19条规则扫描）
→ S2 三审官（严/衡/宽，13维度评分）
→ 夹逼投票（优选最佳建议）
→ 质量门禁（≥75通过 | 50~74修订 | <50人工）
```

修改建议以卡片形式显示在右侧。**点击卡片自动定位原文并应用修改。** 编辑器支持 Ctrl+Z 撤销。

### ⚙️ 设置

#### LLM 工作模式

| 模式 | 原理 | 适用 |
|------|------|------|
| ⚡ **Slot** | llama.cpp 通过 slot_id 管理 KV 缓存，全文预热一次后续只发新增 | 本地 llama.cpp |
| 🔵 Stateless | 标准 API，每次请求发完整对话历史 | DeepSeek、OpenAI 等云端 API |

设置页可**自动探测**（连接成功后询问 AI 支持哪种），也可手动指定。

#### 分角色参数

每个功能独立指定 LLM 和温度：

| 角色 | 温度 | 温度含义 |
|------|------|---------|
| ✍️ 写作 | 0.8 | 越高越有创意，越低越稳定 |
| 🔍 分析 | 0.7 | 分析结构需要适中温度 |
| 🔴 严审 | 0.3 | 审查要严谨，温度要低 |
| 🟡 衡审 | 0.3 | 同上 |
| 🟢 宽审 | 0.4 | 读者视角可稍微宽松 |
| 🗳️ 投票 | 0.2 | 裁决需要最稳定 |
| 📚 技能学习 | 0.5 | 总结规律 |

#### 质量门禁

审查通过标准：

| 参数 | 默认 | 说明 |
|------|------|------|
| 通过阈值 | 75 | 总分≥75 直接通过 |
| 修订阈值 | 50 | 总分≥50 需修订 |
| 最大迭代 | 3 | 自动修订最多循环次数 |
| 维度最低分 | 5 | 任一维度低于此分触发告警 |

---

## 📂 项目文件夹说明

一个项目文件夹里每个文件存什么：

```
projects/你的小说/
│
├── project.json              ← 项目基本信息（名称、类型、创作时间）
│
├── chapters/                 ← ★ 正式章节 ★
│   ├── chapter_001.md        ← 第 1 章正文
│   ├── chapter_002.md        ← 第 2 章正文
│   └── writer_direction_第001章.json  ← 你保存的写作方向
│
├── drafts/                   ← 草稿（自动保存，防止切换页面丢失）
│
├── config/                   ← 项目配置（审查状态、导出设置）
│
├── projectLog/               ← 分析日志——每次点击「分析」生成一个新版本
│   ├── v1/                   ← 第 1 次分析
│   │   ├── 分析报告_第1轮_阅读体验.md  ← 每一轮的完整对话记录
│   │   ├── 分析报告_第2轮_故事结构.md
│   │   ├── 分析报告_第3轮_角色印象.md
│   │   ├── 分析报告_第4轮_整体感受.md
│   │   ├── 分析报告_第5轮_写作技能评价.md
│   │   ├── 分析报告_第5步_综合JSON.json  ← 最终结构化数据
│   │   └── writer_prompt_第001章.json   ← 发给 AI 的完整提示词
│   ├── v2/                   ← 第 2 次分析
│   └── ...
│
├── worldTreeData/            ← 世界树数据（主线/支线/伏笔/世界观）
├── characterProfiles/        ← 角色档案（每个角色一份）
├── tensionReports/           ← 节奏数据（各章评分、读者节奏报告）
├── reviews/                  ← 审查记录（每次审查一份）
├── fuzzyMemory/              ← 长文压缩摘要（全文太长时自动生成）
│
├── skills/
│   ├── external/             ← 你手动创建的 SKILL → 写作时注入提示词
│   └── self/                 ← AI 自动学到的 → 分析完成时自动生成
│
└── story_state.json          ← 故事状态快照（角色在哪、情绪如何、情节进度）
```

---

## ❓ 常见问题

**Q: 必须花钱吗？**
A: 不一定。本地 LLM 完全免费（需要一块 8G+ NVIDIA 显卡）。但说实话，本地小模型的写作质量不如付费的云端大模型。不想折腾就用 API——很便宜，写一本几十万字也只要几块钱。

**Q: 需要写代码吗？**
A: 不需要。按教程敲几行命令就行。

**Q: AI 写出来的风格不对怎么办？**
A: 写作台右侧 📦 前置 SKILL 里自定义写作规则，AI 写作时会自动遵守。

**Q: 切页面内容会丢吗？**
A: 不会。自动保存草稿，回来自动恢复。

**Q: 崩溃了怎么办？**
A: 刷新页面即可。所有数据在磁盘上，不会丢失。

**Q: 能同时写几本书吗？**
A: 可以。解锁当前项目 → 锁定另一个项目。数据完全独立。

**Q: 支持什么 AI？**
A: DeepSeek、OpenAI 兼容 API、本地 llama.cpp、任何兼容 OpenAI 格式的模型。

**Q: "分批阅读"是什么？**
A: 写新章前，系统把你全部已有章节切成小块，一批一批发给 AI 读。读完才知道完整故事，写的新章才不会跟前文矛盾。

**Q: "模糊记忆"是什么？**
A: 全文太长超过 AI 容量时，自动压缩旧章节为摘要，腾出空间给新内容。

---

# 🇬🇧 English Documentation

## Strengths & Weaknesses

### What It Solves

| Problem When Writing with AI | How Art Super Writer Solves It |
|------------------------------|-------------------------------|
| **AI forgets earlier chapters**—character personalities drift, plot points get lost | Before writing, AI **automatically batch-reads your entire novel** so it knows the full story |
| **Character inconsistency**—wrong names, shifting personalities, dead characters reappear | 🧠 **Character Pool** tracks every character's traits, relationships, and state—auto-injected into prompts |
| **Can't tell if your writing is good**—AI just says "looks great" | 🔍 **Triple Reviewer Pipeline**—strict/balanced/lenient AI reviewers score 13 dimensions |
| **Story structure chaos**—forgotten foreshadowing, abandoned subplots | 🌳 **World Tree visualization**—main plot, subplots, foreshadowing, worldbuilding |
| **Poor pacing**—intense scenes feel flat, conclusions drag | 📊 **Rhythm Console**—per-chapter appeal scores, continuity health checks |
| **Manual copying of previous chapters into prompts** | ✍️ **Auto context injection**—world tree + characters + rhythm + writing advice |
| **High API costs**—paying per request adds up | 💰 **Slot Mode**—context warmed up once, subsequent chapters almost zero extra cost |

### Honest Limitations

| Limitation | Details |
|-----------|---------|
| **Requires setup** | Python installation + dependency setup (~10 minutes) |
| **API costs money** | Cloud AI (DeepSeek) requires prepaid credit, though very cheap (~¥3 for a whole novel) |
| **Local LLM quality gap** | Local models (7B/14B) are free but **significantly worse at creative writing than cloud models like DeepSeek/GPT-4**. This is a cost vs quality trade-off. |
| **Not a one-click book generator** | You still need to plan plots and edit AI output—it's an assistant, not a replacement |

### Local LLM vs Cloud API

| | Local LLM (Slot Mode) | Cloud API (DeepSeek) |
|--|----------------------|---------------------|
| 💰 **Cost** | Almost free (electricity only) | ~¥3 for a full novel |
| 📝 **Writing Quality** | ⚠️ Mediocre—less creative, less nuanced | ✅ Excellent—top Chinese writing capability |
| 🔧 **Setup Difficulty** | Needs 8GB+ NVIDIA GPU, more config | Sign up, copy key, done in minutes |
| 🚀 **Analysis Ability** | Acceptable—functional | ✅ Better insight and understanding |
| 🏠 **Privacy** | ✅ Fully local—nothing uploaded | Content sent to cloud via API |

> **Recommendation:** If budget-conscious with a good GPU, local LLM is the cost-effective pick. If you want the best writing quality, use DeepSeek API (dirt cheap). You can also mix—use local LLM for analysis to save money, API for writing to maximize quality.

---

## ⚡ 30-Second Quick Start

### Step 1: Install Python

Download Python 3.10+ from [python.org](https://python.org/downloads). **Check "Add Python to PATH"** during installation.

### Step 2: Download & Install Dependencies

```bash
cd standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
```

### Step 3: Launch

```bash
.venv\Scripts\python server.py
```

Open **http://127.0.0.1:8899** in your browser.

> Or double-click `启动超逸写手.bat` / `超逸写手启动器.exe`

### Step 4: Connect to AI

**Option A: Cloud API (recommended for beginners)**

1. Go to [platform.deepseek.com](https://platform.deepseek.com) → sign up → **API Keys** → create a key → copy the `sk-...` string
2. In the app, go to ⚙️ Settings → add LLM config: provider = DeepSeek, model = `deepseek-chat`, paste your key
3. Save → Test Connection → ✅ Success

**Option B: Local LLM (for users with NVIDIA GPU)**

1. Create `LLM/` folder next to `standalone/`, place llama.cpp + model files inside
2. Create `LLM/start.bat` to launch llama.cpp server
3. In app settings: provider = Self-hosted, URL = `http://127.0.0.1:8080`, **work mode = Slot**
4. Save → Test Connection → ✅ Success

---

## 📂 Detailed Guides

### Scenario A: You Have an Existing Document

**① Create project:** 📁 Project Manager → enter name → choose genre → **Create**

**② Import file:** Click project → **Import Chapter File** → select `.txt`/`.md` → Import

**③ Lock project:** Click **🔒 Lock**

**④ AI Analysis (8 steps):** Click **🔍 Analyze** → don't refresh: probe → batch read → reader experience → story structure → character analysis → overall feel → skill evaluation → JSON output

**⑤ View results:** World Tree, Character Pool, Rhythm Console

**⑥ Start writing:** ✍️ Writer → fill in direction → Send → edit → Finalize. Re-analyze after each chapter.

### Scenario B: Start a New Novel from Scratch

Create → Lock → Go to Writer and write Chapter 1 directly. After 2-3 chapters, run analysis.

### Scenario C: Local LLM Setup

**Prerequisites:** 8GB+ NVIDIA GPU.

1. Install NVIDIA drivers and CUDA Toolkit
2. Download llama.cpp Windows build from [Releases](https://github.com/ggerganov/llama.cpp/releases) (pick `llama-bXXXX-bin-win-cuda-cuXX.x-x64.zip`)
3. Download a model like Qwen2.5-7B-Instruct (GGUF format) from HuggingFace
4. Create `start.bat` in your LLM folder:

```bat
llama-server.exe -m models/qwen2.5-7b-instruct-q4_k_m.gguf --host 127.0.0.1 --port 8080 --ctx-size 65536 -ngl 99 --slot-save-path slots/
```

5. Configure in app: provider = Self-hosted, address = `http://127.0.0.1:8080`, work mode = **Slot**

> **Why Slot Mode?** llama.cpp's slot mechanism caches KV context server-side. Full text is warmed up once—subsequent chapter writes only send new messages, saving massive compute.

---

## 📋 Page Overview—11 Pages

| Page | Purpose |
|------|---------|
| 🎨 Creative Desk | Welcome page |
| 📁 Project Manager | Create/import/lock projects, run AI analysis |
| ✍️ **Writer** | **Core—AI-assisted chapter writing** |
| 🔍 Review Room | Triple-reviewer quality check with suggestions |
| 🌳 World Tree | Story structure: plot/branches/foreshadowing/worldbuilding |
| 🧠 Character Pool | Per-character profiles and behavioral models |
| 📊 Rhythm Console | Chapter appeal scores, continuity health |
| ⚙️ Settings | LLM config, role params, quality gate |
| 📋 History Log | Real-time analysis progress and full conversation logs |
| 🤖 Auto Writer (WIP) | Under development |

---

## 🔧 Writer Desk—In Detail

**Sending flow:** Probe → compress (if text too long) → batch-read all chapters → inject context → stream generate

**Writing direction examples:**
✅ *"The protagonist discovers anomalies in the ancient city. Investigating secretly, he meets a female journalist. They decide to team up. Requirements: suspenseful atmosphere, natural dialogue, plant foreshadowing."*
❌ *"Write chapter 4"*

**SKILL system:** Create writing rules (e.g., "dialogue should be short and sharp"). Check to activate. Import supports `.txt/.md/.docx/.xlsx/.json`.

**Review pipeline:** S1 mechanical gate (19 rules) → S2 three reviewers (strict/balanced/lenient, 13 dimensions) → squeeze voting → quality gate (pass≥75 / revise≥50 / manual<50)

---

## ⚙️ Configuration

### Work Mode

| Mode | How It Works | Use When |
|------|-------------|----------|
| ⚡ **Slot** | llama.cpp KV cache via slot_id—context warmed once, incremental for subsequent requests | Local llama.cpp |
| 🔵 Stateless | Standard API—full conversation history each request | DeepSeek, OpenAI, etc. |

### Role Parameters

Each function can use a different LLM and temperature:

| Role | Default Temp | Purpose |
|------|-------------|---------|
| ✍️ Writer | 0.8 | Generate novel content |
| 🔍 Analysis | 0.7 | Analyze story structure |
| 🔴 Strict Reviewer | 0.3 | Strict quality check |
| 🟡 Balanced Reviewer | 0.3 | Balanced review |
| 🟢 Lenient Reviewer | 0.4 | Reader-perspective review |
| 🗳️ Voter | 0.2 | Final verdict |
| 📚 Skill Learner | 0.5 | Learn writing patterns |

### Quality Gate

| Param | Default | Description |
|-------|---------|-------------|
| Pass Threshold | 75 | Score ≥ 75 = pass |
| Revise Threshold | 50 | Score ≥ 50 = revise |
| Max Iterations | 3 | Auto-revision max cycles |
| Min Dimension | 5 | Any dimension below = flagged |

---

## 📂 Project Folder Structure

```
projects/YourNovel/
├── chapters/          ← Final chapters (.md) + writing directions (.json)
├── drafts/            ← Auto-saved drafts
├── projectLog/v{N}/   ← Analysis logs—one version per analysis run
├── worldTreeData/     ← World tree structure
├── characterProfiles/ ← Character profiles
├── tensionReports/    ← Rhythm data
├── reviews/           ← Review records
├── fuzzyMemory/       ← Long-text compression
├── skills/external/   ← Your custom SKILLs → injected into prompts
├── skills/self/       ← AI auto-learned → generated after analysis
└── story_state.json   ← Story state snapshot
```

---

## ❓ FAQ

**Q: Is it free?**
A: Local LLM is free (needs 8GB+ NVIDIA GPU). API costs a few dollars for an entire novel. Local models are free but writing quality is noticeably worse than cloud models—it's a trade-off.

**Q: Do I need coding skills?**
A: No. Just follow the terminal commands.

**Q: AI writing style doesn't match?**
A: Create SKILL rules in the Writer sidebar.

**Q: Will I lose work if I switch pages?**
A: No. Auto-saved drafts restore automatically.

**Q: What AI models are supported?**
A: DeepSeek, OpenAI-compatible APIs, local llama.cpp.

---

# 📄 License

MIT © 2026 Rambolv
