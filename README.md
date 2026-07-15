<div align="center">

# 🖋️ 超逸写手 · Art Super Writer

**你的 AI 编辑团队。读完你的小说，再帮你接着写。**

*Your AI editorial team. Reads your novel first, then writes with you.*

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

> 💬 **先说一句：** 如果你不知道怎么部署本地模型，可以联系作者付费咨询。但说实话——大多数用户不需要折腾，买 DeepSeek API 就行，几块钱写一本书，省心省力。
>
> *If you need help deploying a local LLM, paid consultation is available. But honestly, most users should just buy a DeepSeek API key — it costs pocket change for an entire novel.*

<br>

**👉 [🇨🇳 点这里看中文](#cn) &nbsp;&nbsp;·&nbsp;&nbsp; [🇬🇧 Click here for English](#en) 👈**

---

<a id="cn"></a>

# 🇨🇳 中文文档

---

## 一、先说清楚，这到底是个什么东西

你用过 AI 写小说吗？打开 DeepSeek 网页，说「帮我写一章」，AI 啪一下给你一段。写得还行。然后你想写第二章，发现 AI 忘了第一章的内容。你只好把前文复制粘贴进去。AI 还是忘了。角色开始乱来。前面死掉的人突然活了。

**超逸写手解决的就是这个问题。**

它的逻辑很简单：**写每一章之前，先把你的全部小说发给 AI 读一遍。AI 读懂了整个故事，才动笔写新章节。** 这样写出来的东西，跟前面不矛盾。

它还附带几个额外能力：
- 🧠 读完之后帮你**分析故事结构**——主线走到哪了、支线在干嘛、埋的伏笔收了没
- 🔍 写完之后帮你**审稿**——三个 AI 审稿官给你从 13 个维度打分
- 📊 **跟踪节奏**——哪章吸引人、哪章读者可能弃书
- 💾 **自动记住一切**——角色性格、关系、位置，写新章时自动告诉 AI

---

## 二、它好在哪，不好在哪

### 👍 好的

| 你之前遇到的问题 | 用这个之后 |
|-----------------|-----------|
| 每次写新章都要复制粘贴前文给 AI | 不用了。AI 自动读完你的全文 |
| AI 写的角色前后矛盾 | 角色档案会自动注入到提示词里 |
| 写完不知道好不好 | 三个 AI 审稿官给分+建议 |
| 写到后面故事结构乱了 | 世界树帮你看着 |
| Token 费用高 | Slot 模式下全文只预热一次，后续几乎零增量 |

### 👎 不好的

| 问题 | 实话 |
|------|------|
| 你得装 Python | 花 10 分钟，按教程做就行 |
| 你得有个 API Key | 去 DeepSeek 注册一下，几块钱写一本书。不花钱的方案也有，往下看。 |
| 它不是点一下自动写一本书 | 你需要构思剧情、编辑 AI 写的内容。它是帮手，不是替身。 |

### 花钱还是不花钱

| | 本地跑模型 | 买 API |
|--|----------|--------|
| 💰 | 免费（电费忽略不计） | 几块钱一本书 |
| 📝 写作质量 | ⚠️ 一般——7B/14B 模型创造力和细腻度明显不如大模型 | ✅ 好——DeepSeek 是目前中文写作最强的之一 |
| 🔧 上手 | 需要 8G 以上 NVIDIA 显卡，要配置 | 注册→复制 Key→粘贴，5 分钟 |
| 🏠 隐私 | 你的小说不出电脑 | 内容发给云端 API |

> **一句话建议：** 想省心就买 API。想省钱且有显卡的就本地跑。想省钱又没显卡的——还是买 API，几块钱真不贵。

---

## 三、30 秒搞定，开始用

### 第 1 步：装个东西

去 [python.org](https://python.org/downloads) 下载 Python 3.10 以上版本。安装的时候**一定要勾 "Add Python to PATH"** 那个框。别的不用管，一路下一步。

### 第 2 步：敲几行字

下载这个项目（GitHub 上点绿色的 Code → Download ZIP），解压。然后打开命令行（按 Win+R，输入 cmd，回车），敲：

```bash
cd 你解压的文件夹\standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
```

> 如果下载慢，加一个国内镜像：`pip install flask requests -i https://pypi.tuna.tsinghua.edu.cn/simple`

### 第 3 步：启动

双击 **`超逸写手启动器.exe`**——会弹出一个漂亮的小窗口，勾上你要启动的，点「🚀 一键启动」。

浏览器打开 **http://127.0.0.1:8899**，你就看到界面了。

### 第 4 步：连上 AI

**选 A：买 API（推荐大部分人）**

1. 打开 [platform.deepseek.com](https://platform.deepseek.com)，注册。左边菜单找 **API Keys**，创建一个，复制那串 `sk-` 开头的东西。
2. 回到软件，点左边栏 ⚙️ 设置。添加 LLM 配置：供应商选 DeepSeek，模型填 `deepseek-chat`，粘贴你的 Key。
3. **工作模式选 ⚡ Slot**。别问为什么，选就对了——这个模式让 AI 记住之前算过的东西不重复算，能省钱。不确定的话选 Stateless 也行，兼容性最好。
4. 保存 → 测试连接 → 看到 ✅ 就是成了。

**选 B：用你自己电脑跑（免费，需显卡）**

往下翻到「省钱方案：本地跑模型」。

---

## 四、写你的第一本书

### 如果你已经有写好的稿子

**① 建个项目**

左边栏点 📁 项目管理 → 输入书名（比如「我的第一本书」）→ 选类型 → 点创建。

**② 把稿子导进来**

点你刚建的项目 → 找到「导入章节文件」→ 选你电脑上的 `.txt` 或 `.md` 文件 → 导入。

**③ 锁住它**

点右边的 🔒 锁定按钮。锁住之后，写作台、审查室这些功能都知道你要操作的是这本书。

**④ 让 AI 读一遍**

点 🔍 分析。不要刷新页面，等着就行。AI 会干这些事：

1. 先问你「你最多能读多少字？」
2. 把你的稿子切成几块，一块一块发给 AI 读（AI 读完一块回复「已读」）
3. 读完之后，AI 从 5 个角度分析：阅读体验怎么样、故事结构好不好、角色有没有问题、节奏对不对、写作有什么优缺点
4. 最后把所有分析结果整理成一份数据

这个过程叫「分析」。分析完之后，你就有三样东西：世界树（故事结构图）、角色池（人物档案）、节奏控制台（每章评分）。

**⑤ 开始写新章节**

点 ✍️ 写作台。上面有一个大文本框——这就是你告诉 AI「这一章要写什么」的地方。填好点发送，AI 就开始写了。

### 如果你要写一本全新的书

建项目 → 锁住 → 直接去写作台开始写第一章。等写了两三章之后，再回来点分析。

---

## 五、写作台怎么用——每个按钮说清楚

写作台长这样：

```
┌─────────────────────────────┬───────────────────┐
│ 章节号：3                    │ 📦 前置 SKILL      │
│ 写作方向：[大文本框]          │ (你写的写作规则)     │
│ 温度：0.8 [滑动条]           │                   │
│ 字数：3000  [💾] [📤发送]    │ 📋 写作上下文       │
├─────────────────────────────┤ (自动注入的数据)     │
│ 📝 生成结果：               │                   │
│ [🔄重新生成][📌定稿][🔍分析] │                   │
│ [AI 写的内容会一行行出现]     │                   │
└─────────────────────────────┴───────────────────┘
```

### 写作方向——最重要的一栏

这里你告诉 AI 这一章要写什么。**越具体越好**。

✅ 好的写法：「主角潜入古城后发现密道。密道尽头有一个被封印的石室，里面封存着三百年前的秘密。此时追兵赶到，他被迫进入石室。要求：悬疑氛围要足，用环境描写烘托紧张感。石室里的东西不要一次写清楚，留悬念。」

❌ 差的写法：「写第三章」

你可以告诉 AI 的东西包括：这章发生什么事、谁和谁有互动、气氛是紧张还是温馨、有什么特殊要求（别写太长对话、别用某个词、一定要出现什么）。

### 温度——管创意的

一个滑动条，范围 0.1 到 1.5。数字越小 AI 越保守、越稳定。数字越大 AI 越有创意、但也越可能跑偏。新手保持在 0.8 就行，不用动。

### 字数——管长度的

默认 3000 字。如果你想让 AI 写长一点，改大数字。但建议别超过 5000——AI 写长了容易啰嗦。

### 💾 保存提示词

把你写的「写作方向」存到磁盘。下次你切换章节再切回来，方向还在。养成习惯，写完方向就点一下。

### 📤 发送给 LLM——开始写

这是核心按钮。点了之后 AI 干这些事：

1. **探测**——问 AI「你能读多少内容」？（1-2 秒）
2. **压缩**——如果你的稿子太长，AI 读不完，系统会自动把旧内容压缩成摘要（几秒到几十秒）
3. **分批阅读**——把你有史以来写过的所有章节，切成小块，一块一块发给 AI 读。AI 读完一块回一句「已读」。（这是最慢的一步，如果稿子长可能要几分钟。别急，去历史日志看进度。）
4. **注入上下文**——把分析出来的世界树数据、角色档案、节奏数据、你写的 SKILL 规则，全部打包塞进提示词。（瞬间）
5. **开始写**——AI 开始生成小说内容，一个字一个字出现在你屏幕上。

### 🔄 重新生成

不满意？点它重来。上一版的结果不会保留，先复制你喜欢的部分。

### 📌 定稿

确认这章没问题了，点定稿。这章就正式保存了。**如果你已经定稿过这一章，再点定稿会弹出确认框**——防止你不小心覆盖掉。

### 🔍 分析本章

只分析刚写的这一章（不看全文）。给你一个评分——读者吸引力几分、节奏好不好、优点在哪、哪里可以改进。

### 右侧那些东西是干嘛的

**📦 前置 SKILL：** 你写的「写作规则」。比如你写：「对话要简短，一个角色一次不超过三句。用动作带出说话人。」AI 写作的时候就会遵守。你可以创建很多条，勾上的就生效。支持从文件导入（txt、md、word、excel 都行）。

**📋 写作上下文：** 这个是 AI 分析之后自动生成的东西——世界树、角色档案、节奏数据——你不用管它，AI 写作时会自动参考。

**📖 行为规律：** 一套写好的心理学原则（比如「人面对损失时更愿意冒险」「信任一旦被打破需要 10 次合作才能修复」）。AI 写作时会参考，让你的角色行为更真实。

---

## 六、其他页面是干嘛的

### 🔍 审查室——给章节打分

写完一章后，来这里审一下。选章节 → 点审查 → AI 干这些：

- **S1 机械闸：** 用规则扫描——有没有半角标点混进中文了？有没有 AI 最喜欢的那些废话句式？段落是不是全都一样长？
- **S2 三个审查官：** 一个是严格的（🔴），一个是中间的（🟡），一个是宽松的（🟢）。每人从 13 个维度打分——情节逻辑、角色行为、对话自然度、节奏、文笔、一致性、情感冲击……
- **夹逼投票：** 三个审查官的意见汇总，选出一条最好的修改建议。
- **质量门禁：** 总分 ≥75 直接过；50-74 要改；不到 50 你自己看吧。

审完之后，每条修改建议就是一张卡片。点卡片，编辑器自动跳到原文那个位置。你可以点应用让 AI 直接帮你改。编辑器支持 Ctrl+Z 撤销。

### 🌳 世界树——故事结构图

四样东西：
- **主干**（主线走到哪了）——按顺序列出关键事件，标注重要性
- **枝丫**（支线在干嘛）——还有几条支线在跑、跟主线有多大关系
- **芽**（伏笔）——按读者最想知道的迫切程度排序
- **根系**（世界观设定）

顶部有个下拉菜单，可以切换不同分析版本。

### 🧠 角色池——人物档案

每个人物一张卡片。包含：定位（主角/反派/配角）、性格标签、做决定的方式、在意什么、怕什么、和谁亲近和谁冲突、AI 发现的言行矛盾（⚠️ 一致性警告）。

点卡片展开详细内容。右侧可以写自定义分析提示词——比如你想专门分析某个角色的心理变化。

### 📊 节奏控制台——看每章吸引力

显示每章的吸引力评分和情感浓度。还能帮你发现连续性问题——哪个角色好久没出场了、哪条支线太久没推了、哪个伏笔埋了太久忘了收了。

### 📋 历史日志——看 AI 在干嘛

分析进行中的时候，打开这个页面可以看实时进度。分析完了也可以回来看——每次分析的完整对话记录都在这里。

### ⚙️ 设置——调参数的地方

几个重要设置：

**工作模式：** ⚡ Slot（推荐）vs 🔵 Stateless。Slot 模式下服务端会缓存处理过的内容，重复的东西不重复算——省钱。DeepSeek 和 llama.cpp 都支持。Stateless 兼容性最好但每次全量处理，Token 用得多。不确定就选 Stateless。

**分角色参数：** 写作、分析、审查、投票……每个功能可以用不同的 LLM 和温度。温度管 AI 的创意度——写作可以高一点（0.8），审查要低（0.3）。

**质量门禁：** 审查时多少分算过、多少分要改、最多自动改几轮。

---

## 七、省钱方案：本地跑模型（需要显卡）

如果你有一块 8G 以上的 NVIDIA 显卡，可以不花 API 的钱。

### 步骤

1. 从 [llama.cpp 下载页](https://github.com/ggerganov/llama.cpp/releases) 下载 Windows CUDA 版本，解压到 `LLM/bin/`
2. 从 HuggingFace 或 ModelScope 下载 Qwen2.5-7B-Instruct 的 GGUF 格式模型，放到 `LLM/models/`
3. 在 `LLM/` 里创建 `start.bat`：

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
  --cache-type-k q4_0 ^
  --cache-type-v q4_0 ^
  --mlock ^
  --host 127.0.0.1 ^
  --port 8080
pause
```

| 参数 | 干嘛的 |
|------|--------|
| `-m` | 模型文件路径。下载的 `.gguf` 文件放哪就写哪 |
| `-ngl 99` | 放到 GPU 的层数。99 = 全部放 GPU。显存不够就改小，比如 20 |
| `--flash-attn on` | Flash Attention——用分块计算替代全局注意力矩阵，O(n) 内存替代 O(n²)，省显存且加速 |
| `--jinja` | 启用 Jinja 模板引擎。让聊天模板支持 function calling 和结构化输出，提示词格式化更精确 |
| `--reasoning off` | 禁用推理模式。Reasoning 会让模型在输出前先内部推理（生成隐藏的思考 Token），占上下文且写小说不需要 |
| `-c 131072` | 上下文窗口大小（Token 数）。131072 = 128K，大约能装 20~30 万字。4090 24G 可开到 260000 |
| `-t 12` | CPU 推理线程数。设为物理核心数，12 核就写 12 |
| `-b 1024` | 批处理大小——一次并行处理多少 Token。越大越快但越吃内存，1024 是平衡值 |
| `-ub 512` | 微批大小——把 batch 再切分。帮助内存管理，设为 batch 的一半 |
| `--cache-type-k q4_0` | **KV 缓存 Key 量化到 4-bit。这是最核心的显存优化——128K 上下文的 KV 缓存原本约 12~16GB，量化到 Q4_0 后控制在 3~4GB** |
| `--cache-type-v q4_0` | KV 缓存 Value 量化，同上 |
| `--mlock` | 调用 mlock() 系统调用，物理锁死已分配内存，禁止 OS swap 到虚拟内存/硬盘——保证推理速度不因内存换页骤降 |

4. 在软件设置里：供应商选自托管，地址 `http://127.0.0.1:8080`，模式选 ⚡ Slot

> 再次提醒：本地跑不要钱的代价是**写作质量确实不如大模型**。如果你的故事对文笔要求高，还是买 API 吧。

---

## 八、进阶知识：搞懂几个重要概念

### Slot 模式凭什么能省钱？

想象你在跟一个编辑开会。你把小说的前五章打印出来给他看。第一次开会，你一章一章给他，他每看一章都记住。第二次开会，你又拿了新的一章给他——这一次你不用再把前五章重新打印了，他记得。

Slot 模式就是这样。AI 第一次读完你的全文后，服务端把中间计算结果（叫 KV 缓存）保留在内存里。后面你再发新内容，都不用重新算前面的部分——只算新的。这就是为什么 Slot 模式下写多章几乎不增加 Token 费用。

Stateless 模式呢，每次开会都重新打印全部文件——即使内容一模一样。

**DeepSeek 也支持！** 它有一个叫 `prompt_cache` 的机制，和 Slot 效果类似。所以给你的 DeepSeek 配置选 Slot 模式，一样能省钱。

### 模糊记忆——稿子太长怎么办？

AI 有容量上限。如果你的稿子 20 万字，AI 一次读不完。

模糊记忆会自动帮你**压缩旧章节**。比如你的前 10 章，会被压缩成一段摘要："主角张三在古城遇到了女记者李四，两人发现了封印石室的秘密，决定联手调查。目前张三被追兵逼入石室……"

摘要替代原文发给 AI。AI 仍然知道整体的故事情节，虽然会丢失一些细节。

你可以在 `projects/你的小说/fuzzyMemory/` 里看到压缩后的文件。

### 分析版本——每次分析都有存档

每次点「分析」都会生成一个新的版本（v1、v2、v3……）。世界树、角色池、节奏控制台顶部都有版本选择器。你可以对比第一次分析和第三次分析的区别——比如看看你的故事结构有没有变好。

### SKILL 会自动学习

除了你手动创建的 SKILL，AI 还会**自己从你的小说里学东西**。每次分析完成后，AI 会总结你的写作优点和不足，保存到 `skills/self/` 里。下一次写作时，这些也会自动注入到提示词里。

比如 AI 发现你擅长写打斗场景，但对话有点生硬——它会告诉下一次的 AI：「这位作者打斗写得好，对话要注意。」

---

## 九、你的文件都存在哪了

一个项目文件夹长这样：

```
projects/我的第一本书/
│
├── chapters/                 ← 你的正式章节
│   ├── chapter_001.md        ← 第 1 章
│   ├── chapter_002.md        ← 第 2 章
│   └── writer_direction_第001章.json  ← 你保存的写作方向
│
├── drafts/                   ← 草稿（没点定稿的，自动存这）
│
├── projectLog/               ← 每次分析的完整记录
│   └── v1/                   ← 第 1 次分析
│       ├── 分析报告_第1轮_阅读体验.md   ← AI 每轮分析的原文
│       ├── 分析报告_第2轮_故事结构.md
│       ├── 分析报告_第3轮_角色印象.md
│       └── writer_prompt_第001章.json ← 发给 AI 的完整提示词
│
├── worldTreeData/            ← 世界树数据
├── characterProfiles/        ← 角色档案
├── tensionReports/           ← 节奏数据
├── reviews/                  ← 审查记录
├── fuzzyMemory/              ← 长文压缩摘要
│
├── skills/
│   ├── external/             ← 你写的 SKILL
│   └── self/                 ← AI 自己学到的
│
└── story_state.json          ← 故事快照（每个角色在哪、情绪怎么样）
```

---

## 十、你可能想问的

**Q: 必须花钱吗？**
A: 不一定。用本地模型完全免费（需 NVIDIA 8G+ 显卡）。买 API 也很便宜——DeepSeek 写一本几十万字的小说也就几块钱。

**Q: 要会编程吗？**
A: 不用。会复制粘贴命令行就行。如果你连命令都不想敲——找一个会敲的朋友帮你装，装完就再也不用敲了。

**Q: AI 写的风格不是我想要的怎么办？**
A: 写作台右侧 📦 前置 SKILL → 新建。比如写「不要用'他说道''他回答道'，用动作带出说话人。」保存、勾选。下一章 AI 就会遵守。

**Q: 写了半截切到别的页面，内容会丢吗？**
A: 不会。系统自动存草稿。切回来还在。

**Q: 页面崩了、浏览器关了，东西还在吗？**
A: 在的。所有数据都写在硬盘上。刷新就行了。定稿的章节、分析结果、SKILL——都在。

**Q: 能同时写两本书吗？**
A: 能。项目管理里解锁当前的书，锁另一本。两本书的数据完全不混。

**Q: AI 支持哪些？**
A: DeepSeek（推荐）、OpenAI 兼容的 API、本地 llama.cpp。

**Q: Slot 和 Stateless 到底选哪个？**
A: 听我的——选 Slot。DeepSeek 和本地 llama.cpp 都能用 Slot。实在连不上再换 Stateless。

**Q: 分批阅读是什么？**
A: 你写的多了之后，AI 一次读不完你的全文。系统就帮你把全文切成小块，一块一块发给 AI。AI 读完所有块才知道整个故事。读完才动笔写新章节。好处是新章节不会跟前文冲突。

---

<br>
<br>

<a id="en"></a>

# 🇬🇧 English Documentation

---

## 1. What Is This?

You've used AI to write a novel before, right? You open ChatGPT or DeepSeek, say "write a chapter for me," and it spits something out. Decent. Then you write Chapter 2—and the AI forgot Chapter 1. Characters drift. Dead people come back.

**This tool fixes that.**

Before writing each chapter, it auto-feeds your **entire novel** to the AI. The AI reads every word you've ever written, then writes the new chapter. The result: no contradictions, no forgotten plot points.

Plus:
- 🧠 Analyzes your story structure after reading
- 🔍 Three AI reviewers grade each chapter on 13 dimensions
- 📊 Tracks pacing—which chapters grab readers, which lose them
- 💾 Remembers everything—character traits, relationships, locations

---

## 2. Good & Bad

### 👍 The Good

| Old Problem | Solved |
|------------|--------|
| Copy-pasting old chapters to AI each time | Auto batch-reads everything |
| Characters keep changing | Character profiles auto-inject into prompts |
| Can't tell if chapters are good | Triple AI review with scores |
| Story structure gets messy | World Tree tracks everything |
| High API costs | Slot mode—context warmed once, reused |

### 👎 The Bad

| Issue | Honest Answer |
|-------|--------------|
| You need Python | 10 min install, just follow the steps |
| You need an API key | Sign up on DeepSeek. ~$0.50 per novel. Free option also available. |
| Not a one-click book generator | You plan, you edit. It's an assistant. |

### API vs Local LLM

| | Local LLM | API (DeepSeek) |
|--|----------|----------------|
| 💰 | Free | ~$0.50/novel |
| 📝 Quality | ⚠️ Okay—7B/14B models lack nuance | ✅ Excellent |
| 🔧 Setup | GPU + config | Sign up → copy key → done |
| 🏠 Privacy | ✅ Local | Cloud API |

> **Bottom line:** Most users should just buy API. It's dirt cheap and saves hours. If you have a GPU and enjoy tinkering, local is viable.

---

## 3. Quick Start

### Step 1: Install Python

[python.org](https://python.org/downloads) → download 3.10+ → **check "Add Python to PATH"**.

### Step 2: Download & Setup

```bash
cd standalone
python -m venv .venv
.venv\Scripts\activate
pip install flask requests
```

### Step 3: Launch

Double-click **`超逸写手启动器.exe`** (GUI launcher). Choose what to start, click launch.

Open **http://127.0.0.1:8899**.

### Step 4: Connect AI

**Option A: Cloud API (Recommended)**

[platform.deepseek.com](https://platform.deepseek.com) → sign up → API Keys → copy `sk-...`. In app ⚙️ Settings → add LLM → DeepSeek → `deepseek-chat` → paste key → **mode ⚡ Slot** → test.

> Slot mode enables `cache_prompt` server-side—repeated content isn't re-processed. DeepSeek supports this. Stateless has best compatibility but costs more tokens.

**Option B: Local LLM (Free, needs GPU)**

See "Local LLM Setup" below.

---

## 4. Your First Novel

### If You Already Have a Draft

Create project → import `.txt`/`.md` → lock → click Analyze → check World Tree/Character Pool/Rhythm Console → go to Writer and write.

### Starting from Scratch

Create → lock → go to Writer directly. Analyze after 2-3 chapters.

---

## 5. The Writer Desk

**Layout:**
```
┌─────────────────────────┬──────────────────┐
│ Chapter #                │ 📦 SKILLs        │
│ Direction: [big textbox] │ (your writing rules)│
│ Temp: 0.8  Words: 3000   │                  │
│ [💾 Save] [📤 Send]      │ 📋 Context       │
├─────────────────────────┤ (auto-injected)   │
│ Output:                  │                  │
│ [🔄Regenerate][📌Finalize][🔍Analyze]│      │
│ [streaming content box]  │                  │
└─────────────────────────┴──────────────────┘
```

**Direction—most important field.** Be specific:
✅ *"Protagonist infiltrates the ancient city, discovers a sealed chamber. Pursuers arrive, forcing him inside. Requirements: suspenseful atmosphere, environmental tension, leave mystery unresolved."*
❌ *"Write chapter 3"*

**Buttons:**
- 💾 Save Direction: Save to disk
- 📤 Send: Full pipeline—probe → compress → batch-read → inject context → generate
- 🔄 Regenerate: Try again
- 📌 Finalize: Make it official (double-finalize gets a confirmation dialog)
- 🔍 Analyze This Chapter: Grade just this chapter

**Send pipeline details:**
1. Probe AI capacity (1-2s)
2. Compress old text if too long (seconds to tens of seconds)
3. **Batch-read all chapters**—this is the slowest step (10s to minutes)
4. Inject context (instant)
5. Stream generate (30s to minutes)

**Right-side panels:**
- 📦 SKILLs: Writing rules you create. Check = active.
- 📋 Context: World Tree + characters + rhythm auto-injected.
- 📖 Behavioral Principles: Psychology rules for realistic characters.

---

## 6. Other Pages

### 🔍 Review Room

Select chapter → Review. Pipeline: S1 mechanical rules scan → S2 three reviewers (strict/balanced/lenient, 13 dimensions) → squeeze voting → quality gate (pass≥75, revise≥50, manual<50). Suggestions appear as cards—click to apply.

### 🌳 World Tree

Main plot nodes, subplots, unresolved foreshadowing, worldbuilding. Version selector at top.

### 🧠 Character Pool

Per-character profiles: traits, decision style, fears, relationships, consistency warnings. Custom analysis available.

### 📊 Rhythm Console

Per-chapter appeal scores, emotional intensity, continuity health checks.

### 📋 History Log

Real-time analysis progress. Full conversation logs for every analysis run.

---

## 7. Local LLM Setup (Free, Needs GPU)

8GB+ NVIDIA GPU required.

1. Download Windows CUDA build of [llama.cpp](https://github.com/ggerganov/llama.cpp/releases) → extract to `LLM/bin/`
2. Download Qwen2.5-7B-Instruct GGUF → place in `LLM/models/`
3. Create `LLM/start.bat`:

```bat
bin\llama-server.exe ^
  -m "models\your-model.gguf" ^
  -ngl 99 ^
  --flash-attn on ^
  --jinja ^
  --reasoning off ^
  -c 131072 ^
  -t 12 ^
  --cache-type-k q4_0 ^
  --cache-type-v q4_0 ^
  --mlock ^
  --host 127.0.0.1 ^
  --port 8080
```

**Key params:**
- `-ngl 99` — offload all layers to GPU (reduce if VRAM-constrained)
- `--flash-attn on` — Flash Attention: reduces memory from O(n²) to O(n), saves VRAM and speeds inference
- `--jinja` — Jinja templating engine: enables proper chat template formatting with function calling support
- `--reasoning off` — disables Chain-of-Thought (hidden reasoning tokens that waste context for creative writing)
- `--cache-type-k q4_0` / `--cache-type-v q4_0` — **KV cache 4-bit quantization. Critical: reduces 128K context cache from ~12-16GB to ~3-4GB**
- `-t 12` — CPU threads for inference (match physical core count)
- `-b 1024` / `-ub 512` — batch and micro-batch sizes for parallel token processing
- `--mlock` — mlock() physical memory lock, prevents OS swap to disk
- With RTX 4090 24GB, increase `-c 260000`.

4. In app: provider = Self-hosted, URL = `http://127.0.0.1:8080`, mode = ⚡ Slot.

---

## 8. Concepts Worth Knowing

### Slot Mode Savings

Imagine giving a printed manuscript to an editor. First meeting: they read all chapters, remember everything. Second meeting: you bring one new chapter—they don't need to re-read the old ones.

Slot mode does this. After first read, the server keeps intermediate results (KV cache) in memory. Subsequent messages only process new content. Stateless re-processes everything each time.

**DeepSeek supports this too**—via `prompt_cache`.

### Fuzzy Memory (Compression)

If your novel exceeds AI context limits, older chapters get auto-compressed into summaries. The AI still knows the story arc, just misses fine details. Summaries live in `fuzzyMemory/`.

### Version History

Each analysis creates a new version (v1, v2, v3...). Version selectors on World Tree, Character Pool, and Rhythm Console let you compare.

### SKILL Auto-Learning

After each analysis, AI auto-generates writing tips from your novel—strengths to keep, weaknesses to fix. Saved to `skills/self/`. Auto-injected next time you write.

---

## 9. Project Folder Structure

```
projects/YourNovel/
├── chapters/          ← Final chapters + writing directions
├── drafts/            ← Auto-saved drafts
├── projectLog/v{N}/   ← Analysis logs per version
├── worldTreeData/     ← World tree
├── characterProfiles/   ← Characters
├── tensionReports/    ← Rhythm
├── reviews/           ← Review records
├── fuzzyMemory/       ← Long-text compression
├── skills/external/   ← Your custom SKILLs
└── skills/self/       ← AI auto-learned tips
```

---

## 10. FAQ

**Q: Is it free?**
A: Local LLM = free (needs GPU). API = ~$0.50 per novel. Both options available.

**Q: Need coding skills?**
A: No. Copy-paste a few commands, that's it.

**Q: AI style doesn't match?**
A: Writer sidebar → SKILLs → create rules. AI follows them.

**Q: Lose work switching pages?**
A: No. Auto-saved drafts restore automatically.

**Q: Browser crashes?**
A: Refresh. Everything's on disk.

**Q: Slot or Stateless?**
A: Slot. Works with both DeepSeek and llama.cpp. Switch to Stateless only if Slot fails.

**Q: What models?**
A: DeepSeek, OpenAI-compatible, local llama.cpp.

---

# 📄 License

MIT © 2026 Rambolv
