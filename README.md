<div align="center">

# 🖋️ 超逸写手 · Art Super Writer

**你的私人 AI 编辑团队。读完你的小说，再帮你接着写。**

*Your private AI editorial team. Reads your novel, then writes with you.*

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Backend-Flask-lightgrey?logo=flask)](https://flask.palletsprojects.com/)
[![HTML5](https://img.shields.io/badge/Frontend-Vanilla_JS-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Release](https://img.shields.io/badge/release-绿色便携版-brightgreen)](#十三绿色便携版)

</div>

<br>

> 💬 **先说三件事：**
> 1. 大部分用户不需要折腾本地模型。买 DeepSeek API 就行，**几块钱写一本书**，效果比本地模型好得多。
> 2. 想省钱又有显卡的用户——设置里可以把**分析、审查用本地 LLM（免费），写作才用 API（花几块钱）**，两全其美。
> 3. 不知道怎么部署本地模型？可以联系作者付费咨询。
>
> *Three things up front: (1) Most users should just buy DeepSeek API—pocket change, better quality. (2) Budget + GPU users: assign local LLM to analysis/review (free), API to writing (pennies). (3) Paid consultation available for local LLM deployment.*

<br>

## 📑 目录

- [🇨🇳 中文文档](#-中文文档)
  - [一、这是什么](#一这是什么)
  - [二、优劣势（诚实说）](#二优劣势诚实说)
  - [三、30 秒上手](#三30-秒上手)
  - [四、开始你的第一本书](#四开始你的第一本书)
  - [五、写作台详解](#五写作台详解)
  - [六、审查室](#六审查室)
  - [七、世界树 · 角色池 · 节奏控制台](#七世界树--角色池--节奏控制台)
  - [八、设置页](#八设置页)
  - [九、本地 LLM 部署（省钱，需显卡）](#九本地-llm-部署省钱需显卡)
  - [十、核心概念速览](#十核心概念速览)
  - [十一、项目文件结构](#十一项目文件结构)
  - [十二、启动方式对比](#十二启动方式对比)
  - [十三、绿色便携版](#十三绿色便携版)
  - [十四、FAQ](#十四faq)
  - [十五、已知限制](#十五已知限制)
- [🇬🇧 English Documentation](#-english-documentation)

---

<a id="-中文文档"></a>

# 🇨🇳 中文文档

---

<a id="一这是什么"></a>

## 一、这是什么

你用 AI 写过小说吗？打开 DeepSeek，说「帮我写一章」，AI 写了一段，还行。

然后写第二章——AI 忘了第一章。角色开始乱来，死了的人突然活了。你把前文全部复制粘贴进去，还是忘。

**超逸写手解决的就是这个问题。**

逻辑很简单：**写新章之前，先把你的全部小说发给 AI 通读一遍。** AI 读懂了整个故事，才动笔。这样写出来的东西跟前文不矛盾。

除此之外还附带：

- 🧠 **分析故事结构**——主线到哪了、支线进度、伏笔收没收
- 🔍 **审稿**——三个 AI 审稿官从 13 个维度打分 + 具体修改建议
- 📊 **跟踪节奏**——哪章吸引人、哪章读者可能弃书
- 💾 **自动记住一切**——角色性格、关系、位置，写新章自动注入提示词
- 📚 **SKILL 系统**——你定规则 AI 遵守；AI 还能从你的小说里自动学习

> 技术栈：前端纯 HTML5 + Vanilla JS（单页应用），后端 Python Flask，数据全存磁盘不丢。

---

<a id="二优劣势诚实说"></a>

## 二、为什么用这个，而不是直接跟 AI 聊天

打开 DeepSeek 聊天框写小说，最大的问题是：**AI 不知道你的小说前面写了什么。** 你得自己复制粘贴、自己记角色、自己判断写得好不好。

超逸写手做的事情，就是把这些「自己来」变成「自动」。

### 👍 跟你直接用 AI 聊天相比

| 你直接用 AI 聊天 | 用超逸写手 |
|-----------------|----------|
| 😩 每写一章，手动复制粘贴全部前文 | ✅ 自动把你全部小说发给 AI 读完，再动笔 |
| 😩 角色写着写着性格变了、死了的又活了 | ✅ 角色档案自动管理。死了就是死了 |
| 😩 写完了不知道好不好，全靠自己感觉 | ✅ 三个 AI 审稿官从 13 个维度打分 + 给修改建议 |
| 😩 故事线多了脑子乱，伏笔忘了收 | ✅ 世界树自动追踪：主线到哪了、支线进度、伏笔收没收 |
| 😩 每次聊天都重新计费，Token 越用越多 | ✅ Slot 模式：全文预热一次，后续只算新增内容，省 Token |
| 😩 每次 AI 写的风格都不一样 | ✅ SKILL 系统：你定规则，AI 遵守。AI 还从你的小说里自动学 |
| 😩 聊天记录丢了就什么都没了 | ✅ 所有数据存硬盘。崩溃刷新就行，一字不丢 |
| 😩 不知道读者读到每章的感受 | ✅ 节奏控制台：哪章吸引人、哪章读者可能弃书 |

### 👎 劣势（诚实说）

| 问题 | 实话 |
|------|------|
| 要装 Python | 有绿色便携版，解压即用，不用装（见下一节） |
| 要 API Key | DeepSeek 注册就有。写一本书最多几块钱 |
| 不是全自动写书机 | 你构思剧情、编辑 AI 生成的内容。AI 是助手，不是替代 |
| 本地模型写作质量不如 API | 但分析、审查用本地免费的，写作用 API 保质量，两全其美 |

### 💰 花钱还是不花钱

| | 用 API | 纯本地（需显卡） |
|--|--------|---------------|
| 💰 费用 | 几块钱/本书 | 免费 |
| 📝 写作质量 | ✅ 好 | ⚠️ 一般 |
| 🔧 上手 | 注册 → 复制 Key，5 分钟 | 需要 12G+ 显卡 + 配置 |
| 🏠 隐私 | 发给云端 | ✅ 数据不出电脑 |

> **建议：** 想省心直接买 API。有显卡想省钱——**分析/审查用本地、写作用 API**。

---

<a id="三30-秒上手"></a>

## 三、安装（选一种）

### 🟢 方式一：绿色便携版（推荐，不用装任何东西）

1. 下载 `Art-Super-Writer-Portable.zip`（约 4.7MB）
2. 解压到任意文件夹
3. 双击 **`超逸写手启动器.exe`** → 浏览器自动打开 → 完成

> 就是这么简单。U 盘带着走，换电脑直接跑。

### 🔵 方式二：从源码运行（如果你习惯命令行）

```bash
# 1. 装 Python 3.10+（python.org，勾选 Add to PATH）
# 2. 下载项目 ZIP → 解压 → 打开命令行：
cd standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
# 3. 双击 超逸写手启动器.exe 或运行 launcher.py
```

> 国内慢加镜像：`pip install flask requests -i https://pypi.tuna.tsinghua.edu.cn/simple`

### ④ 连上 AI（必须）

1. 打开 [platform.deepseek.com](https://platform.deepseek.com) → 注册 → API Keys → 创建 → 复制 `sk-...`
2. 软件左边栏 ⚙️ 设置 → 添加 LLM 配置 → 供应商 DeepSeek → 模型 `deepseek-chat` → 粘贴 Key → **工作模式选 ⚡ Slot** → 保存 → 测试连接 → ✅

> **为什么选 Slot？** 服务端缓存提示词——重复内容不重复计费。

搞定。可以开始写你的第一本书了。

---

<a id="四开始你的第一本书"></a>

## 四、开始你的第一本书

### A. 你已经有写好的稿子

**① 建项目** → 📁 项目管理 → 输入书名 → 选类型 → 创建

**② 导入** → 点项目 → 📥 导入章节文件 → 选 `.txt` 或 `.md`

**③ 锁住** → 点 🔒 锁定

**④ AI 分析** → 点 🔍 分析（别刷新页面，耐心等）：
```
探测能力 → 分批阅读全文 → 阅读体验
→ 故事结构 → 角色印象 → 整体感受
→ 写作技能 → 输出 JSON
```
完成后世界树/角色池/节奏数据全部生成。

**⑤ 查看结果** → 🌳 世界树 / 🧠 角色池 / 📊 节奏控制台

**⑥ 开始写** → ✍️ 写作台 → 填方向 → 发送 → 定稿

每写一章后回项目管理**重新分析**更新数据。

### B. 写一本新书

创建 → 锁定 → 直接去写作台写第一章。写 2-3 章后回项目管理点分析。

---

<a id="五写作台详解"></a>

## 五、写作台详解

写作台是核心页面。左侧写作，右侧配置。

### 写作方向——最重要的输入框

**越具体越好。**

✅ 好：「主角潜入古城发现密道，尽头是一个封印的石室。追兵赶到，他被迫进入。要求：悬疑氛围要足，环境描写烘托紧张感，石室内容留悬念。」

❌ 差：「写第三章」

### 温度

滑动条 0.1 ~ 1.5。越低越稳定保守，越高越有创意但可能跑偏。新手用 0.8。

### 目标字数

默认 3000。AI 写超过 5000 容易啰嗦。

### 按钮逐一说明

| 按钮 | 作用 |
|------|------|
| 💾 **保存提示词** | 写作方向存到磁盘。切换章节切回来方向还在。**养成写完就保存的习惯。** |
| 📤 **发送给 LLM** | **核心按钮。** 完整流程：探测模型能力 → 压缩（稿子太长自动压旧章为摘要）→ 分批阅读全文 → 注入世界树/角色/节奏/SKILL → AI 流式写新章。最久的是分批阅读——稿子越长越久，可去 📋 历史日志看实时进度。 |
| 🔄 **重新生成** | 不满意重来。上一版不保留，先复制喜欢的部分。 |
| 📌 **定稿** | 正式保存为章节。**已定稿再点会弹确认框**——防误覆盖。 |
| 🔍 **分析本章** | 单独评审刚写的这一章——评分、优点、不足、改进建议。（当前仅分析本章内容，后续版本会加入全文上下文对比。） |

### 右侧面板

**📦 前置 SKILL：** 你写给 AI 的写作规则。例如：

```
标题：对话规则
内容：对话简短，一人一次≤三句。用动作带说话人，不用"说道"。
```

保存并勾选即生效。支持从文件导入：`.txt` `.md` `.docx` `.xlsx` `.json`。（Word 用 mammoth.js 提取纯文本，Excel 用 SheetJS 提取全部表格。）

**📋 写作上下文：** 分析后自动生成的世界树 + 角色 + 节奏数据。AI 写时自动参考，你不需要手动管。

**📖 行为规律参考：** 预设的行为心理学原则（损失厌恶、信任博弈等），AI 参考让角色行为更真实。

---

<a id="六审查室"></a>

## 六、审查室

写完一章来这审稿。选章节 → 点审查：

```
S1 机械闸（19 条规则扫描）
  → 标点 / 句式 / 段落 / 连续性检查

S2 三审官（13 维度评分）
  → 🔴严审(温度 0.3)  🟡衡审(温度 0.3)  🟢宽审(温度 0.4)

🗳️ 夹逼投票 → 🚪 质量门禁
  → ≥75 通过  |  50~74 修订  |  <50 需人工
```

修改建议以卡片展示。点击卡片自动定位原文，支持 Ctrl+Z 撤销。最多自动修订 3 轮。

---

<a id="七世界树--角色池--节奏控制台"></a>

## 七、世界树 · 角色池 · 节奏控制台

三页顶部都有**版本选择器**——每次分析生成一个新版本（v1/v2/v3...），可切换对比。

| 页面 | 数据内容 |
|------|---------|
| 🌳 世界树 | 主线节点 · 支线进度 · 伏笔排序 · 世界观设定 |
| 🧠 角色池 | 性格标签 · 行为模型 · 关系网 · 一致性警告。右侧面板可写自定义分析提示词 |
| 📊 节奏控制台 | 每章吸引力 · 情感浓度 · 连续性健康 |

### 📋 历史日志

分析进行中打开可看实时进度。分析完也可回看每次的完整对话记录。

---

<a id="八设置页"></a>

## 八、设置页

### 🔥 独立指定 LLM——最重要的省钱功能

每个功能可以分别指定不同的 LLM：

| 角色 | 推荐策略 |
|------|---------|
| ✍️ 写作 | DeepSeek API（质量第一） |
| 🔍 分析 | 本地 LLM（免费） |
| 🔴 严审 / 🟡 衡审 / 🟢 宽审 | 本地 LLM（免费） |
| 🗳️ 投票 | 本地 LLM（免费） |
| 📚 技能学习 | 本地 LLM（免费） |

> **最佳省钱组合：** 写作 → API（保质量），分析 + 审查 + 投票 + 技能学习 → 本地 LLM（全免费）。

### 工作模式

⚡ **Slot**（推荐）：服务端缓存提示词，重复内容不重复计费。DeepSeek 和 llama.cpp 都支持。

🔵 **Stateless**：每次发完整对话历史。兼容性最好，但 Token 消耗大。不确定就选这个。

### 质量门禁

审查时 ≥75 通过，50~74 修订，<50 需人工。最多自动修订 3 轮。

---

<a id="九本地-llm-部署省钱需显卡"></a>

## 九、本地 LLM 部署（省钱，需显卡）

> ⚠️ 本节适合有显卡、愿意折腾的用户。**大多数用户不需要看——直接买 DeepSeek API 就行。**

简单说：在你的电脑上跑一个免费的 AI 模型，写作质量不如 API，但分析、审查够用。

**你需要：** 12GB+ 显存的 NVIDIA 显卡 + 32GB 内存。推荐模型 Qwen3.6-35B-A3B（MoE 架构，实际只占 ~5.5GB 显存）。

**怎么做：** 下载 llama.cpp → 下载 GGUF 模型 → 写一个启动脚本 → 软件设置里添加 `http://127.0.0.1:8080`。

详细教程太长，不适合放 README。需要的话联系作者，或参考项目 `docs/` 目录。

部署好后，在设置里把分析、审查指向本地 LLM（免费），写作仍用 API（保质量）。

---

<a id="十核心概念速览"></a>

## 十、核心概念速览

### ⚡ Slot 模式原理

跟编辑开会——第一次你把稿子一章一章给他看，他记住。第二次带新的一章，不用重印旧的，他记得。

Slot 同理。AI 第一次读完你全文，服务端保留 KV 缓存。后续请求只算新增内容。Stateless 则每次都重算全部——即使内容一模一样。**DeepSeek 也支持 Slot**（通过 `prompt_cache`）。

### 🗜️ 模糊记忆

稿子太长超过 AI 容量？系统自动把旧章节压缩为摘要。AI 仍知整体情节，只丢细节。压缩文件在 `fuzzyMemory/`。

### 🔢 分析版本

每次分析生成一个新版本（v1/v2/v3...），世界树/角色池/节奏控制台顶部都有版本选择器可切换对比。

### 📚 SKILL 自动学习

除了你手动创建的 SKILL，AI 每次分析完成后会自动总结你小说的优点和不足，保存到 `skills/self/`，下次写作用。

---

<a id="十一项目文件结构"></a>

## 十一、项目文件结构

```
projects/你的小说名/
├── chapters/              ← 正式章节(.md) + 写作方向(.json)
├── drafts/                ← 草稿（自动保存）
├── config/                ← 项目配置
├── projectLog/v{N}/       ← 每次分析的完整记录
│   ├── 分析报告_第1~N轮.md
│   └── writer_prompt_第XXX章.json
├── worldTreeData/         ← 世界树数据
├── characterProfiles/     ← 角色档案
├── characterAnalysis/     ← 角色深度分析
├── tensionReports/        ← 节奏数据
├── reviews/               ← 审查记录
├── reviewHistory/         ← 审查历史
├── fuzzyMemory/           ← 长文压缩摘要
├── skills/external/       ← 你的 SKILL → 写作注入
├── skills/self/           ← AI 自动学习 → 分析后生成
├── styleMemory/           ← 风格记忆
├── referenceNotes/        ← 参考笔记
└── story_state.json       ← 故事状态快照
```

---

<a id="十二启动方式对比"></a>

## 十二、启动方式对比

| 方式 | 文件 | 适用场景 |
|------|------|---------|
| 🖥️ **图形启动器**（推荐） | `超逸写手启动器.exe` | 日常使用，可勾选启动服务器/打开主页/启动本地 LLM |
| 🐍 **Python 启动器** | `launcher.py` | 没有 EXE 或需要查看日志 |
| ⚡ **批处理** | `start_server.bat` | 快速启动服务器 |
| 📜 **PowerShell** | `launcher.ps1` | PowerShell 用户 |
| 🚀 **一键启动** | `启动超逸写手.bat` | 最简启动 |

所有方式最终都启动 `server.py`（端口 8899），然后浏览器打开 `index.html`。

---

<a id="十三绿色便携版"></a>

## 十三、自己打包绿色便携版

上面[第三步](#三30-秒上手)说的便携版 ZIP，如果你从 GitHub 下载的是源码，可以自己生成：

```bash
python build_portable.py
```

会生成 `Art-Super-Writer-Portable.zip`（约 4.7MB），给别人用或 U 盘带着走。

---

<a id="十四faq"></a>

## 十四、FAQ

**Q: 必须花钱吗？**
A: 不一定。本地 LLM 完全免费（需 12G+ 显卡）。买 API 也很便宜——几块钱一本。最佳方案：写作用 API（保质量），分析/审查用本地（省钱）。

**Q: 要会编程吗？**
A: 不用。按教程敲几行命令。一次装完以后双击启动器就行。

**Q: 文风不对怎么办？**
A: 📦 前置 SKILL 创建写作规则。保存并勾选即生效。

**Q: 切换页面会丢内容吗？**
A: 不会。自动存草稿到磁盘。

**Q: 崩溃了怎么办？**
A: 刷新浏览器。数据全在硬盘上，不会丢。

**Q: 能同时写几本书？**
A: 能。解锁当前 → 锁另一本。数据完全独立。

**Q: 支持什么 AI？**
A: DeepSeek、OpenAI 兼容接口、本地 llama.cpp。任何兼容 OpenAI Chat Completions API 的服务都支持。

**Q: Slot 还是 Stateless？**
A: 首选 Slot。DeepSeek 和 llama.cpp 都支持。连不上再换 Stateless。

**Q: 分批阅读是什么？**
A: 你的稿子太长 AI 一次读不完。系统自动切成块，一块块发给 AI 读完。全部读完才开始写新章，确保不矛盾。

**Q: 数据怎么备份？**
A: 复制整个 `projects/` 文件夹即可。所有项目数据都在里面。

---

<a id="十五已知限制"></a>

## 十五、已知限制

| 问题 | 影响 | 状态 |
|------|------|------|
| 「分析本章」仅看当前章节，不参考全文上下文 | 分析结果缺少全局视角 | 计划改造中 |
| 超长小说（100 章+）分批阅读耗时长 | 需耐心等待 | 设计如此；模糊记忆已缓解 |
| Stateless 模式多轮对话每次重发全文 | Token 消耗大 | 推荐用 Slot 模式规避 |
| 本地 7B/14B 模型写作质量有限 | 建议写作用云端 API | 设计如此 |

---

<br>
<br>

---

<a id="-english-documentation"></a>

# 🇬🇧 English Documentation

---

## 1. What Is This?

You've used AI to write fiction. You prompt it, it writes a chapter—decent. Then Chapter 2. AI forgot Chapter 1. Characters morph, dead people return. You paste the whole novel into the prompt—still forgets.

**Art Super Writer solves this.**

Before writing each new chapter, the AI reads your **entire novel** first. Only then does it write. No contradictions. No forgotten plot.

Plus:
- 🧠 **Story structure analysis** — main plot progress, subplots, foreshadowing
- 🔍 **Triple-AI review** — three reviewers score 13 dimensions with specific suggestions
- 📊 **Pacing tracking** — which chapters grip, which might lose readers
- 💾 **Auto-memory** — character traits, relationships, locations auto-injected into prompts
- 📚 **SKILL system** — you define writing rules; AI also auto-learns from your novel

> **Tech stack:** Frontend = pure HTML5 + Vanilla JS (SPA). Backend = Python Flask. All data persisted to disk.

---

## 2. Why This Instead of Just Chatting with AI?

The problem with using ChatGPT/DeepSeek chat to write a novel: **the AI doesn't remember what you wrote before.** You copy-paste old chapters yourself. You track characters yourself. You judge quality yourself.

Art Super Writer automates all of that.

### 👍 Compared to chatting directly with AI

| Chatting with AI directly | With Art Super Writer |
|--------------------------|----------------------|
| 😩 Copy-paste entire novel before each chapter | ✅ AI auto-reads your ENTIRE novel first, then writes |
| 😩 Characters drift—dead ones come back to life | ✅ Character profiles auto-managed. Dead stays dead |
| 😩 No objective feedback on your writing | ✅ Three AI reviewers score 13 dimensions + give suggestions |
| 😩 Lose track of subplots and foreshadowing | ✅ World Tree auto-tracks: main plot, subplots, foreshadowing |
| 😩 Every chat re-bills from scratch | ✅ Slot mode: warm context once, subsequent calls near-zero cost |
| 😩 AI writes in a different style each time | ✅ SKILL system: you set rules, AI follows. AI also auto-learns |
| 😩 Lose everything if chat history disappears | ✅ All data on disk. Crash? Refresh. Nothing lost |
| 😩 No idea how readers experience each chapter | ✅ Rhythm Console: which chapters grip, which might lose readers |

### 👎 Cons (Honest)

| Issue | Reality |
|-------|---------|
| Need Python? | Portable ZIP available—extract and run, no install needed |
| Costs money? | DeepSeek API = ~$0.50 per NOVEL. Pocket change |
| One-click book generator? | No. You plan the plot, edit AI output. AI is assistant, not replacement |
| Local LLM quality | Writing quality trails API, but good enough for analysis/review (which is free!) |

### 💰 API vs Local

| | API | Local (needs GPU) |
|--|-----|-------------------|
| 💰 Cost | ~$0.50/novel | Free |
| 📝 Quality | ✅ Excellent | ⚠️ Decent |
| 🔧 Setup | Sign up → copy key, 5 min | 12GB+ GPU + config |
| 🏠 Privacy | Sent to cloud | ✅ Stays local |

> **Recommendation:** Buy API. Have a GPU? Mix: local for analysis/review (free), API for writing (quality).

---

## 3. Installation (Pick One)

### 🟢 Option 1: Portable Edition (Recommended—no install needed)

1. Download `Art-Super-Writer-Portable.zip` (~4.7MB)
2. Extract anywhere
3. Double-click **`超逸写手启动器.exe`** → browser opens → done

> That's it. Put it on a USB drive, run on any PC.

### 🔵 Option 2: From Source (if you prefer command line)

```bash
# 1. Install Python 3.10+ (python.org, check Add to PATH)
# 2. Download project ZIP → extract → open terminal:
cd standalone
python -m venv .venv
.venv\Scripts\activate      # Mac/Linux: source .venv/bin/activate
pip install flask requests
# 3. Double-click 超逸写手启动器.exe or run launcher.py
```

> Slow in China? `pip install flask requests -i https://pypi.tuna.tsinghua.edu.cn/simple`

### ④ Connect AI (Required)

1. [platform.deepseek.com](https://platform.deepseek.com) → sign up → API Keys → create → copy `sk-...`
2. App sidebar → ⚙️ Settings → Add LLM → Provider: DeepSeek → Model: `deepseek-chat` → paste key → **Mode: ⚡ Slot** → save → test → ✅

> **Why Slot?** Server caches prompt—repeated content isn't re-billed.

Done. Start writing your first novel.

---

## 4. Your First Novel

### A. You Already Have Drafts

**① Create project** → 📁 Project Manager → name → type → create

**② Import** → click project → 📥 Import → select `.txt` / `.md` files

**③ Lock** → click 🔒

**④ Analyze** → click 🔍 Analyze (don't refresh—wait):
```
Probe capacity → batch-read full text → reading experience
→ story structure → character impressions → overall feel
→ writing skills → JSON output
```
World Tree / Characters / Rhythm data auto-generated.

**⑤ View results** → 🌳 World Tree / 🧠 Characters / 📊 Rhythm Console

**⑥ Write** → ✍️ Writer Desk → fill direction → send → finalize

Re-analyze after each chapter to update data.

### B. Starting Fresh

Create → lock → Writer Desk directly → analyze after 2-3 chapters.

---

## 5. Writer Desk

### Direction — Most Important Field

**Be specific.**

✅ Good: "The protagonist infiltrates the ancient city, discovers a hidden passage leading to a sealed chamber. Pursuers arrive, forcing entry. Requirements: suspenseful atmosphere, environmental description building tension, leave the chamber's secret unresolved."

❌ Bad: "Write chapter 3"

### Temperature

Slider 0.1–1.5. Lower = stable/conservative. Higher = creative but may drift. New users: 0.8.

### Target Word Count

Default 3000. AI tends to ramble past 5000.

### Button Guide

| Button | What It Does |
|--------|-------------|
| 💾 **Save Direction** | Persist writing direction to disk. Survives chapter switching. |
| 📤 **Send to LLM** | **Core button.** Full pipeline: probe → compress (if too long) → batch-read all chapters → inject World Tree/Characters/Rhythm/SKILLs → stream-generate new chapter. Batch-reading takes longest—check 📋 History Log for real-time progress. |
| 🔄 **Regenerate** | Retry. Previous version not kept—copy what you like first. |
| 📌 **Finalize** | Save as official chapter. Re-finalizing shows confirmation dialog to prevent overwrites. |
| 🔍 **Analyze Chapter** | Grade just this chapter—score, strengths, weaknesses, suggestions. (Currently chapter-only; full-context analysis planned.) |

### Right Panel

**📦 SKILLs:** Writing rules for AI. Supports import from `.txt` `.md` `.docx` `.xlsx` `.json`. Word docs parsed via mammoth.js, Excel via SheetJS.

**📋 Writing Context:** Auto-generated World Tree + Characters + Rhythm data. AI references this automatically.

**📖 Behavior Patterns:** Preset behavioral psychology principles (loss aversion, trust games, etc.) for realistic character actions.

---

## 6. Review Room

Select chapter → review:

```
S1 Mechanical Scan (19 regex rules)
  → punctuation / sentence patterns / paragraphs / continuity

S2 Three Reviewers (13 dimensions)
  → 🔴Strict(temp 0.3)  🟡Balanced(temp 0.3)  🟢Lenient(temp 0.4)

🗳️ Squeeze Vote → 🚪 Quality Gate
  → ≥75 PASS  |  50–74 REVISE  |  <50 MANUAL
```

Suggestions shown as cards. Click to navigate to source text. Ctrl+Z to undo. Max 3 auto-revision rounds.

---

## 7. World Tree · Characters · Rhythm Console

All three pages have **version selectors**—each analysis creates a new version for comparison.

| Page | Data |
|------|------|
| 🌳 World Tree | Main plot nodes · subplot progress · foreshadowing · world-building |
| 🧠 Characters | Personality tags · behavior models · relationship web · consistency warnings. Custom analysis prompts in right panel |
| 📊 Rhythm Console | Per-chapter engagement · emotional intensity · continuity health |

### 📋 History Log

Open during analysis for real-time progress. Review full conversation logs after completion.

---

## 8. Settings

### 🔥 Independent LLM Assignment — The Killer Feature

Assign different LLMs per function:

| Role | Recommended |
|------|------------|
| ✍️ Writer | DeepSeek API (quality) |
| 🔍 Analysis | Local LLM (free) |
| 🔴 Strict / 🟡 Balanced / 🟢 Lenient | Local LLM (free) |
| 🗳️ Voter | Local LLM (free) |
| 📚 Skill Learner | Local LLM (free) |

> **Best combo:** Writer → API (quality); everything else → local LLM (all free).

### Work Mode

⚡ **Slot** (recommended): Server caches prompts. DeepSeek + llama.cpp supported.

🔵 **Stateless**: Full history each request. Best compatibility, higher token usage.

### Quality Gate

Review: ≥75 pass, 50–74 revise, <50 manual. Max 3 auto-revision rounds.

---

## 9. Local LLM Setup

> ⚠️ This section is for users with a GPU who like to tinker. **Most users don't need this—just buy DeepSeek API.**

Run a free AI model on your own machine. Writing quality trails API models, but good enough for analysis and review.

**You need:** 12GB+ NVIDIA GPU + 32GB RAM. Recommended model: Qwen3.6-35B-A3B (MoE, only ~5.5GB VRAM used).

**How:** Download llama.cpp → download GGUF model → write a startup script → add `http://127.0.0.1:8080` in settings.

Detailed guide is too long for README. Contact the author for help, or check the `docs/` folder.

Once set up: assign analysis and review to local LLM (free), keep writing on API (quality).

---

## 10. Key Concepts

**Slot Mode:** Like briefing an editor—they remember previous chapters. Subsequent requests only process new content. DeepSeek supports this via `prompt_cache`.

**Fuzzy Memory:** Auto-compresses old chapters into summaries when text exceeds AI capacity. Files in `fuzzyMemory/`.

**Version Selector:** Each analysis = new version (v1/v2/v3...). Switch and compare on World Tree/Characters/Rhythm pages.

**SKILL Auto-Learning:** AI generates writing tips from your novel after each analysis, saved to `skills/self/`.

---

## 11. Project Folder Structure

```
projects/YourNovel/
├── chapters/              ← Final .md + direction .json
├── drafts/                ← Auto-saved drafts
├── config/                ← Project config
├── projectLog/v{N}/       ← Per-analysis logs
├── worldTreeData/         ← World tree
├── characterProfiles/     ← Character profiles
├── characterAnalysis/     ← Deep character analysis
├── tensionReports/        ← Rhythm data
├── reviews/               ← Review records
├── reviewHistory/         ← Review history
├── fuzzyMemory/           ← Compressed summaries
├── skills/external/       ← Your SKILLs
├── skills/self/           ← AI auto-learned
├── styleMemory/           ← Style memory
├── referenceNotes/        ← Reference notes
└── story_state.json       ← Story snapshot
```

---

## 12. Launch Methods

| Method | File | Use Case |
|--------|------|----------|
| 🖥️ **GUI Launcher** (recommended) | `超逸写手启动器.exe` | Daily use, toggle server/browser/local LLM |
| 🐍 **Python Launcher** | `launcher.py` | No EXE or need logs |
| ⚡ **Batch** | `start_server.bat` | Quick server start |
| 📜 **PowerShell** | `launcher.ps1` | PowerShell users |
| 🚀 **One-click** | `启动超逸写手.bat` | Simplest launch |

All launch `server.py` (port 8899) then open `index.html` in browser.

---

## 13. Build Your Own Portable Edition

If you downloaded the source code (not the pre-built ZIP from [Step 3](#3-installation-pick-one)):

```bash
python build_portable.py
```

Generates `Art-Super-Writer-Portable.zip` (~4.7MB). Give it to others or carry on a USB drive.

---

## 14. FAQ

**Q: Do I have to pay?**
A: No—local LLM is free (needs 12GB+ GPU). API is cheap (~$0.50/novel). Best of both: API for writing, local for analysis/review.

**Q: Do I need to code?**
A: No. Follow the tutorial, run a few commands. After setup, just double-click the launcher.

**Q: Style doesn't match?**
A: Use 📦 SKILLs to create writing rules. Save and enable.

**Q: Will switching pages lose my work?**
A: No. Auto-saves drafts to disk.

**Q: What if it crashes?**
A: Refresh browser. All data is on disk, nothing lost.

**Q: Can I work on multiple novels?**
A: Yes. Unlock current → lock another. Completely independent data.

**Q: Which AI providers are supported?**
A: DeepSeek, OpenAI-compatible APIs, local llama.cpp. Any OpenAI Chat Completions-compatible service works.

**Q: Slot or Stateless?**
A: Slot first. Both DeepSeek and llama.cpp support it. Fall back to Stateless if issues.

**Q: What's batch-reading?**
A: When your novel is too long for one read, the system auto-splits it into chunks, sends them one by one, then writes. Ensures new chapters stay consistent.

**Q: How do I back up my data?**
A: Copy the entire `projects/` folder. Everything is in there.

---

## 15. Known Limitations

| Issue | Impact | Status |
|-------|--------|--------|
| "Analyze Chapter" only sees current chapter, not full context | Scores lack global perspective | Planned improvement |
| Very long novels (100+ chapters) have slow batch-reading | Requires patience | By design; fuzzy memory mitigates |
| Stateless mode re-sends full history each turn | Higher token usage | Use Slot mode to avoid |
| Local 7B/14B models have limited writing quality | Recommend API for writing | By design |

---

<br>
<div align="center">

**🖋️ 写好书，用好工具。** · *Write well. Use good tools.*

[GitHub](https://github.com/Rambolv/Art-Super-Writer) · [提 Issue](https://github.com/Rambolv/Art-Super-Writer/issues) · [DeepSeek API](https://platform.deepseek.com)

</div>
