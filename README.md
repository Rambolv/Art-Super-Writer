<div align="center">

# 🖋️ 超逸写手 · Art Super Writer

**超能写手，飘逸流畅**

*——你的私人AI写作团队*

<br>

**Super writer, elegantly fluent.**

*——Your private AI writing team*

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

<br>

> 💬 **开始之前：** 完全不想折腾？**买 DeepSeek API 就行**，几块钱写一本书。设置里把工作模式选 ⚡ Slot，省钱省心。

---

# 🇨🇳 中文文档

---

## 📑 目录

- [第一部分：傻瓜教程](#第一部分傻瓜教程)
  - [一、打开软件 → 连上 AI](#一打开软件--连上-ai)
  - [二、建立你的项目](#二建立你的项目)
- [第二部分：按流程详解](#第二部分按流程详解)
  - [三、写作台——写新章节](#三写作台写新章节)
  - [四、审查室——定稿后不满意的时候用](#四审查室定稿后不满意的时候用)
  - [五、三个「分析」的区别](#五三个分析的区别)
  - [六、其他页面简介](#六其他页面简介)
- [第三部分：注意事项](#第三部分注意事项)
  - [七、关于 LLM 的选择](#七关于-llm-的选择)
  - [八、重要提示](#八重要提示)
- [第四部分：本地部署 LLM（极简版）](#第四部分本地部署-llm极简版)
- [FAQ](#faq)
- [🇬🇧 English Documentation](#-english-documentation)

---

## 功能一览

| 模块 | 做什么 |
|------|--------|
| 📁 **项目管理** | 创建项目、导入章节文件（.txt/.md）、锁定/解锁、AI 分析全部章节 |
| ✍️ **写作台** | 写提示词 → AI 阅读全文 → 生成新章节 → 编辑 → 定稿 |
| 🌳 **世界树** | 展示故事结构：主线节点、支线进度、伏笔排序、世界观设定 |
| 🧠 **角色池** | 展示角色性格、行为模式、关系网、一致性警告。可做深度分析 |
| 📊 **节奏控制台** | 展示每章吸引力、情感浓度、连续性健康数据 |
| 🔍 **审查室** | S1 机械闸 + S2 三审官（13 维度评分）+ 夹逼投票 + 质量门禁 |
| 🤖 **全自动写作** | 全自动长篇写作（付费功能） |
| 📋 **历史日志** | 分析进行中看实时进度、分析完回看完整对话记录 |
| ⚙️ **设置** | 管理 LLM 配置、分角色指定不同 LLM、质量门禁阈值、13 维度权重 |

---

<a id="为什么用这个"></a>

## 为什么用这个，而不是直接跟 AI 聊天

打开 DeepSeek 聊天框写小说，最大的问题是：**AI 不知道你的小说前面写了什么。** 你得自己复制粘贴、自己记角色、自己判断写得好不好。

超逸写手做的事情，就是把这些「自己来」变成「自动」。

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

---

# 第一部分：傻瓜教程

---

<a id="一打开软件--连上-ai"></a>

## 一、打开软件 → 连上 AI

### 1. 打开软件

**新手选这个（什么都不用装）：**

1. 下载 `Art-Super-Writer-Portable.zip`
2. 解压到任意文件夹
3. 双击 **`超逸写手启动器.exe`**
4. 浏览器自动打开 http://127.0.0.1:8899 → ✅ 完成

> 如果从 GitHub 下载的是源码，打开命令行：`cd standalone` → `.venv\Scripts\activate` → `pip install flask requests` → 双击启动器。

### 2. 连上 AI（必须）

左边栏点 **⚙️ 设置** → 添加 LLM 配置：

| 步骤 | 操作 |
|------|------|
| ① | 供应商选 **DeepSeek** |
| ② | 地址默认 **https://api.deepseek.com** |
| ③ | 模型填 **deepseek-v4-flash**（或 deepseek-v4-pro，后者更强） |
| ④ | 粘贴你的 API Key（去 [platform.deepseek.com](https://platform.deepseek.com) 注册→API Keys→创建→复制 `sk-...`） |
| ⑤ | 工作模式选 **⚡ Slot** |
| ⑥ | 点保存 |
| ⑦ | 点「🔗 测试连接」→ 显示 ✅ 就对了 |

> **为什么选 Slot？** 服务器会缓存你发过的内容，一样的内容不重复计费，省钱。

---

<a id="二建立你的项目"></a>

## 二、建立你的项目

### 情况A：你已经写了稿子（有 .txt 或 .md 文件）

**① 创建项目**

左边栏 → 📁 项目管理 → 上方输入书名 → 选小说类型 → 点「创建」

**② 导入文件**

点你的项目名字 → 点「📥 导入章节文件」→ 选中你的 `.txt` 或 `.md` 文件

**③ 锁定**

点「🔒 锁定」——不锁定无法使用其他功能

**④ AI 分析你的小说**

点「🔍 分析」

> 注意：不要刷新页面，耐心等。时间取决于你的小说长度。可以去 📋 历史日志看实时进度。
> 如果用的是本地模型，分析会比较慢——正常。

分析完成后：
- 🌳 世界树 → 看故事结构
- 🧠 角色池 → 看角色档案
- 📊 节奏控制台 → 看每章的阅读体验

**⑤ 去写作台写新章节**

左边栏 → ✍️ 写作台 → 写提示词 → 点「发送给 LLM」→ AI 帮你写 → 满意了点「定稿」

**⑥ 每写完一章后记得回项目管理，重新点一次「🔍 分析」**，更新数据。

### 情况B：从零开始写一本新书

1. 创建项目 → 锁定
2. 直接去 ✍️ **写作台**写第一章
3. 写完 2-3 章后，回项目管理点「🔍 分析」更新数据
4. 继续写

---

# 第二部分：按流程详解

---

<a id="三写作台写新章节"></a>

## 三、写作台——写新章节

写作台是核心页面。左边写，右边看。

### 第一步：写提示词（最重要的输入框）

上面有个大输入框，标签写着「写作方向」。**你在这里告诉 AI 这章写什么。**

✅ **好的例子：**
```
主角潜入古城发现密道，尽头是一个封印的石室。追兵赶到，他被迫进入。
要求：悬疑氛围要足，环境描写烘托紧张感，石室内容留悬念。
```

❌ **差的例子：**
```
写第三章
```

**越具体越好。** 把关键事件、人物互动、氛围要求都写进去。

写完之后，点旁边的「💾 保存提示词」按钮存到硬盘，防止切换页面丢了。

### 第二步：让 AI 写

点 **「📤 发送给 LLM」** 按钮。

> 这个名字是按钮上写的，不用管它叫什么，记住它作用是「让 AI 开始写」。

点下去之后，AI 会做这些事情（你不需要管，等着就行）：

| 步骤 | 干什么 | 大概多久 |
|------|--------|---------|
| ① 探测 | 问 AI 你的上下文有多大 | 1-2 秒 |
| ② 压缩 | 如果稿子太长，自动把旧章节压成摘要 | 几秒~几十秒 |
| ③ 分批阅读 | **把你的全部小说发给 AI 读完**，这是关键一步 | 10 秒~几分钟（越长越久） |
| ④ 注入 | 把世界树、角色数据、节奏数据、SKILL 规则喂给 AI | 瞬间 |
| ⑤ 生成 | AI 开始写新章节，逐字显示出来 | 30 秒~几分钟 |

**第③步最久，但最核心。** AI 只有读完你全部前文，才知道完整故事，写出来的新章才不跟前面矛盾。

### 第三步：看结果、改文章

AI 生成的内容会显示在 **「📝 生成结果」** 框里。

- 直接在这个框里修改文字（想怎么改就怎么改），**请等待确认生成完毕后再修改**，否则修改不一定会被保留
- 不满意可以点 **「🔄 重新生成」**，但上一版不保留——如果上一版本有你喜欢的片段，**先复制你喜欢的部分**
- 右边 **「📋 写作上下文」** 面板显示的是 AI 自动参考的数据，你不用管

### 第四步：定稿

改满意了，点 **「📌 定稿」** → 正式保存为章节。

> ⚠️ 如果这一章已经定稿过了，再定稿会弹确认框——防止你误覆盖以前写好的内容。

### 右边面板还有啥

| 面板 | 这是啥 |
|------|--------|
| 📦 前置 SKILL | 你写给 AI 的写作技巧。比如「人物行为要有深层次逻辑性同时也要保留动物性冲动，但是不能突兀，要让读者感觉自然」「本文就要荒诞搞笑到极点，不需要遵从常规，只需要狂野想象力丰富」。可以新建写一份，也可以导入以前的文档，保存勾选就生效，可以删除 |
| 📋 写作上下文 | 自动生成的世界树+角色+节奏数据，AI 写时会参考，你不用管 |
| 📖 行为规律参考 | 一些心理学原则（损失厌恶、信任博弈等），AI 参考让角色行为更真实 |

---

<a id="四审查室定稿后不满意的时候用"></a>

## 四、审查室——定稿后不满意的时候用

**什么时候来：** 定稿了，但总觉得哪里不对，又说不清楚。

### 怎么用

1. 左边栏 → 🔍 审查室
2. 选你要审查的章节
3. 点审查（等待 AI 分析）
4. 分析完成后，右边会显示分析意见
5. **看意见** → 决定怎么改
6. **改文章** → 在审查室的编辑框里改

### ⚠️ 重要提醒

- **没分析之前不要改。** 在审查室的编辑框里乱改可能不生效。
- 右边分析意见卡片上有个「应用」按钮……**点它可能有 Bug**。建议你照着意见自己手动改。
- 改完了记得保存。

### 审查是怎么评的

三个 AI 审稿官（严审、衡审、宽审）从 13 个维度打分：

| 分数 | 结果 |
|------|------|
| ≥75 | ✅ 通过 |
| 50~74 | 🔄 建议修订 |
| <50 | 👤 需要你人工判断 |

---

<a id="五三个分析的区别"></a>

## 五、三个「分析」的区别

| 在哪里 | 按钮 | 分析什么 | 什么时候用 |
|--------|------|---------|-----------|
| 项目管理页 | 🔍 **分析** | **整个项目的全部章节**，更新世界树/角色池/节奏数据 | 导入稿子后、每写完一章后 |
| 写作台 | 🔍 **分析本章** | **只看当前这一章**，不看全文 | 刚写完后想快速评判 |
| 角色池 | 🔍 **分析** | **针对所有角色**做深度分析（分析结果可能和之前一样） | 想全面刷新角色数据时 |

> 写作台的「分析本章」只看当前章节——如果想知道这章放在整本书里好不好，还是需要回项目管理跑一次完整的「🔍 分析」。

---

<a id="六其他页面简介"></a>

## 六、其他页面简介

| 页面 | 干啥的 |
|------|--------|
| 🌳 世界树 | 你的小说剧情结构——主线到哪了、支线进度、伏笔收了没 |
| 🧠 角色池 | 角色的性格、行为模式、关系网。可以写自定义提示词分析特定角色 |
| 📊 节奏控制台 | 每章的吸引力和情感浓度数据 |
| 📋 历史日志 | 分析进行中看实时进度，分析完回看完整对话记录 |

三页顶部都有版本选择器——每次分析生成一个新版本（v1/v2/v3），不同大模型出来的结果不一样，可以切换对比看分析结果。

---

<a id="设置页详解"></a>

## 七、设置页各项设定详解

左边栏 ⚙️ **设置** 打开后，你会看到以下内容。

### 1. LLM 配置管理

**添加 LLM：**

| 字段 | 说明 |
|------|------|
| 名称 | 你给这个配置取的名字，比如「DeepSeek 写作」「本地分析」 |
| 供应商 | DeepSeek / OpenAI 兼容 / 自托管。选 DeepSeek 地址自动填好 |
| 地址 | API 地址。DeepSeek 是 `https://api.deepseek.com`，本地模型是 `http://127.0.0.1:8080/v1` |
| 模型 | 模型名。DeepSeek 填 `deepseek-v4-flash`（或 `deepseek-v4-pro`，更强）。本地模型按你下载的文件名填 |
| API Key | 粘贴你的 Key。点「👁️」可切换显示/隐藏。点「📋」从剪贴板粘贴 |
| 工作模式 | **⚡ Slot**（推荐，省 Token）或 **🔵 Stateless**（兼容性强）。不确定选 Stateless |

> Slot 模式下，AI 第一次读完你的全文后会缓存，后续只算新增内容，重复内容不重复计费。DeepSeek 和 llama.cpp 都支持。

**管理已有配置：** 每张卡片显示 LLM 名称、供应商、地址、模型、工作模式、连接状态。你可以：
- ☑ **激活**——一个配置设为激活后，新添加角色会默认使用它
- 🗑️ **删除**——删掉不再用的配置
- 点击卡片直接编辑

### 2. 分角色参数（🔥 核心省钱功能）

不同任务可以分别指定不同的 LLM，不需要全都用同一个。

| 角色 | 干什么的 | 建议 |
|------|---------|------|
| ✍️ 写作 | 写新章节 | DeepSeek API（质量好） |
| 🔍 分析 | 分析全部章节，生成世界树/角色/节奏数据 | 本地模型（免费但慢）或 API |
| 🔴 严审 | 三审官之一，对所有子项严格评分 | 本地模型（免费）或 API |
| 🟡 衡审 | 三审官之一，审查核心子项 | 同上 |
| 🟢 宽审 | 三审官之一，只看大局维度 | 同上 |
| 🗳️ 投票 | 三审意见不一致时投票裁决 | 同上 |
| 📚 技能学习 | AI 自动从你的小说里学写作技巧 | 同上 |

每个角色都可以选择已保存的任意 LLM 配置，并且可以分别设置温度。

> **省钱组合：** 写作 → DeepSeek API（保质量），分析 + 三审 + 投票 + 技能学习 → 本地 LLM（全免费）。

### 3. 质量门禁

只有审查室用。控制审查结果怎么判定：

| 设置 | 作用 | 推荐值 |
|------|------|--------|
| 通过阈值 | ≥ 这个分数自动通过 | 75 |
| 修订阈值 | ≥ 这个分数需要修订再审 | 50 |
| 最大修订次数 | 最多自动修订几轮 | 3 |
| 严审维度最低分 | 低于这个分数直接标记严重 | 5 |

判定逻辑：
- ≥ 通过阈值 → ✅ 通过
- ≥ 修订阈值 → 🔄 建议修订（AI 自动改，最多改 N 轮）
- < 修订阈值 → 👤 需要你人工判断

### 4. 审查权重

三个审稿官的评分权重：

| 审稿官 | 默认权重 | 含义 |
|--------|---------|------|
| 🔴 严审 | 1.0 | 最严格，权重最高 |
| 🟡 衡审 | 0.7 | 中等，平衡派 |
| 🟢 宽审 | 0.4 | 宽松，权重最低 |

### 5. 13 维度权重

审查时从 13 个维度打分，每个维度的权重可以单独调整：

情节(1.5) · 角色(1.5) · 对话(1.2) · 节奏(1.1) · 文风(1.0) · 一致性(1.4) · 情感冲击(1.2) · 原创性(0.9) · 可读性(1.0) · AI味检测(1.3) · 角色心理(1.6) · 社会互动(1.4) · 例外真实性(1.3)

> 数字越大说明这个维度越重要。默认值基本合理，一般不需要改。

---

# 第三部分：注意事项

---

<a id="八关于-llm-的选择"></a>

## 八、关于 LLM 的选择

### 最推荐：全部用 DeepSeek API

- 便宜：**几块钱写一本书**
- 效果好：云端大模型写作质量远好于本地小模型
- 省心：注册 → 复制 Key → 粘贴 → 搞定

### 如果你想省钱（有显卡）

设置里分角色参数那里，把不同任务指定不同的 AI：

| 任务 | 建议用 |
|------|--------|
| ✍️ 写作 | DeepSeek API（保质量） |
| 🔍 分析 / 审查 / 投票 | 本地模型（免费） |

> **注意：** 本地模型做分析和审查会比较慢。如果你觉得慢，或者效果不好，全部换回 API 就行。

### Slot vs Stateless

- **⚡ Slot（推荐）**：AI 记住之前的内容，重复内容不重复收费。DeepSeek 和本地模型都支持。
- **🔵 Stateless**：每次重新发全部内容。兼容性好但 Token 用得多。

**不确定就选 Stateless。**

---

<a id="九重要提示"></a>

## 九、重要提示

- **定稿覆盖保护：** 已经定稿的章节再次定稿会弹出确认框，防止误覆盖
- **数据安全：** 所有数据存在硬盘上的 `projects/` 文件夹。崩溃就刷新浏览器，一字不丢。备份只需复制这个文件夹
- **切换页面：** 内容自动保存到硬盘，不会丢
- **需要联网：** 用 API 需要联网。用本地模型可以离线

---

# 第四部分：本地部署 LLM（极简版）

---

这个地方是为「有显卡、想省钱、愿意折腾」的用户准备的。**大多数人不需要看，直接买 DeepSeek API 就行。**

**你需要：** 12GB+ 显存的 NVIDIA 显卡 + 32GB 内存。

**大概流程：** 下载 llama.cpp → 下载模型文件 → 写启动脚本 → 在软件设置里添加 `http://127.0.0.1:8080`。

**详细教程**太长不适合放 README。联系作者或看项目 `docs/` 目录。

部署好后，在设置里把分析、审查指向本地模型（免费），写作用 API（保质量）。

---

# FAQ

**必须花钱吗？**
不一定。本地模型免费（需 12G+ 显卡）。API 也很便宜——几块钱一本。

**要会编程吗？**
不用。有绿色便携版，解压双击就能用。

**崩溃了怎么办？**
刷新浏览器。数据全在硬盘上，不会丢。

**能同时写几本书？**
能。解锁当前项目 → 锁定另一本。数据完全独立。

**支持什么 AI？**
DeepSeek、OpenAI 兼容接口、本地 llama.cpp。任何兼容 OpenAI Chat Completions API 的服务都支持。

**文风不对？**
在写作台右侧「📦 前置 SKILL」里创建写作规则，保存勾选就生效。

**数据怎么备份？**
复制整个 `projects/` 文件夹就行。

**全自动写作是什么？**
左边栏「🤖 全自动长篇写作」是付费功能。你只需要提供书名和大致方向，AI 自动完成从分析到写作的全流程，输出完整长篇。具体请咨询作者。

---

<br>
<br>

---

# 🇬🇧 English Documentation

---

## Quick Start

### 1. Open the App

**Recommended (no install):** Download `Art-Super-Writer-Portable.zip` → Extract → Double-click `超逸写手启动器.exe` → browser opens at http://127.0.0.1:8899.

> From source: `cd standalone` → `.venv\Scripts\activate` → `pip install flask requests` → Double-click launcher.

### 2. Connect AI (Required)

Sidebar → ⚙️ Settings → Add LLM → Provider: **DeepSeek** → Base URL: `https://api.deepseek.com` → Model: `deepseek-v4-flash` (or `deepseek-v4-pro` for stronger model) → paste API Key (get it from [platform.deepseek.com](https://platform.deepseek.com)) → Mode: **⚡ Slot** → Save → Test.

> **Why Slot?** Caches your content server-side. Same content isn't re-billed.

### 3. Create a Project

**Have existing drafts?**
① 📁 Project Manager → create → name → type → create
② Click project → 📥 Import → select `.txt` / `.md` files
③ 🔒 Lock
④ 🔍 Analyze (wait)
⑤ ✍️ Writer Desk → write your prompt → Send → Finalize
⑥ Re-analyze after each chapter.

**Starting fresh?** Create → lock → Writer Desk directly → analyze after 2-3 chapters.

---

## Feature Overview

| Module | What It Does |
|--------|-------------|
| 📁 **Project Manager** | Create/import/lock projects, AI analysis of ALL chapters |
| ✍️ **Writer Desk** | Write prompts → AI reads full novel → generates chapter → edit → finalize |
| 🌳 **World Tree** | Story structure: main plot, subplots, foreshadowing, world-building |
| 🧠 **Characters** | Personality tags, behavior models, relationships, consistency warnings. Deep analysis available |
| 📊 **Rhythm Console** | Per-chapter engagement, emotional intensity, continuity health |
| 🔍 **Review Room** | S1 mechanical scan + S2 three reviewers (13 dims) + squeeze vote + quality gate |
| 🤖 **Auto Writer** | Full-auto long novel writing (paid feature) |
| 📋 **History Log** | Real-time progress during analysis, full conversation logs after |
| ⚙️ **Settings** | Manage LLM configs, assign different LLMs per role, quality gate thresholds, 13-dimension weights |

---

## Settings Guide

### 1. LLM Configuration

**Add LLM:**

| Field | Description |
|-------|-------------|
| Name | Your label, e.g. "DeepSeek Writing", "Local Analysis" |
| Provider | DeepSeek / OpenAI-compatible / Self-hosted |
| Base URL | `https://api.deepseek.com` for DeepSeek, `http://127.0.0.1:8080/v1` for local |
| Model | `deepseek-v4-flash` (or `deepseek-v4-pro` for stronger). Local models use the GGUF filename |
| API Key | Paste your key. Toggle 👁️ to show/hide. Click 📋 to paste from clipboard |
| Work Mode | **⚡ Slot** (recommended, saves tokens) or **🔵 Stateless** (best compatibility). Unsure? Pick Stateless |

**Manage configs:** Each card shows name, provider, address, model, mode, connection status. You can:
- ☑ **Activate** — new roles use this by default
- 🗑️ **Delete** — remove unused config
- Click to edit

### 2. Per-Role Parameters (🔥 Core Money-Saving Feature)

Assign different LLMs to different tasks:

| Role | What It Does | Recommended |
|------|-------------|------------|
| ✍️ Writer | Writes new chapters | DeepSeek API (quality) |
| 🔍 Analysis | Analyzes all chapters, generates World Tree/Characters/Rhythm | Local LLM (free, slower) or API |
| 🔴 Strict / 🟡 Balanced / 🟢 Lenient | Three reviewers (13 dims each) | Local LLM (free) or API |
| 🗳️ Voter | Breaks ties when reviewers disagree | Local LLM (free) or API |
| 📚 Skill Learner | AI auto-learns writing tips from your novel | Local LLM (free) or API |

Each role can select any saved LLM config and set its own temperature.

> **Best combo:** Writer → API (quality). Analysis + Reviews + Vote + Learning → local LLM (all free).

### 3. Quality Gate

Controls review pass/fail logic:

| Setting | What It Does | Default |
|---------|-------------|---------|
| Pass threshold | ≥ this score = auto pass | 75 |
| Revise threshold | ≥ this score = revise | 50 |
| Max revision rounds | How many auto-revision cycles | 3 |
| Min dimension score | Below this = critical flag | 5 |

Logic: ≥ pass → ✅ Pass. ≥ revise → 🔄 Revise (AI auto-fixes). < revise → 👤 Manual review.

### 4. Reviewer Weights

| Reviewer | Default | Meaning |
|----------|---------|---------|
| 🔴 Strict | 1.0 | Strictest, highest weight |
| 🟡 Balanced | 0.7 | Middle ground |
| 🟢 Lenient | 0.4 | Lenient, lowest weight |

### 5. 13-Dimension Weights

All adjustable: Plot(1.5) · Character(1.5) · Dialogue(1.2) · Pacing(1.1) · Style(1.0) · Consistency(1.4) · Emotional Impact(1.2) · Originality(0.9) · Readability(1.0) · AI Detection(1.3) · Character Psychology(1.6) · Social Interaction(1.4) · Exceptional Authenticity(1.3)

> Higher = more important. Defaults are reasonable—usually no need to change.

---

| Step | Do This |
|------|---------|
| ① **Write a prompt** | In the "写作方向" text box, tell AI what this chapter should be about |
| ② **Click Send** | Button says "📤 发送给 LLM" — AI will read all previous chapters, then write |
| ③ **View result** | Read AI output in the result box, edit directly |
| ④ **Finalize** | Click "📌 定稿" to save as an official chapter |

---

## Three "Analyze" Buttons

| Where | What It Analyzes |
|-------|-----------------|
| Project Manager (🔍 Analyze) | ALL chapters → updates World Tree/Characters/Rhythm |
| Writer Desk (🔍 Analyze Chapter) | Current chapter ONLY |
| Character Pool (🔍 Analyze) | Specific character in-depth |

---

## Review Room

When you're unhappy after finalization: select chapter → review → wait for AI → read suggestions → edit in the review editor.

> **Warning:** Don't edit before analysis completes. The "apply" button may have bugs — manually edit based on suggestions.

---

## LLM Tips

- **Best:** Use DeepSeek API for everything. Cheap (~$0.50/novel), excellent quality.
- **Budget (with GPU):** API for writing, local model for analysis/review.
- **Local models are SLOWER** for analysis. If too slow, switch back to API.

---

## FAQ

**Free?** Local LLM = free (needs 12GB+ GPU). API = ~$0.50/novel.

**Coding?** No. Portable ZIP = extract and run.

**Crash?** Refresh browser. Data on disk, nothing lost.

**Multiple books?** Yes. Unlock → lock another.

**Backup?** Copy the `projects/` folder.

**What is Auto Writer?**
The "🤖 Auto Writer" button in the sidebar is a paid feature. Provide a book title and general direction, and the AI handles everything—from analysis to writing a complete long novel. Currently a placeholder page. Contact the author for details.

---

<br>
<div align="center">

**🖋️ 写好书，用好工具。**

[GitHub](https://github.com/Rambolv/Art-Super-Writer) · [提 Issue](https://github.com/Rambolv/Art-Super-Writer/issues)

</div>
