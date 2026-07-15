<div align="center">

# 🖋️ 超逸写手 · Art Super Writer

**你的私人 AI 编辑团队。读完你的小说，再帮你接着写。**

*Your private AI editorial team. Reads your novel, then writes with you.*

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

# 第三部分：注意事项

---

<a id="七关于-llm-的选择"></a>

## 七、关于 LLM 的选择

### 最推荐：全部用 DeepSeek API

- 便宜：**几块钱写一本书**
- 效果好：云端大模型写作质量远好于本地小模型
- 省心：注册 → 复制 Key → 粘贴 → 搞定

### 如果你想省钱（有显卡）

设置里可以把不同任务指定不同的 AI：

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

<a id="八重要提示"></a>

## 八、重要提示

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

## Writer Desk Workflow

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

---

<br>
<div align="center">

**🖋️ 写好书，用好工具。**

[GitHub](https://github.com/Rambolv/Art-Super-Writer) · [提 Issue](https://github.com/Rambolv/Art-Super-Writer/issues)

</div>
