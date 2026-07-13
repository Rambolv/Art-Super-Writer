# ASR Writer — LLM 交互流程文档

> 本文档记录了系统与 LLM（大语言模型）的所有交互流程，包括多轮对话结构、每轮的完整提示词、以及前后端处理逻辑。
> 最后更新: 2026-07-09

---

## 总览：一次「分析」点击的完整流程

当用户在项目管理页面点击「🔍 分析」按钮时，系统执行以下流程：

```
第1步：探测能力 → LLM 回复上下文上限
第2步：分批阅读 → 每批 LLM 回复"已读"（全文作为单章处理，不分章节）
第3步：阅读体验 → LLM 讲述整篇的吸引力/情感浓度/作用
第4步：故事结构 → LLM 讲述主线/支线/伏笔/世界观
第5步：角色印象 → LLM 逐一描述所有角色
第6步：整体感受 → LLM 讲述节奏判断/最想知道/下一章期待
第7步：技能评价 → LLM 以编辑视角评价优缺点
第8步：输出 JSON → LLM 基于前几轮分析，输出结构化数据
```

---

## 第1步：探测模型能力

### 目的
询问 LLM 自身的上下文限制，计算后续分批阅读的每批大小。

### 发送给 LLM

```
角色: 用户
内容: 请简要回答：你的上下文 Token 上限是多少？建议每次输入的 Token 数在什么范围最优？回答格式如："上限100K，最优30K-50K"。
```

### 参数
- `max_tokens: 200`
- `temperature: 0.1`

### 前端处理逻辑

```javascript
// 从 LLM 回复中提取数字
const nums = response.match(/(\d+)\s*K/g);
let optimalLimit = 48000; // 默认 48K
if(nums){
  const vals = nums.map(n => parseInt(n) * 1000).sort((a,b) => a-b);
  if(vals.length >= 2) optimalLimit = Math.floor(vals[Math.floor(vals.length/2)] * 0.75);
}
// 计算每批可用 Token（预留指令和输出空间）
const batchMax = Math.min(optimalLimit - 8000, 40000);
```

---

## 第2步：分批阅读

### 目的
将全文按第1步计算出的 `batchMax` 切块，分批发送给 LLM 阅读。每批 LLM 只回复"已读"，对话历史不断累积。

### 系统提示词（仅第一轮）

```
角色: 系统
内容: 你是一个耐心的小说读者。我会分批发送小说内容给你阅读，你读完每批后只需回复"已读"即可。等我发出分析指令时，再基于所有已读内容做分析。
```

### 每批发送

```
角色: 用户
内容: 请阅读以下第{i+1}/{total}部分内容，读完后回复"已读"：

[分批的章节内容]
```

### 参数
- `max_tokens: 100`
- `temperature: 0.1`

### 前端处理逻辑

```javascript
// 按 Token 上限拆分文本，尽量在行边界处切
function splitIntoChunks(text, maxTokens){
  const lines = text.split('\n');
  const chunks = [];
  let current = '', currentTokens = 0;
  for(const line of lines){
    const lineTokens = Math.ceil((line.length + 1) * 0.6);
    if(currentTokens + lineTokens > maxTokens && current.length > 0){
      chunks.push(current.trim());
      current = '';
      currentTokens = 0;
    }
    current += line + '\n';
    currentTokens += lineTokens;
  }
  if(current.trim()) chunks.push(current.trim());
  return chunks;
}

// 分批对话
const conversation = [{role:'system', content:'...'}];
for(let i=0; i<chunks.length; i++){
  conversation.push({role:'user', content:'请阅读第'+(i+1)+'/'+total+'部分...'});
  const reply = await callLLM(conversation, {max_tokens:100, temperature:0.1});
  conversation.push({role:'assistant', content: reply.substring(0,200)});
}
```

---

## 第3步：阅读体验

### 目的
LLM 以读者身份，评价整篇的阅读吸引力、情感浓度和作用标签（全文作为单章处理，不分章节）。

### 发送给 LLM

```
角色: 用户
内容: 你已读完了整部小说的全部内容。现在请以一位普通读者的身份，给出阅读体验。注意：全文已作为单章处理，请针对整篇内容回答：阅读吸引力(1-10)、情感浓度(1-10)、作用标签(引入/铺垫/冲突/转折/高潮/收尾/过渡/揭秘)。用自然语言回答，不必JSON。
```

### 参数
- `max_tokens: 4096`
- `temperature: 0.7`

---

## 第4步：故事结构

### 目的
LLM 分析主线脉络、支线、伏笔和世界观设定。

### 发送给 LLM

```
角色: 用户
内容: 接下来分析故事结构：
1. 主线脉络，按顺序列出关键事件节点，标注重要性和先后顺序。
2. 有哪些正在发展的支线，当前进展、与主线关联度(1-10)。
3. 作者埋了哪些还没揭晓的伏笔，按读者最想知道的迫切程度排序。
4. 世界观有什么独特设定？
用自然语言回答。
```

### 参数
- `max_tokens: 4096`
- `temperature: 0.7`

---

## 第5步：角色印象

### 目的
LLM 识别所有角色，逐一描述其行为模式和定位。

### 发送给 LLM

```
角色: 用户
内容: 请识别出故事中所有出现过的角色，一个都不要漏。对每个角色标注ta是主角、反派、配角还是主要角色。然后逐一给出：
- 一句话评价
- 最大特点（举例）
- 遇到困难时的应对方式
- 做决定时的风格
- 倾向稳赚还是冒险
- 最在意什么和最怕什么
- 和谁亲近和谁冲突
- 言行是否一致（有没有出人意料的行为，是否合理）
- 如果要让ta做违背本性的事需要什么前提
用自然语言回答。
```

### 参数
- `max_tokens: 8192`
- `temperature: 0.7`

---

## 第6步：整体感受

### 目的
LLM 给出对故事的节奏判断和后续期待。

### 发送给 LLM

```
角色: 用户
内容: 现在给出整体感受：
1. 目前节奏感觉如何（太平/有点慢/正好/偏快）？
2. 读完你最想知道的三件事，按迫切程度排序。
3. 如果下一章让你来写，你希望看到什么？
4. 有什么想提醒作者注意的？
用自然语言回答。
```

### 参数
- `max_tokens: 2048`
- `temperature: 0.7`

---

## 第7步：写作技能评价

### 目的
LLM 以资深编辑视角评价本文的写作水平。

### 发送给 LLM

```
角色: 用户
内容: 最后，请以资深编辑的视角评价这部小说：
1. 本文写得好的地方（优点，举例说明）。
2. 本文的不足之处（缺点，举例说明并提出改进建议）。
3. 给作者的综合建议（1-2条最核心的）。
用自然语言回答。
```

### 参数
- `max_tokens: 4096`
- `temperature: 0.7`

---

## 第8步：输出 JSON

### 目的
基于前几轮（第4-8步）累积的分析结果，LLM 输出结构化 JSON 供前端存储和展示。

### 发送给 LLM

```
角色: 用户
内容: 根据以上所有分析，请输出以下JSON格式的分析结果（只输出JSON，不要其他文字）：

{
  "plot_structure": {
    "trunk": [{"chapter":1,"event":"事件描述","importance":8}],
    "branches": [{"name":"支线名","start_chapter":1,"status":"发展中|接近收尾","relation":7}],
    "buds": [{"chapter":1,"foreshadow":"伏笔描述","urgency":"高|中|低"}],
    "roots": [{"chapter":1,"category":"地点|规则|历史|其他","content":"设定描述"}]
  },
  "characters": {
    "角色名": {
      "role":"主角|反派|配角|主要角色",
      "tag":"一句话评价",
      "traits":[],
      "decision_style":"",
      "risk_attitude":"",
      "cares_about":[],
      "fears":[],
      "bottom_line":"",
      "relationships":{},
      "trust_pattern":"",
      "conflict_style":"",
      "consistency_issues":[],
      "breaking_point":"",
      "behavioral_model":""
    }
  },
  "rhythm": {
    "per_chapter":[{"chapter":1,"page_turner":6,"emotion":4,"role":""}],
    "overall_pacing":"",
    "top_questions":[],
    "next_chapter_hope":""
  },
  "memo": {
    "writer_advice":[],
    "warnings":[]
  },
  "skills": {
    "strengths":[{"aspect":"","examples":"","detail":""}],
    "weaknesses":[{"aspect":"","examples":"","detail":"","improvement":""}],
    "overall_advice":""
  }
}
```

### 参数
- `max_tokens: 65536`
- `temperature: 0.3`

### 前端处理逻辑

解析 JSON 后分别存入项目数据的各模块：

| JSON 字段 | 存入目标 | 用途 |
|-----------|---------|------|
| `plot_structure` | `p.worldTree` + `folders.worldTreeData` | 世界树页面 |
| `characters` | `p.characters` + `folders.characterProfiles` | 角色池页面 |
| `rhythm` | `p.rhythm` + `folders.tensionReports` | 节奏控制台页面 |
| `memo` | `p.writerMemo` | Writer 上下文注入 |
| `skills` | `p.skills` + `folders.skills.self` | 写作技巧库 |

---

## 写入磁盘文件夹

分析完成后，`saveProjectFilesToDisk(name)` 将以下数据持久化到磁盘：

```
projects/{项目名}/
├── chapters/chapter_001.md          ← 每章原文
├── worldTreeData/world_tree.json     ← 世界树结构化数据
├── characterProfiles/角色名_档案.md  ← 每个角色的档案
├── tensionReports/读者节奏报告.md    ← 节奏数据
├── fuzzyMemory/                      ← 模糊记忆报告
├── skills/self/skill_N.md           ← 写作技能评价
└── projectLog/project_log.json      ← 操作日志
```

---

## 核心设计原则

1. **一次点击 = 多轮对话** — 不是一次调用塞所有任务，而是分步骤逐步引导 LLM
2. **LLM 不做机械工作** — 不需要 LLM 回传全文，只返回标记，前端负责切分
3. **自然语言优先** — 前几轮都用自然语言问答，最后一轮才输出 JSON
4. **对话历史积累** — 每轮结果都追加到 `conversation[]`，后续轮次可参考
5. **角色统一** — LLM 始终以"普通读者"身份回答，避免角色切换导致的质量下降
