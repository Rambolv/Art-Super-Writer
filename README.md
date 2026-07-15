<div align="center">

# 🖋️ 超逸写手 · Art Super Writer

**你的私人 AI 编辑团队。读完你的小说，再帮你接着写。**

*Your private AI editorial team. Reads your novel, then writes with you.*

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

> 💬 **先说明三件事：**
> 1. 如果你不知道怎么部署本地模型，可以联系作者付费咨询。
> 2. 但说实话——大部分用户不需要折腾。买 DeepSeek API 就行，几块钱写一本书。用 API 的效果比本地模型好得多。
> 3. 省钱又有显卡的用户，可以把**分析和审查用本地 LLM（免费），写作才用 API（花几块钱）**——设置里允许每个功能单独指定不同的 LLM。
>
> *Three things up front: (1) Paid consultation available for local LLM deployment. (2) Most users should just buy DeepSeek API—it costs pocket change and outperforms local models. (3) Budget + GPU users can mix: analysis/review on local LLM (free), writing on API (pennies)—settings allow independent LLM assignment per role.*

<br>

👉 **[🇨🇳 点这里看中文](#cn) &nbsp;&nbsp;·&nbsp;&nbsp; [🇬🇧 Click here for English](#en)** 👈

---

<a id="cn"></a>

# 🇨🇳 中文文档

---

## 一、这到底是个什么东西

你用过 AI 写小说吗？打开 DeepSeek 网页，说「帮我写一章」，AI 给你一段，写得还行。

然后你写第二章。AI 忘了第一章的角色和情节。你只好把前文全部复制粘贴进去，它还是忘。角色开始乱来，前面死了的人突然活了。

**超逸写手解决的就是这个问题。**

它的逻辑很简单：**写每一章之前，先把你的全部小说发给 AI 通读一遍。** AI 读懂了整个故事，才动笔写新章节。这样写出来的东西跟前文不矛盾。

除此之外它还附带几件事：
- 🧠 读完帮你**分析故事结构**——主线走到哪了、支线进度、伏笔收没收
- 🔍 写完帮你**审稿**——三个 AI 审稿官从 13 个维度打分
- 📊 **跟踪节奏**——哪章吸引人、哪章读者可能弃书
- 💾 **自动记住一切**——角色性格、关系、位置，写新章时自动告诉 AI

---

## 二、好在哪，不好在哪

### 👍 优势

| 你之前的问题 | 用这个之后 |
|------------|----------|
| 每次写新章都要复制粘贴前文 | 不用——AI 自动读完你的全部章节 |
| 角色前后矛盾 | 角色档案自动注入提示词 |
| 不知道写得好不好 | 三个 AI 审稿官给分 + 具体修改建议 |
| 故事结构失控 | 世界树帮你盯着 |
| Token 费用高 | Slot 模式下全文预热一次，后续几乎零增量 |

### 👎 劣势（诚实说）

| 问题 | 实话 |
|------|------|
| 要装 Python | 10 分钟，跟着教程敲几行命令 |
| 要 API Key | DeepSeek 注册一下就有。写一本书最多几块钱 |
| 本地模型写作质量不如 API | 免费但 7B/14B 模型的创造力、细腻度远不如云端大模型 |
| 不是全自动写书机 | 你需要构思剧情、编辑 AI 生成的内容 |

### 花钱还是不花钱

| | 本地跑模型 | 买 API |
|--|----------|--------|
| 💰 | 免费（电费忽略） | 几块钱/本书 |
| 📝 写作质量 | ⚠️ 一般 | ✅ 好 |
| 🔧 上手 | 需要 12G+ 显卡和配置 | 注册→复制 Key，5 分钟 |
| 🏠 隐私 | ✅ 不出电脑 | 发给云端 |

> **建议：** 想省心直接买 API。有显卡且想省的——**分析用本地、写作用 API**，两全其美。设置里可以给写作和分析分别指定不同的 LLM。

---

## 三、30 秒上手

### ① 装 Python

去 [python.org](https://python.org/downloads) 下载 Python 3.10+，安装时**勾选 Add to PATH**。

### ② 装依赖

下载项目（GitHub 点 Code → Download ZIP），解压，打开命令行：

```bash
cd 你解压的文件夹\standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
```

> 国内慢就加镜像：`pip install flask requests -i https://pypi.tuna.tsinghua.edu.cn/simple`

### ③ 启动

双击 **`超逸写手启动器.exe`**（图形界面，勾选需要的 → 点「🚀 一键启动」）。

浏览器打开 **http://127.0.0.1:8899**。

### ④ 连上 AI

**方案 A：买 API（推荐）**

1. 打开 [platform.deepseek.com](https://platform.deepseek.com) 注册 → API Keys → 创建 → 复制 `sk-...`
2. 软件左边栏 ⚙️ 设置 → 添加 LLM 配置 → 供应商 DeepSeek → 模型 `deepseek-chat` → 粘贴 Key → **工作模式选 ⚡ Slot** → 保存 → 测试连接 → ✅

> **为什么选 Slot？** `cache_prompt` 让服务端缓存提示词——重复内容不重复计费。DeepSeek 支持这个（通过 `prompt_cache_hit_tokens` 返回缓存命中）。Stateless 兼容性最好但每次全量处理，Token 多。不确定就 Stateless。

**方案 B：本地 LLM（免费，需要显卡）**

见 [第七节：省钱方案](#七省钱方案本地跑模型需要显卡)。

---

## 四、两种方式开始你的第一本书

### A. 你已经有写好的稿子

**① 建项目** → 📁 项目管理 → 输入书名 → 选类型 → 创建

**② 导入** → 点项目 → 📥 导入章节文件 → 选 `.txt/.md`

**③ 锁住** → 点 🔒 锁定

**④ AI 分析** → 点 🔍 分析（别刷新页面）：
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

创建 → 锁定 → 直接去写作台写第一章。写 2-3 章后回来分析。

---

## 五、写作台——最核心的页面

```
┌─────────────────────────────┬───────────────────┐
│ 章节号：[3]                  │ 📦 前置 SKILL      │
│ 写作方向：[大文本框]          │ ☑ 对话规则          │
│ 温度：0.8 [========]         │ ☑ 描写风格          │
│ 目标字数：[3000]             │ [✏️新建][📥导入]    │
│ [💾 保存]  [📤 发送给LLM]    │                   │
├─────────────────────────────┤ 📋 写作上下文       │
│ 📝 生成结果                  │ (自动注入的数据)     │
│ [🔄重新生成][📌定稿][🔍分析] │                   │
│ [AI 内容逐字出现在这里]       │ 📖 行为规律参考     │
└─────────────────────────────┴───────────────────┘
```

### 写作方向——最重要的输入框

你在这告诉 AI 这章写什么。**越具体越好。**

✅ 好的：「主角潜入古城发现密道，尽头是一个封印的石室，里面封存着三百年前的秘密。追兵赶到，他被迫进入石室。要求：悬疑氛围要足，环境描写烘托紧张感，石室内容留悬念不一次写完。」

❌ 差的：「写第三章」

### 温度

滑动条 0.1~1.5。越低越稳定保守，越高越有创意但可能跑偏。新手 0.8。

### 字数

默认 3000。AI 写超过 5000 容易啰嗦。

### 💾 保存提示词

写作方向存到磁盘。切换章节再切回来方向还在。**养成写完就保存的习惯。**

### 📤 发送给 LLM——开始写

点下后的完整流程：

| 步骤 | 内容 | 耗时 |
|------|------|------|
| ① 探测 | 问 AI 上下文能力 | 1-2 秒 |
| ② 压缩 | 稿子太长→自动压缩旧章节为摘要 | 几秒~几十秒 |
| ③ **分批阅读** | **把你全部章节切成块，一块块发给 AI 读完** | 10 秒~几分钟 |
| ④ 注入 | 世界树+角色+节奏+SKILL+行为规律打包进提示词 | 瞬间 |
| ⑤ 生成 | AI 流式写新章节，逐字显示 | 30 秒~几分钟 |

**第③步是关键。** AI 只有读完你全部前文才知道完整故事，写出来的新章才不会跟前面矛盾。稿子越长越久，耐心等——可以去 📋 历史日志看实时进度。

### 🔄 重新生成

不满意就重来。**上一版不保留**，先复制喜欢的部分。

### 📌 定稿

正式保存为章节。**已定稿的章节再点定稿会弹确认框**——防止误覆盖。

### 🔍 分析本章

单独分析刚写的这一章——评分、优点、不足、改进建议。只看本章不看全文。

### 右侧面板

**📦 前置 SKILL：** 你写给 AI 的写作规则。比如：
```
标题：对话规则
内容：对话简短，一人一次≤三句。用动作带说话人，不用"说道"。
```
保存勾选就生效。支持从文件导入（`.txt .md .docx .xlsx .json`）。

**📋 写作上下文：** 分析后自动生成的世界树 + 角色 + 节奏数据——AI 写时会自动参考你不需要管。

**📖 行为规律：** 预设的行为心理学原则（如损失厌恶、信任博弈等），AI 参考以让角色行为更真实。

---

## 六、其他页面

### 🔍 审查室

写完来这审稿。选章节 → 审查：

```
S1 机械闸（19 条规则扫描）
  → 标点/句式/段落/连续性检查

S2 三审官（13 维度评分）
  → 🔴严审(温0.3) 🟡衡审(温0.3) 🟢宽审(温0.4)

🗳️ 夹逼投票 → 🚪 质量门禁
  → ≥75 通过 | 50~74 修订 | <50 人工
```

修改建议以卡片显示。点卡片自动定位原文。支持 Ctrl+Z 撤销。

### 🌳 世界树 · 🧠 角色池 · 📊 节奏控制台

这三页顶部都有**版本选择器**——每次分析一个版本，可以切换对比。

| 页面 | 数据 |
|------|------|
| 🌳 世界树 | 主线节点·支线进度·伏笔排序·世界观 |
| 🧠 角色池 | 性格标签·行为模型·关系网·一致性警告 |
| 📊 节奏控制台 | 每章吸引力·情感浓度·连续性健康 |

角色池右侧面板可写**自定义分析提示词**（针对特定角色深度分析）。

### 📋 历史日志

分析进行中打开可看实时进度。分析完也可回看每次的完整对话记录。

### ⚙️ 设置——关键

**工作模式：** ⚡ Slot（推荐）vs 🔵 Stateless。Slot 下 `cache_prompt` 让重复内容不重复计费——DeepSeek 和 llama.cpp 都支持。Stateless 兼容最好但 Token 用得多。不确定时选 Stateless。

**🔥 独立指定 LLM——最重要的省钱功能。** 每个功能可以分别指定不同的 LLM：

| 角色 | 推荐策略 |
|------|---------|
| ✍️ 写作 | API（DeepSeek，质量第一） |
| 🔍 分析 | 本地 LLM 或 API |
| 🔴 严审 | 本地 LLM 或 API |
| 🟡 衡审 | 本地 LLM 或 API |
| 🟢 宽审 | 本地 LLM 或 API |
| 🗳️ 投票 | 本地 LLM 或 API |
| 📚 技能学习 | 本地 LLM 或 API |

> **最佳省钱组合：** 写作→DeepSeek API（保质量），分析+审查+投票→本地 LLM（免费）。设置里把每个角色的 LLM 分别选好就行。

**质量门禁：** 审查时 ≥75 通过，50~74 修订，<50 人工。最多自动修订 3 轮。

---

## 七、省钱方案：本地跑模型（需要显卡）

这套方案的核心是 **Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive**——一个 350 亿参数的 MoE（混合专家）无审查越狱版模型。

### 为什么 12G 显存就能跑 35B 模型？

MoE 架构的核心：总参数 350 亿，但每次推理只激活 30 亿。相当于请了 100 个专家但每次只叫 3 个干活。

优化策略：

- **注意力层（轻量）→ GPU：** 99 层弹性注意力参数量小，量化后几乎不占显存
- **MoE 专家层（重量）→ CPU：** `--n-cpu-moe 999` 把全部专家权重放在 CPU 内存，GPU 只算注意力。显存从 Q4 量化后的 ~20GB 直降到 ~6GB
- **双重量化：** 模型权重 Q4_K_M + KV 缓存 Q4_0。26 万 Token 缓存从 10GB+ 压到 2-3GB
- **总占用 ~5.5GB 显存，推理 50-60 token/秒**

### 硬件要求

- NVIDIA 显卡 **12GB+ 显存**
- CPU **8 物理核以上，支持 AVX2**
- **32GB+ DDR4 内存**（双通道或 DDR5 更好）
- 速度受限于 CPU 内存带宽

### 部署步骤

1. 下载 [llama.cpp](https://github.com/ggerganov/llama.cpp/releases) Windows CUDA 版 → 解压到 `LLM/bin/`
2. 下载 **Qwen3.6-35B-A3B GGUF 格式模型** → 放到 `LLM/models/`
3. 在 `LLM/` 创建 `start.bat`：

```bat
@echo off
title Qwen3.6-35B-A3B 越狱版+多模态模型 显存优化版

cd /d "%~dp0"
taskkill /f /im llama-server.exe >nul 2>nul

:menu
cls
echo ==========================================
echo      Qwen3.6-35B-A3B 越狱版+多模态模型
echo               显存优化版
echo ==========================================
echo.
echo 1. Q4_K_P（21.8G，4090 推荐）
echo 2. Q4_K_M（19.7G，稳定版）
echo 3. IQ4_NL（18.4G，高压缩高质量）
echo 4. IQ2_M（10.9G，低显存 131K 上下文）
echo.
echo ==========================================
set /p choice=请输入数字：

if "%choice%"=="1" (
    bin\llama-server.exe ^
    -m "models\Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-Q4_K_P.gguf" ^
    --mmproj "models\mmproj-Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-f16.gguf" ^
    -ngl 99 ^
    --n-cpu-moe 999 ^
    --flash-attn on ^
    --jinja ^
    --reasoning off ^
    -c 260000 ^
    -t 12 ^
    -b 1024 ^
    -ub 512 ^
    --cache-type-k q4_0 ^
    --cache-type-v q4_0 ^
    --mlock ^
    --host 127.0.0.1 ^
    --port 8080
    goto :eof
)
```

| 参数 | 解释 |
|------|------|
| `-m` | 模型文件路径。Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive，越狱无审查版 |
| `--mmproj` | 多模态投影文件——让模型支持图像输入 |
| `-ngl 99` | GPU 层数。99 = 注意力层全部放 GPU（量化后占显存极少） |
| `--n-cpu-moe 999` | **核心魔术。** MoE 专家层全部放 CPU 内存——350 亿专家参数不走 GPU。12G 卡跑 35B 模型的根本原因 |
| `--flash-attn on` | Flash Attention——O(n) 内存替代 O(n²)，省显存且加速 |
| `--jinja` | Jinja 模板引擎——结构化聊天模板和 function calling 支持 |
| `--reasoning off` | 禁用推理模式——隐藏思考 Token 占上下文，写小说不需要 |
| `-c 260000` | 上下文窗口 260K（4090）。小显存用 131072 |
| `-t 12` | CPU 推理线程——按物理核心数设 |
| `-b 1024 / -ub 512` | 批处理大小和微批大小 |
| `--cache-type-k q4_0` | **KV 缓存 Key 量化到 4-bit。** 260K 上下文不带量化：10GB+；带量化：2-3GB |
| `--cache-type-v q4_0` | KV 缓存 Value 量化，同上 |
| `--mlock` | mlock() 物理锁内存，禁止 OS swap——保证推理速度不因换页骤降 |

> 菜单中有 4 种量化可选：Q4_K_P（最均衡，21.8G）、Q4_K_M（稳定版，19.7G）、IQ4_NL（高压缩高质，18.4G）、IQ2_M（极致压缩，10.9G，适合低显存设备）。选哪个按你显存大小来。

4. 在软件设置里添加 LLM：供应商选自托管，地址 `http://127.0.0.1:8080`，模式 ⚡ Slot
5. 分角色参数里，写作指向 API（保质量），分析/审查/投票指向这个本地 LLM（省钱）→ 保存

---

## 八、搞懂几个概念

### Slot 为什么省钱

跟编辑开会。第一次你一章一章给他看，他记住。第二次你带新的一章——不用重印旧的，他记得。

Slot 模式同理。AI 第一次读完你全文，服务端保留 KV 缓存。后续请求只算新增内容。Stateless 则每次都重算全部——即使内容一模一样。**DeepSeek 也支持**（通过 `prompt_cache`），所以给它也选 Slot。

### 模糊记忆

稿子太长超过 AI 容量？系统自动压缩旧章节为摘要——AI 仍知整体情节，只丢细节。压缩文件在 `fuzzyMemory/`。

### 分析版本

每次分析生成一个新版本（v1/v2/v3...），世界树/角色池/节奏页都有版本选择器可对比。

### SKILL 自动学习

除了你手动创建的 SKILL，AI 还**自动从你的小说里学**——每次分析完成后总结优点和不足，保存到 `skills/self/`。下次写作用。

---

## 九、文件存在哪里

```
projects/你的小说/
├── chapters/          ← 正式章节(.md) + 写作方向(.json)
├── drafts/            ← 草稿(自动保存)
├── config/            ← 配置
├── projectLog/v{N}/   ← 每次分析的完整记录
│   ├── 分析报告_第1~5轮.md       ← 每轮对话原文
│   └── writer_prompt_第001章.json ← 发给AI的完整提示词
├── worldTreeData/     ← 世界树
├── characterProfiles/   ← 角色档案
├── tensionReports/    ← 节奏数据
├── reviews/           ← 审查记录
├── fuzzyMemory/       ← 长文压缩摘要
├── skills/external/   ← 你的SKILL → 写作注入
├── skills/self/       ← AI自动学习 → 分析后生成
└── story_state.json   ← 故事快照
```

---

## 十、你可能想问

**Q: 必须花钱吗？**
A: 不一定。本地 LLM 完全免费（需 12G+ 显卡）。买 API 也很便宜——几块钱一本。最佳方案：写作用 API（保质量），分析/审查用本地（省钱）。

**Q: 要编程吗？**
A: 不用。按教程敲几行命令。一次装完以后双击启动器就行。

**Q: 文风不对？**
A: 📦 前置 SKILL 创建写作规则。保存勾选。

**Q: 切换页面会丢内容？**
A: 不会。自动存草稿。

**Q: 崩溃了？**
A: 刷新。数据在硬盘上。

**Q: 能同时写几本？**
A: 能。解锁→锁另一本。数据独立。

**Q: 支持什么 AI？**
A: DeepSeek、OpenAI 兼容、本地 llama.cpp。

**Q: Slot 还是 Stateless？**
A: Slot。DeepSeek 和 llama.cpp 都支持。连不上再换 Stateless。

**Q: 分批阅读是什么？**
A: 稿子长 AI 一次读不完。系统切成块，一块块发。读完再写。新章跟前文不矛盾。

---

<br>
<br>

<a id="en"></a>

# 🇬🇧 English Documentation

---

## 1. What Is This?

You've used AI to write. You tell it to write a chapter—it does, decently. Then you write Chapter 2. AI forgot Chapter 1. Characters shift. Dead people return. You copy-paste old chapters, still doesn't work.

**This solves that.**

Before writing each chapter, the AI reads your **entire novel** first. Then it writes. No contradictions. No forgotten plot.

Plus: story structure analysis, triple-AI review on 13 dimensions, pacing tracking, character memory.

---

## 2. Good & Bad

### 👍 Good

- Auto batch-reads all chapters before writing
- Character profiles auto-inject into prompts
- Triple AI review with scores and suggestions
- World Tree tracks story structure
- Slot mode saves tokens—context warmed once

### 👎 Bad

- Need Python (10 min install)
- API costs money (but ~$0.50/novel is dirt cheap)
- Local LLM quality trails cloud models
- Not a one-click generator—you still plan and edit

### API vs Local

| | Local | API |
|--|-------|-----|
| 💰 | Free | ~$0.50/novel |
| 📝 | ⚠️ Okay | ✅ Excellent |
| 🔧 | GPU + config | Sign up → copy key |
| 🏠 | ✅ Local | Cloud |

**Recommendation:** Most users → buy API. Budget + GPU → mix: local for analysis/review, API for writing. Settings allow independent LLM per role.

---

## 3. Quick Start

**Install Python** 3.10+ ([python.org](https://python.org), check Add to PATH).

```bash
cd standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
```

**Launch:** Double-click `超逸写手启动器.exe` → browser at `http://127.0.0.1:8899`.

**Connect AI:** [platform.deepseek.com](https://platform.deepseek.com) → API Key → Settings → add LLM → DeepSeek → `deepseek-chat` → paste key → mode ⚡ Slot → test.

---

## 4. Your First Novel

**Existing draft:** Create → import → lock → Analyze → World Tree/Characters/Rhythm → Writer.

**New novel:** Create → lock → Writer directly → analyze after 2-3 chapters.

---

## 5. Writer Desk

**Direction:** Most important field. Be specific—key events, character interactions, atmosphere, requirements.

**Tempera-ture:** 0.1 (stable) to 1.5 (creative). New user: 0.8.

**Send pipeline:** Probe → compress (if long) → batch-read all chapters → inject context (World Tree + Characters + Rhythm + SKILLs) → generate.

**Buttons:** Save Direction | Send (full pipeline) | Regenerate (retry) | Finalize (confirm dialog prevents overwrite) | Analyze Chapter (grade this chapter only).

**SKILLs:** Writing rules AI follows. Import: `.txt .md .docx .xlsx .json`.

---

## 6. Other Pages

**Review Room:** S1 mechanical scan → S2 3 reviewers (13 dims) → squeeze vote → quality gate (pass≥75, revise≥50, manual<50). Click suggestion cards to apply.

**World Tree / Characters / Rhythm:** All have version selectors for comparing analyses.

**Settings:** Critical—**independent LLM assignment per role.** Best combo: Writer → API (quality), Analysis + Review → local LLM (free).

---

## 7. Local LLM Setup

Model: **Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive**—35B MoE, 3B active, multimodal, uncensored.

**How 12GB runs 35B:** `--n-cpu-moe 999` puts MoE experts in CPU RAM, GPU handles attention only. Dual quantization (Q4_K_M weights + Q4_0 KV cache). 260K context cache: 10GB+ → 2-3GB. ~5.5GB total VRAM, 50-60 tok/s.

**Requirements:** 12GB+ GPU, 8+ CPU cores (AVX2), 32GB+ DDR4.

**start.bat menu:** 4 quant options—Q4_K_P (21.8G, 4090), Q4_K_M (19.7G, stable), IQ4_NL (18.4G, high-compression), IQ2_M (10.9G, low-VRAM).

**Settings:** Provider = Self-hosted, `http://127.0.0.1:8080`, mode = Slot.

---

## 8. Concepts

**Slot mode:** KV cache retained server-side—subsequent requests process only new content. DeepSeek also supports this via `prompt_cache`.

**Fuzzy memory:** Auto-compresses old chapters into summaries if text exceeds AI capacity.

**Version selector:** Each analysis = new version. Switch on World Tree/Characters/Rhythm pages.

**SKILL auto-learning:** AI generates writing tips from your novel after each analysis.

---

## 9. Folder Structure

```
projects/YourNovel/
├── chapters/          ← Final .md + directions .json
├── drafts/            ← Auto-saved
├── projectLog/v{N}/   ← Analysis logs per version
├── worldTreeData/     ← World tree
├── characterProfiles/   ← Characters
├── tensionReports/    ← Rhythm
├── reviews/           ← Reviews
├── fuzzyMemory/       ← Compression
├── skills/external/   ← Your SKILLs
├── skills/self/       ← AI auto-learned
└── story_state.json   ← Snapshot
```

---

## 10. FAQ

**Q: Free?** Local LLM = free (12GB+ GPU). API = ~$0.50/novel. Best: mix—local for analysis, API for writing.

**Q: Coding?** No. Copy-paste commands once.

**Q: Style mismatch?** SKILL rules in Writer sidebar.

**Q: Lose work?** No. Auto-saved drafts.

**Q: Crash?** Refresh. Data on disk.

**Q: Multiple books?** Yes. Unlock → lock another.

**Q: Models?** DeepSeek, OpenAI-compatible, local llama.cpp.

**Q: Slot or Stateless?** Slot. Works with both DeepSeek and llama.cpp.

---

# 📄 License

MIT © 2026 Rambolv
