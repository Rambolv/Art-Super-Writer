
// ═══════ 语言 ═══════
let lang = localStorage.getItem('asw_lang') || 'zh';
const L = {
  'creative':'🎨 创作台','creative.en':'🎨 Creative Desk',
  'project':'📁 项目管理','project.en':'📁 Project',
  'writer':'✍️ 写作台','writer.en':'✍️ Writer',
  'review':'🔍 审查室','review.en':'🔍 Review',
  'worldtree':'🌳 世界树','worldtree.en':'🌳 World Tree',
  'characters':'🧠 角色池','characters.en':'🧠 Characters',
  'tension':'📊 节奏控制台','tension.en':'📊 Rhythm',
  'settings':'⚙️ 设置','settings.en':'⚙️ Settings',
  'history':'📋 历史日志','history.en':'📋 History',
  'welcome':'欢迎使用 Art Super Writer','welcome.en':'Welcome to Art Super Writer',
  'welcome_desc':'请从左侧选择一个功能开始','welcome_desc.en':'Select a tool from the left to start',
  'no_data':'暂无数据','no_data.en':'No data',
};
function T(k){const e=L[k+'.'+lang]||L[k];return e||k}
function setLang(l){lang=l;localStorage.setItem('asw_lang',l);
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));
  // 刷新导航文字
  document.querySelectorAll('.nav-btn').forEach(b=>{
    const key = b.dataset.page;
    const icon = b.querySelector('.icon')?.outerHTML||'';
    b.innerHTML = icon + ' ' + T(key).replace(/^[^\s]+\s/,'');
  });
  renderCurrentPage();
}

// ═══════ 数据管理 ═══════
// DB = 内存缓存；磁盘（服务器）是主存储；localStorage 是本地缓存

const DB = {projects:{}, currentProject:'', lockedProject:''};

function createDefaultFolders(){
  return {
    chapters: [], drafts: [], reviews: [], reviewHistory: {},
    worldTreeData: {}, characterProfiles: {}, characterAnalysis: {},
    tensionReports: {}, config: {}, projectLog: [],
    fuzzyMemory: {}, skills: {external:[], self:[]}, styleMemory: {}, referenceNotes: [],
  };
}

/** 启动时加载数据：先尝试从服务器加载，再 fallback 到 localStorage */
async function initApp(){
  let loadedFromServer = false;
  try {
    // 1. 从服务器获取项目列表
    const resp = await fetch('http://127.0.0.1:8899/api/projects');
    const data = await resp.json();
    if(data.projects && data.projects.length){
      loadedFromServer = true;
      for(const name of data.projects){
        // 2. 从服务器加载每个项目的元数据
        let meta = null;
        try {
          const mr = await fetch('http://127.0.0.1:8899/api/project/meta?project='+encodeURIComponent(name));
          if(mr.ok) meta = await mr.json();
        } catch(e){}
        if(meta && meta.name){
          DB.projects[name] = Object.assign(createProjectData(name, meta), meta);
        } else {
          DB.projects[name] = createProjectData(name, {});
          DB.projects[name].imported = true;
        }
      }
      // 3. 对已导入的项目，检查磁盘是否有章节文件
      for(const name of data.projects){
        const p = DB.projects[name];
        if(p && p.imported && (!p.folders?.chapters?.length)){
          try {
            const files = await listDiskFiles(name, 'chapters');
            if(files && files.length){
              p.folders.chapters = files.map(f => ({file: f, source: ''}));
            }
          } catch(e){}
        }
      }
    }
  } catch(e){ /* 服务器不在线 */ }

  // 3. 从 localStorage 补充（离线缓存）
  try {
    const d = localStorage.getItem('asw_db');
    if(d){
      const p = JSON.parse(d);
      // 合并 localStorage 中服务器没有的项目
      if(p.projects){
        for(const name of Object.keys(p.projects)){
          if(!DB.projects[name]){
            DB.projects[name] = p.projects[name];
          } else {
            // 补充 localStorage 中的额外字段（如章节内容缓存）
            const localProj = p.projects[name];
            if(localProj.chapters?.length > (DB.projects[name].chapters||[]).length){
              DB.projects[name].chapters = localProj.chapters;
            }
          }
        }
      }
      if(p.currentProject && !DB.currentProject) DB.currentProject = p.currentProject;
      if(p.lockedProject) DB.lockedProject = p.lockedProject;
      if(p.apiKeyStates) DB.apiKeyStates = p.apiKeyStates;
    }
  } catch(e){}

  // 4. 确保所有项目都有 folders 结构
  Object.values(DB.projects).forEach(p => {
    if(!p.folders) p.folders = createDefaultFolders();
  });

  // 5. 从 localStorage 恢复 currentProject（如果服务器没给）
  if(!DB.currentProject){
    const names = Object.keys(DB.projects);
    if(names.length) DB.currentProject = names[0];
  }

  renderCurrentPage();
}

/** 保存：写磁盘（主）+ localStorage（缓存） */
function saveDB(){
  // 异步写磁盘（不阻塞 UI）
  const proj = DB.currentProject ? DB.projects[DB.currentProject] : null;
  if(proj) syncProjectMeta(DB.currentProject);
  // 写 localStorage 缓存
  try {
    localStorage.setItem('asw_db', JSON.stringify({
      projects: DB.projects,
      currentProject: DB.currentProject,
      lockedProject: DB.lockedProject,
      apiKeyStates: DB.apiKeyStates||{}
    }));
  } catch(e){}
}

/** 将项目元数据同步到服务器的 project.json */
async function syncProjectMeta(projectName){
  const p = DB.projects[projectName];
  if(!p) return;
  try {
    // 只保存元数据，不保存大块章节内容
    const metaData = {
      name: p.name,
      premise: p.premise || '',
      genre: p.genre || '未知',
      createdAt: p.createdAt || Date.now(),
      imported: !!p.imported,
      analyzed: !!p.analyzed,
      chapters: (p.chapters||[]).map(c => ({
        number: c.number,
        status: c.status || 'draft',
        wordCount: c.wordCount || 0,
        created_at: c.created_at || ''
      })),
      characters: p.characters ? Object.keys(p.characters).length : 0,
      config: p.config || {},
    };
    await fetch('http://127.0.0.1:8899/api/project/meta', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({project: projectName, action: 'save', data: metaData})
    });
  } catch(e){}
}

/** 从磁盘加载章节列表到 p.chapters */
async function loadChaptersFromDisk(projectName){
  const p = DB.projects[projectName];
  if(!p) return;
  const files = await listDiskFiles(projectName, 'chapters');
  const chFiles = files.filter(f=>/^chapter_\d{3}\.md$/.test(f)).sort();
  if(chFiles.length > 0){
    p.chapters = [];
    for(const fname of chFiles){
      const content = await readFileFromDisk(projectName, 'chapters', fname);
      if(content){
        const num = parseInt(fname.match(/\d+/)[0]);
        p.chapters.push({number:num, content, status:'approved', created_at:''});
      }
    }
    p.chapters.sort((a,b)=>a.number-b.number);
    return true;
  }
  return false;
}

// ═══════ API Key 加密持久化 ═══════
function _getMachineFingerprint(){
  let s = '';
  try{s += navigator.userAgent + '|' + screen.width + 'x' + screen.height + '|ASR_WRITER_SALT_2026';}catch(e){s='default_fingerprint_2026';}
  return s;
}
function _encryptApiKey(plain){
  if(!plain) return '';
  const fp = _getMachineFingerprint();
  let r = '';
  for(let i=0;i<plain.length;i++){
    const c = plain.charCodeAt(i) ^ fp.charCodeAt(i % fp.length);
    r += String.fromCharCode(c);
  }
  return btoa(r);
}
function _decryptApiKey(cipher){
  if(!cipher) return '';
  try{
    const fp = _getMachineFingerprint();
    const r = atob(cipher);
    let p = '';
    for(let i=0;i<r.length;i++){
      p += String.fromCharCode(r.charCodeAt(i) ^ fp.charCodeAt(i % fp.length));
    }
    return p;
  }catch(e){return '';}
}
function _loadApiKeys(){
  try{
    const d = localStorage.getItem('asw_db_apikeys');
    if(d){const p=JSON.parse(d);const r={};for(const k in p)r[k]=_decryptApiKey(p[k]);return r;}
  }catch(e){}
  // 尝试从磁盘加载
  return {};
}
function _saveApiKeys(keys){
  const e = {};
  for(const k in keys) if(keys[k]) e[k] = _encryptApiKey(keys[k]);
  localStorage.setItem('asw_db_apikeys',JSON.stringify(e));
  // 同步到磁盘
  try {
    fetch('http://127.0.0.1:8899/api/project/save-file', {
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({project:'__asr_writer_meta__', folder:'', filename:'apikeys.json', content:JSON.stringify(e)})
    });
  } catch(e2){}
}
// 内存中的 API Key 缓存
const _apiKeysCache = _loadApiKeys();
// 每个提供商的 Key 状态: 'editing' | 'applied'
if(!DB.apiKeyStates) DB.apiKeyStates = {};

function getProj(){return DB.currentProject ? DB.projects[DB.currentProject] : null;}

// ═══════ 导航 ═══════
let currentPage = 'creative';
const PAGES = ['creative','project','writer','review','worldtree','characters','tension','settings','history'];

function navigateTo(pageId){
  // 切页时清理历史日志刷新定时器
  if(window._historyRefreshTimer){ clearInterval(window._historyRefreshTimer); window._historyRefreshTimer = null; }
  currentPage = pageId;
  renderTabs();
  // 主面板
  document.querySelectorAll('#panel-main .page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+pageId).classList.add('active');
  // 右侧面板
  document.querySelectorAll('#panel-side .page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+pageId+'-side').classList.add('active');
  // 渲染
  renderPage(pageId);
}

document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click',()=>navigateTo(btn.dataset.page));
});

// ═══════ 拖拽分隔条 ═══════
(function(){
  const splitter = document.getElementById('splitter');
  const main = document.getElementById('panel-main');
  const side = document.getElementById('panel-side');
  let dragging = false;
  
  splitter.addEventListener('mousedown',(e)=>{
    dragging=true;splitter.classList.add('active');
    main.style.flex = 'none';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove',(e)=>{
    if(!dragging)return;
    const panels = document.getElementById('panels');
    const rect = panels.getBoundingClientRect();
    const totalW = rect.width;
    const splitterW = 4;
    let mainW = e.clientX - rect.left - splitterW/2;
    const sideW = Math.max(180, Math.min(400, rect.right - e.clientX - splitterW/2));
    mainW = totalW - sideW - splitterW;
    mainW = Math.max(300, mainW);
    main.style.width = mainW + 'px';
    side.style.width = (totalW - mainW - splitterW) + 'px';
  });
  
  document.addEventListener('mouseup',()=>{
    if(!dragging)return;
    dragging=false;splitter.classList.remove('active');
  });
})();

// ═══════ 页面渲染 ═══════
function renderPage(pageId){
  const fn = renderers[pageId];
  if(fn) fn();
}

function renderCurrentPage(){
  renderPage(currentPage);
  document.querySelectorAll('.nav-btn').forEach(b=>{
    const key = b.dataset.page;
    const t = T(key);
    const icon = b.querySelector('.icon')?.outerHTML||'';
    b.innerHTML = icon + ' ' + t.replace(/^[^\s]+\s/,'');
  });
  updateLockBadge();
}

// 全局锁定徽章 — 在顶部标题栏显示
function updateLockBadge(){
  const badge = document.getElementById('lockBadge');
  const name = document.getElementById('lockBadgeName');
  const locked = getLockedProject();
  if(locked){
    badge.style.display = 'inline-flex';
    name.textContent = locked.name;
  } else {
    badge.style.display = 'none';
  }
}

// 所有页面渲染函数
const renderers = {};

// ═══════ 创作台（首页）═══════
renderers.creative = function(){
  const el = document.getElementById('page-creative');
  el.innerHTML = `
    <div class="empty-state" style="padding-top:80px">
      <div style="font-size:64px;margin-bottom:16px">✒️</div>
      <h2 style="margin-bottom:8px">${T('welcome')}</h2>
      <p style="color:var(--text-dim)">${T('welcome_desc')}</p>
    </div>`;
  document.getElementById('page-creative-side').innerHTML = `
    <div class="empty-state">
      <p style="font-size:13px;color:var(--text-dim)">选择一个功能查看详情</p>
    </div>`;
};

// ═══════ 项目管理 ═══════
renderers.project = function(){
  const main = document.getElementById('page-project');
  const side = document.getElementById('page-project-side');
  const proj = getProj();

  // ─── 主面板：项目列表 + 详情 ───
  let html = ``;

  // 锁定提示横幅
  const lockedProj = getLockedProject();
  if(lockedProj){
    html += `<div style="background:linear-gradient(135deg,rgba(0,212,255,.12),rgba(0,212,255,.04));border:1px solid var(--cyan);border-radius:var(--radius);padding:12px 16px;margin-bottom:12px;display:flex;align-items:center;gap:12px">
      <span style="font-size:28px">🔒</span>
      <div style="flex:1">
        <div style="font-weight:600;color:var(--cyan);font-size:15px">已锁定「${lockedProj.name}」</div>
        <div style="font-size:12px;color:var(--text-dim)">写作台、审查室、世界树、角色池等模块均以此项目为核心运作</div>
      </div>
      <button class="btn btn-secondary" onclick="unlockProject()">🔓 解锁</button>
    </div>`;
  } else {
    // 未锁定时提示用户锁定
    const hasProjects = Object.keys(DB.projects).length > 0;
    if(hasProjects){
      html += `<div style="background:linear-gradient(135deg,rgba(255,159,67,.1),rgba(255,159,67,.03));border:1px solid var(--orange);border-radius:var(--radius);padding:14px 18px;margin-bottom:12px;display:flex;align-items:center;gap:12px">
        <span style="font-size:24px">🔓</span>
        <div style="flex:1">
          <div style="font-weight:600;color:var(--orange);font-size:14px">请先锁定一个项目</div>
          <div style="font-size:12px;color:var(--text-dim)">点击项目右侧的「🔒 锁定」按钮，锁定后写作台、审查室等模块才能以该项目为核心运作</div>
        </div>
      </div>`;
    }
  }

  html += `<div class="page-title">📁 ${T('project')}</div>`;

  const names = Object.keys(DB.projects);
  html += `<div class="card"><div class="card-title">📚 ${T('no_data')=='暂无数据'?'已有项目':'Projects'}</div>`;
  if(names.length===0){
    html += `<div class="empty-state"><p>${T('no_data')}</p></div>`;
  } else {
    names.forEach(n=>{
      const p = DB.projects[n];
      const active = DB.currentProject===n;
      const locked = DB.lockedProject === n;
      const ch = p.chapters?p.chapters.length:0;
      const isImp = p.imported && !p.analyzed;
      html += `<div class="proj-item${active?' active':''}" style="${locked?'border-color:var(--cyan);background:rgba(0,212,255,.08)':''}">
        <div style="flex:1;cursor:pointer" onclick="selectProject('${n}')">
          <div class="proj-name">${n}</div>
          <div class="proj-meta">${ch} 章 · ${Object.keys(p.characters||{}).length} 角色${isImp?' · <span class="tag tag-yellow">未分析</span>':''}</div>
        </div>
        <div style="display:flex;gap:4px;align-items:center;flex-shrink:0">
          ${locked
            ? `<span class="tag tag-blue" style="font-size:14px;padding:6px 16px;cursor:pointer;border-radius:6px;font-weight:600" onclick="event.stopPropagation();unlockProject()" title="点击解锁">🔒 已锁定</span>`
            : `<button class="btn btn-primary" style="font-size:14px;padding:6px 16px;font-weight:600" onclick="event.stopPropagation();lockProject('${n}')">🔒 锁定</button>`
          }
          ${(ch>0 || isImp) ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();analyzeProject('${n}')" id="btnAnalyze_${n.replace(/[^a-zA-Z0-9]/g,'_')}">${!p.analyzed?'🔍 分析':'🔄 重新分析'}</button>` : ''}
          ${locked ? `<span style="color:var(--text-muted);font-size:11px;padding:4px 8px;border:1px dashed var(--text-muted);border-radius:4px">🗑️ 已锁定不可删</span>`
                   : `<button class="btn btn-danger btn-sm" onclick="event.stopPropagation();confirmDelete('${n}')">🗑️ 删除</button>`}
        </div>
      </div>`;
    });
  }
  html += `</div>`;

  if(proj){
    const ch = proj.chapters||[];
    const chars = Object.keys(proj.characters||{}).length;
    const scores = ch.filter(c=>c.finalScore).map(c=>c.finalScore);
    const avg = scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0;
    const words = ch.reduce((a,c)=>a+(c.wordCount||0),0);
    const isImported = proj.imported;
    const isAnalyzed = proj.analyzed || proj.chapters?.length > 0;
    const isLocked = DB.lockedProject === proj.name;

    html += `<div class="card"><div class="card-title">📊 ${proj.name}</div>
      <div style="font-size:12px;color:var(--text-dim);margin-bottom:8px">
        类型: ${proj.genre||'未设置'} · 前提: ${(proj.premise||'未设置').slice(0,50)}
        ${isImported?' · <span class="tag tag-blue">已导入</span>':''}
        ${isAnalyzed?' · <span class="tag tag-green">已分析</span>':' · <span class="tag tag-yellow">未分析</span>'}
        ${isLocked?' · <span class="tag tag-blue">🔒 已锁定</span>':''}
      </div>
      <div class="proj-stats">
        <div class="stat"><div class="stat-v">${ch.length}</div><div class="stat-l">章节</div></div>
        <div class="stat"><div class="stat-v">${chars}</div><div class="stat-l">角色</div></div>
        <div class="stat"><div class="stat-v">${words.toLocaleString()}</div><div class="stat-l">总字数</div></div>
        <div class="stat"><div class="stat-v">${avg>0?avg.toFixed(1):'-'}</div><div class="stat-l">均分</div></div>
      </div>
    </div>`;

    // 显示文件夹状态
    const f = proj.folders;
    const folderStats = [
      ['写作台', '📁', (f.chapters?.length||0) + '章'],
      ['审查室', '📁', (f.reviewHistory?.entries?.length||0) + '条记录'],
      ['世界树', '📁', f.worldTreeData?.world_tree_json ? '有数据' : '空'],
      ['角色池', '📁', Object.keys(f.characterProfiles||{}).length + '个档案'],
      ['节奏控制台', '📁', Object.keys(f.tensionReports||{}).length + '份报告'],
      ['模糊记忆', '📁', Object.keys(f.fuzzyMemory||{}).length + '份文档'],
      ['写作技巧库', '📁', ((f.skills?.external||[]).length + (f.skills?.self||[]).length) + '条规则'],
      ['历史日志', '📁', (f.projectLog?.length||0) + '条记录'],
    ];
    html += `<hr class="sep"><div style="font-size:12px">
      <div style="color:var(--text-dim);margin-bottom:6px;font-weight:600">📂 项目文件夹结构</div>
      <div class="grid-2" style="gap:4px">`;
    folderStats.forEach(([label,icon,status])=>{
      const hasData = !status.includes('0条') && !status.includes('空');
      html += `<div style="padding:3px 6px;border-radius:4px;background:rgba(255,255,255,.03);font-size:11px">
        <span style="color:${hasData?'var(--green)':'var(--text-muted)'}">${icon}</span> ${label}: <span style="color:${hasData?'var(--text)':'var(--text-muted)'}">${status}</span>
      </div>`;
    });
    html += `</div>
      <button class="btn btn-secondary btn-sm btn-block" style="margin-top:6px" onclick="createDiskFolders('${proj.name}')">💾 导出到磁盘文件夹</button>
    </div>`;

    if(proj.qualityHistory&&proj.qualityHistory.length>1){
      html += `<div class="card"><div class="card-title">📈 质量趋势</div>
        <div style="height:120px"><canvas id="projChart"></canvas></div>
      </div>`;
    }

    if(!isImported){
      const delDisabled = isLocked;
      html += `<hr class="sep">
        ${delDisabled
          ? `<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:8px">🔒 项目已锁定，解锁后才能删除</div>`
          : `<button class="btn btn-danger btn-block btn-sm" onclick="confirmDelete('${proj.name}')">🗑️ 删除此项目</button>`
        }`;
    }
  }

  main.innerHTML = html;

  // 渲染图表
  if(proj&&proj.qualityHistory&&proj.qualityHistory.length>1){
    setTimeout(()=>{
      const c = document.getElementById('projChart');if(!c)return;
      c.width=c.parentElement.clientWidth;c.height=120;
      new Chart(c,{type:'line',data:{
        labels:proj.qualityHistory.map(d=>'Ch'+d.chapter),
        datasets:[
          {label:'最终评分',data:proj.qualityHistory.map(d=>d.final_score),borderColor:'var(--cyan)',tension:.3,pointRadius:2}
        ]},
        options:{responsive:true,maintainAspectRatio:false,
          plugins:{legend:{display:false}},
          scales:{x:{ticks:{color:'#556677',font:{size:9}},grid:{color:'rgba(255,255,255,.03)'}},
                  y:{ticks:{color:'#556677',font:{size:9}},grid:{color:'rgba(255,255,255,.03)'}}}}});
    },50);
  }

  // ─── 右侧面板：创建 + 导入 ───
  side.innerHTML = `
    <div class="card">
      <div class="card-title">🆕 创建新项目</div>
      <label>项目名称</label>
      <input type="text" id="newProjName" placeholder="输入小说名称..." style="margin-bottom:8px">
      <label>故事前提</label>
      <textarea id="newProjPremise" placeholder="描述故事世界、核心冲突..." style="margin-bottom:8px;height:60px"></textarea>
      <label>类型</label>
      <select id="newProjGenre" style="margin-bottom:8px">
        <option>科幻</option><option>奇幻</option><option>武侠</option><option>悬疑</option><option>言情</option><option>历史</option><option>都市</option>
      </select>
      <button class="btn btn-primary btn-block" onclick="createProject()">✨ 创建</button>
    </div>
    <div class="card">
      <div class="card-title">📥 导入作品</div>
      <p style="font-size:12px;color:var(--text-dim);margin-bottom:8px">支持 .md 和 .txt 格式，可选择多个文件</p>
      <input type="file" id="importFile" accept=".md,.txt" multiple style="margin-bottom:8px;font-size:12px">
      <button class="btn btn-primary btn-block" onclick="importNovel()">📥 导入</button>
    </div>`;
};

// ─── 项目操作 ───
function selectProject(name){
  DB.currentProject = name; saveDB();
  navigateTo('project');
}

function confirmDelete(name){
  const p = DB.projects[name];
  if(!p) return;
  const locked = DB.lockedProject === name;
  if(locked){
    toast('🔒 项目已锁定，无法删除', 'error');
    return;
  }
  showModal(
    `<h3>🗑️ 确认删除</h3>
    <p style="font-size:14px;color:var(--text-dim);margin:12px 0">
      确定要永久删除项目「<strong>${name}</strong>」吗？
    </p>
    <div style="background:rgba(233,96,96,.1);border:1px solid var(--accent);border-radius:6px;padding:10px;font-size:12px;color:var(--accent);margin-bottom:8px">
      ⚠️ 此操作不可恢复！所有章节、角色配置、审查记录将全部丢失。
    </div>`,
    [{text:'❌ 取消',cls:'btn-secondary',fn:closeModal},
     {text:'🗑️ 确认永久删除',cls:'btn-danger',fn:function(){closeModal();deleteProjectItem(name)}}]
  );
}

function deleteProject(){
  const p = getProj();if(!p)return;
  confirmDelete(p.name);
}

function deleteProjectItem(name){
  // 尝试删除磁盘文件夹
  fetch('http://127.0.0.1:8899/api/project/delete', {
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name})
  }).catch(()=>{});
  delete DB.projects[name];
  if(DB.currentProject===name){
    DB.currentProject = Object.keys(DB.projects)[0]||'';
    if(DB.lockedProject===name) DB.lockedProject = '';
  }
  saveDB();
  updateLockBadge();
  if(currentPage==='project') renderers.project();
  else navigateTo('project');
  toast('🗑️ 项目已删除');
}

// 检查当前是否有锁定的项目
function getLockedProject(){
  return DB.lockedProject ? DB.projects[DB.lockedProject] : null;
}

function lockProject(name){
  DB.lockedProject = name;
  DB.currentProject = name;
  saveDB();
  updateLockBadge();
  renderers.project();
  toast(`🔒 已锁定项目「${name}」，所有操作将以此为核心`);
}

function unlockProject(){
  DB.lockedProject = '';
  saveDB();
  updateLockBadge();
  if(currentPage==='project') renderers.project();
  toast('🔓 已解锁');
}

// 尝试通过 Python 后端创建磁盘文件夹，服务器未启动时静默忽略
async function tryCreateDiskFolders(name){
  try {
    await fetch('http://127.0.0.1:8899/api/project/create', {
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name})
    });
  } catch(e){}
}

function saveFileToDisk(project, subfolder, filename, content){
  if(!content) return;
  const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  fetch('http://127.0.0.1:8899/api/project/save-file', {
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({project, folder:subfolder, filename, content:text})
  }).catch(()=>{});
}

async function readFileFromDisk(project, subfolder, filename){
  try {
    const resp = await fetch('http://127.0.0.1:8899/api/project/read-file', {
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({project, folder:subfolder, filename})
    });
    const data = await resp.json();
    if(resp.ok && data.content) return data.content;
    return null;
  } catch(e){ return null; }
}

async function listDiskFiles(project, subfolder){
  try {
    const resp = await fetch('http://127.0.0.1:8899/api/project/list-files', {
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({project, folder:subfolder})
    });
    const data = await resp.json();
    if(resp.ok && data.files) return data.files;
    return [];
  } catch(e){ return []; }
}

// ═══════ 磁盘数据同步核心 ═══════

/** 从磁盘读取章节列表到 p.chapters */
/** 根据章节标记文件 chapter_marks.json 分割全文为独立章节文件（供手动测试用） */
async function splitChaptersByMarks(projectName){
  const p = DB.projects[projectName];
  if(!p){ toast('项目不存在','error'); return; }
  const marksRaw = await readFileFromDisk(projectName, 'chapters', 'chapter_marks.json');
  if(!marksRaw){ toast('未找到章节标记文件，请先执行分析','error'); return; }
  let chMarks;
  try { chMarks = JSON.parse(marksRaw); } catch(e){ toast('章节标记文件格式错误','error'); return; }
  if(!chMarks || chMarks.length < 2){ toast('章节标记不足，无法分割','error'); return; }
  // 读取全文
  let fullText = '';
  fullText = await readFileFromDisk(projectName, 'chapters', 'full_text.md');
  if(!fullText){
    const files = await listDiskFiles(projectName, 'chapters');
    // 优先找导入的原始文件（最大的.md文件）
    const mdFiles = files.filter(f=>f.endsWith('.md') && !f.startsWith('chapter_') && !f.startsWith('part_') && f !== 'full_text.md' && f !== 'chapter_marks.json');
    for(const f of mdFiles){
      const content = await readFileFromDisk(projectName, 'chapters', f);
      if(content && content.length > 100){ fullText = content; break; }
    }
    if(!fullText){
      const partFiles = files.filter(f=>/^part_\d{3}\.md$/.test(f)).sort();
      for(const f of partFiles){
        const part = await readFileFromDisk(projectName, 'chapters', f);
        if(part) fullText += part + '\n\n';
      }
    }
  }
  if(!fullText || fullText.length < 50){ toast('未找到全文内容','error'); return; }
  // 匹配+分割（去标点前15字匹配）
  function norm(t){
    return t.replace(/[\uff01-\uff5e]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xfee0))
            .replace(/\u3000/g,' ')
            .replace(/[\s\n\r【】《》「」『』（）\[\]""''，。、；：？！·—…\.,;:!?'"\(\)\[\]]/g,'');
  }
  function normKeepLen(t){ return t.replace(/[\uff01-\uff5e]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xfee0)).replace(/\u3000/g,' '); }
  const n1Full = normKeepLen(fullText);        // 等长，索引与原文一致
  const n2Full = norm(n1Full);                 // 去标点，更短
  let searchFrom = 0;
  const found = [];
  for(let i=0; i<chMarks.length; i++){
    const cm = chMarks[i];
    const n1Open = normKeepLen(cm.openText);
    let idx = -1;
    // 方式1：等长精确匹配
    idx = n1Full.indexOf(n1Open, searchFrom);
    // 方式2：去标点匹配（需换算索引）
    if(idx < 0){
      const n2Open = norm(n1Open).replace(/[\s]/g,'').substring(0,15);
      if(n2Open.length >= 3){
        const bIdx = n2Full.indexOf(n2Open);
        if(bIdx >= 0){
          let cnt = 0;
          for(let j=0; j<n1Full.length; j++){
            if(!/[\s\n\r【】《》「」『』（）\[\]""''，。、；：？！·—…\.,;:!?'"\(\)\[\]]/.test(n1Full[j])) cnt++;
            if(cnt > bIdx){ idx = j; break; }
          }
        }
      }
    }
    if(idx >= 0 && idx >= searchFrom){
      found.push({idx, cm});
      searchFrom = idx + 1;
    }
  }
  if(found.length >= 2){
    p.chapters = [];
    p.folders.chapters = p.folders.chapters.filter(f=>!f.file || !/^chapter_\d{3}\.md$/.test(f.file));
    for(let i=0; i<found.length; i++){
      const start = found[i].idx;
      const end = i+1 < found.length ? found[i+1].idx : fullText.length;
      const content = fullText.substring(start, end).trim();
      const cm = found[i].cm;
      if(content.length > 50){
        p.chapters.push({number:cm.number, title:cm.title, content, status:'draft', created_at:new Date().toISOString()});
        const fname = 'chapter_'+String(cm.number).padStart(3,'0')+'.md';
        p.folders.chapters.push({file:fname, content});
        saveFileToDisk(projectName, 'chapters', fname, content);
      }
    }
    toast(`✅ 已分割为 ${p.chapters.length} 章`);
    if(getLockedProject()?.name === projectName) renderers.writer();
  } else {
    toast('匹配失败：部分章节在原文中未找到对应位置','error');
  }
}

/** 从磁盘读取世界树数据到 p.worldTree */
async function loadWorldTreeFromDisk(projectName){
  const p = DB.projects[projectName];
  if(!p) return false;
  const content = await readFileFromDisk(projectName, 'worldTreeData', 'world_tree.json');
  if(content){
    try { p.worldTree = JSON.parse(content); return true; } catch(e){}
  }
  return false;
}

/** 从磁盘读取节奏数据到 p.rhythm */
async function loadRhythmFromDisk(projectName){
  const p = DB.projects[projectName];
  if(!p) return false;
  const content = await readFileFromDisk(projectName, 'tensionReports', '读者节奏报告.md');
  if(content) { p.rhythmDebug = content; return true; }
  return false;
}

/** 同步：分析完成后将内存数据写入磁盘 + 加载时从磁盘读入内存 */
async function syncProjectFromDisk(projectName){
  const p = DB.projects[projectName];
  if(!p) return false;
  let loaded = false;
  if(await loadChaptersFromDisk(projectName)) loaded = true;
  if(await loadWorldTreeFromDisk(projectName)) loaded = true;
  await loadRhythmFromDisk(projectName);
  return loaded;
}

function saveProjectFilesToDisk(projectName){
  const p = DB.projects[projectName];
  if(!p) return;
  // 章节
  (p.chapters||[]).forEach(ch=>{
    saveFileToDisk(projectName, 'chapters', `chapter_${String(ch.number).padStart(3,'0')}.md`, ch.content);
  });
  // 世界树数据（JSON + 报告）
  if(p.worldTree){
    saveFileToDisk(projectName, 'worldTreeData', 'world_tree.json', p.worldTree);
  }
  // 角色池数据（JSON + 档案）
  if(p.characters && Object.keys(p.characters).length > 0){
    saveFileToDisk(projectName, 'characterProfiles', 'characters.json', p.characters);
    Object.entries(p.characters).forEach(([cid, ch])=>{
      if(ch.name) saveFileToDisk(projectName, 'characterProfiles', `${ch.name}_档案.md`,
        `# ${ch.name}\n\n角色定位: ${ch.role||'未知'}\n\n${ch.behavioral_model||''}`);
    });
  }
  // 节奏数据（JSON + 报告）
  if(p.rhythm) saveFileToDisk(projectName, 'tensionReports', 'rhythm.json', p.rhythm);
  if(p.rhythm || p.readerData?.rhythm){
    const r = p.rhythm || p.readerData?.rhythm;
    saveFileToDisk(projectName, 'tensionReports', '读者节奏报告.md', `# 读者节奏报告\n\n${JSON.stringify(r, null, 2)}`);
  }
  // 模糊记忆
  if(p.folders?.fuzzyMemory){
    Object.entries(p.folders.fuzzyMemory).forEach(([fname, content])=>{
      saveFileToDisk(projectName, 'fuzzyMemory', fname, content);
    });
  }
  // 项目日志
  if(p.folders?.projectLog?.length){
    saveFileToDisk(projectName, 'projectLog', 'project_log.json', p.folders.projectLog);
  }
  // 分析日志
  if(_analysisLogEntries.length > 0){
    saveFileToDisk(projectName, 'projectLog', 'analysis_log.json', _analysisLogEntries);
  }
  // 写作技能评价
  const sk = p.folders?.skills;
  if(sk?.self?.length){
    sk.self.forEach((content, i)=>{
      saveFileToDisk(projectName, 'skills/self', `skill_${i+1}.md`, content);
    });
  }
  if(sk?.external?.length){
    sk.external.forEach((content, i)=>{
      saveFileToDisk(projectName, 'skills/external', `external_${i+1}.md`, content);
    });
  }
}

function createProject(){
  const name = document.getElementById('newProjName').value.trim();
  if(!name){alert('请输入项目名称');return}
  if(DB.projects[name]){alert('项目已存在');return}
  DB.projects[name]=createProjectData(name, {
    premise:document.getElementById('newProjPremise').value.trim(),
    genre:document.getElementById('newProjGenre').value
  });
  DB.currentProject=name;
  // 创建磁盘文件夹并同步元数据
  tryCreateDiskFolders(name);
  syncProjectMeta(name);
  saveDB();
  renderers.project();
  toast(`✅ 项目「${name}」已创建`);
}

function createProjectData(name, extra){
  return {
    name,
    premise: extra?.premise||'',
    genre: extra?.genre||'未知',
    createdAt: Date.now(),
    // ─── 文件夹结构（对应全部功能模块） ───
    folders: {
      // 写作台
      chapters: [],        // chapters/ 各章节 .md 文件
      drafts: [],          // drafts/ 草稿版本
      
      // 审查室
      reviews: [],         // 审查记录列表
      reviewHistory: {},   // review_history.json
      
      // 世界树
      worldTreeData: {},   // memory/world_tree.json 世界树结构化数据
      
      // 角色池
      characterProfiles:{},// 角色心理档案 .md
      characterAnalysis:{},// 角色深度分析 .md
      
      // 节奏控制台
      tensionReports: {},  // 张力检测/ 张力检测报告 .md
      
      // 设置
      config: {},          // config/ 配置文件
      
      // 历史日志
      projectLog: [],      // project_log.json 日志条目
      
      // 模糊记忆
      fuzzyMemory: {},     // 模糊记忆/ 上下文+报告
      
      // 写作技巧库
      skills: {},          // skills/ 技巧规则
      styleMemory: {},     // style_memory 风格记忆
      referenceNotes: [],  // 参考文章学习笔记
    },
    chapters: [],
    characters: {},
    worldTree: {trunk:[],branches:[],buds:[],leaves:[],roots:[],metrics:{pending_buds:0,active_branches:0,growth_health:0.3}},
    tensions: [],
    qualityHistory: [],
    foreshadowingBank: [],
    logs: [],
  };
}

function importNovel(){
  const files = document.getElementById('importFile').files;
  if(!files||files.length===0){alert('请选择文件');return}
  let imported = 0;
  let lastName = '';
  for(let i=0;i<files.length;i++){
    const f = files[i];
    const fileName = f.name;
    const reader = new FileReader();
    reader.onload = (function(projName, fname){
      return async function(e){
        const rawBytes = new Uint8Array(e.target.result);

        if(DB.projects[projName]){ imported++; if(imported===files.length){ DB.currentProject=lastName||projName; saveDB(); renderers.project(); } return; }
        const projData = createProjectData(projName, {premise:'',genre:'未知'});
        projData.imported = true;
        projData.analyzed = false;
        DB.projects[projName] = projData;
        lastName = projName;
        imported++;
        saveDB();
        await tryCreateDiskFolders(projName);
        const mdName = fname.replace(/\.(txt|md)$/i,'.md');
        try {
          // 用 FormData 上传文件（最标准的浏览器上传方式）
          const formData = new FormData();
          const blob = new Blob([rawBytes], {type:'application/octet-stream'});
          formData.append('file', blob, mdName);
          formData.append('project', projName);
          formData.append('folder', 'chapters');
          await fetch('http://127.0.0.1:8899/api/project/upload-form', {
            method:'POST', body: formData
          });
          projData.folders.chapters.push({file:mdName, source:fname});
          // 同步项目元数据到磁盘
          syncProjectMeta(projName);
        } catch(e){ /* 服务器不在时静默 */ }

        if(imported===files.length){
          DB.currentProject = lastName;
          saveDB();
          renderers.project();
        }
      };
    })(f.name.replace(/\.(md|txt)$/i,''), fileName);
    reader.readAsArrayBuffer(f);
  }
}

function createDiskFolders(name){
  // 尝试通过 Python 后端创建
  const apiUrl = `http://127.0.0.1:8899/api/project/create`;
  fetch(apiUrl, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({name})
  })
  .then(r=>r.json())
  .then(data=>{
    if(data.created){
      toast(`✅ 文件夹已创建: ${data.path}`);
    } else if(data.reason === '已存在'){
      toast(`📁 文件夹已存在: ${data.path}`, 'info');
    } else {
      toast(`❌ 创建失败: ${data.reason||'未知错误'}`, 'error');
    }
  })
  .catch(()=>{
    // 服务器未启动，显示命令提示
    showModal(
      `<h3>💾 导出项目到磁盘</h3>
      <p style="font-size:13px;color:var(--text-dim);margin:8px 0">需要先启动本地服务器：</p>
      <div style="background:rgba(0,0,0,.3);padding:10px;border-radius:6px;font-family:monospace;font-size:12px">
        双击 start_server.bat
      </div>
      <p style="font-size:13px;color:var(--text-dim);margin:8px 0">或在终端运行：</p>
      <div style="background:rgba(0,0,0,.3);padding:10px;border-radius:6px;font-family:monospace;font-size:12px">
        cd standalone<br>
        .venv\\Scripts\\python server.py
      </div>`,
      [{text:'关闭',cls:'btn-secondary',fn:closeModal}]
    );
  });
}

// ═══════ LLM 调用 ═══════
async function callLLM(messages, opt = {}){
  const prov = DB.config?.provider || 'deepseek';
  const key = _apiKeysCache[prov];
  if(!key){toast('请先在设置中保存 API Key','error');throw new Error('no key')}
  const model = opt.model || DB.config?.model || 'deepseek-v4-flash';
  let baseUrl = PROVIDER_CONFIG[prov]?.base_url || 'https://api.deepseek.com';
  if(prov==='custom') baseUrl = DB.config?.customUrl || baseUrl;
  const resp = await fetch(baseUrl.replace(/\/+$/,'')+'/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
    body:JSON.stringify({model,messages,max_tokens:opt.max_tokens||8192,temperature:opt.temperature??0.7})
  });
  const data = await resp.json();
  if(!resp.ok) throw new Error(data.error?.message||'API错误:'+resp.status);
  return data.choices[0].message.content;
}

/**
 * 带验证/重试的 LLM 调用
 * @param {Array} messages - 对话消息数组
 * @param {Object} opt - 选项 {max_tokens, temperature}
 * @param {Object} verify - 验证规则
 * @param {Function} verify.validator - 验证响应是否合法 (response)=>boolean
 * @param {string} verify.retryPrompt - 验证失败时的重试提示
 * @param {number} verify.maxRetries - 最大重试次数（默认5）
 */
async function callLLMWithVerify(messages, opt = {}, verify = {}){
  const {validator, retryPrompt, maxRetries = 5} = verify;
  let retries = 0;
  const startTime = Date.now();

  while(retries <= maxRetries){
    // 检查是否超时（超过60秒无有效响应）
    if(retries > 0 && (Date.now() - startTime) > 60000){
      // 询问服务状态
      const healthCheck = await callLLM([
        {role:'user', content:'请回复"服务正常"以确认你处于正常工作状态。如果你收到这条消息说明之前的对话可能异常中断了。只回复"服务正常"四个字。'}
      ], {max_tokens:20, temperature:0.1});
      if(!healthCheck || !healthCheck.includes('服务正常')){
        throw new Error('LLM 服务可能异常，请检查 API Key 或网络连接');
      }
      // 恢复正常，重置计时器但不重置重试次数
      retries++; // 上次失败也算一次
      if(retries > maxRetries) throw new Error('LLM 多次返回无效响应，请检查文本长度是否超出模型能力');
      continue;
    }

    const reply = await callLLM(messages, opt);

    // 空响应检查
    if(!reply || reply.trim().length === 0){
      retries++;
      if(retries > maxRetries) throw new Error('LLM 返回空内容，请检查文本长度是否超出模型能力');
      // 添加重试提示
      messages.push({role:'user', content: retryPrompt || '请回复有效内容。如果你收到了之前的消息，请继续正常回应。'});
      continue;
    }

    // 自定义验证
    if(validator && !validator(reply)){
      retries++;
      if(retries > maxRetries) throw new Error('LLM 返回内容格式异常，请重试');
      messages.push({role:'user', content: retryPrompt || '请按照要求的格式回复。'});
      continue;
    }

    return reply; // 验证通过
  }

  throw new Error('LLM 调用失败');
}

// ═══════ 多轮对话分析（分批阅读 → 一次分析） ═══════
let _isAnalyzing = false;
function estimateTokens(text){ return Math.ceil((text||'').length * 0.6); }
async function analyzeProject(name){
  if(_isAnalyzing){toast('正在分析中，请稍候...','info');return}
  const p = DB.projects[name];
  if(!p){toast('项目不存在','error');return}
  const hasRaw = p.rawContent && !p.chapters?.length;
  const hasChapters = p.chapters && p.chapters.length > 0;
  const hasDiskFiles = (p.folders?.chapters||[]).length > 0 && !hasChapters;
  if(!hasRaw && !hasChapters && !hasDiskFiles){ toast('没有章节可分析','error'); return; }

  // 获取全文：优先从磁盘读取，其次 rawContent
  let fullText = '';
  if(hasDiskFiles){
    // 从磁盘读取所有章节文件
    const files = p.folders.chapters.filter(f=>f.file);
    for(const f of files){
      const content = await readFileFromDisk(name, 'chapters', f.file);
      if(content) fullText += content + '\n\n';
    }
  } else if(hasRaw) {
    fullText = p.rawContent;
  } else {
    fullText = (p.chapters||[]).map(c=>c.content).join('\n\n');
  }
  if(!fullText || fullText.length < 50){ toast('章节内容为空','error'); return; }
  _isAnalyzing = true;
  window.onbeforeunload = function(){return '分析进行中，刷新将中断分析进程';};

  try {
    clearAnalysisLog();
    // 归一化函数（用于文本匹配）
    function _norm1(t){ return t.replace(/[\uff01-\uff5e]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xfee0)).replace(/\u3000/g,' '); }
    function _norm2(t){ return t.replace(/[\s\n\r【】《》「」『』（）\[\]""''，。、；：？！·—…\.,;:!?'"\(\)\[\]]/g,''); }

    // ─── 第1步：询问 LLM 上下文能力 ───
    toast('🔍 第1步：探测模型能力...');
    logAnalysis('第1步', '探测模型上下文能力', '');
    const contextResponse = await callLLM([
      {role:'user', content:'请简要回答：你的上下文 Token 上限是多少？建议每次输入的 Token 数在什么范围最优？回答格式如："上限100K，最优30K-50K"。'}
    ], {max_tokens:200, temperature:0.1});
    logAnalysis('第1步 回复', '', contextResponse);

    // 解析最优区间，决定分批策略
    const nums = contextResponse.match(/(\d+)\s*K/g);
    let optimalMax = 50000; // 默认最优上限 50K
    if(nums){
      const vals = nums.map(n=>parseInt(n)*1000);
      const sorted = vals.sort((a,b)=>a-b);
      // 取最优区间的上限作为分批依据
      if(sorted.length >= 2) optimalMax = sorted[Math.floor(sorted.length/2)];
      else optimalMax = Math.min(sorted[0], 64000);
    }
    const totalTokens = estimateTokens(fullText);
    logAnalysis('配置', '文档约 '+Math.round(totalTokens/1000)+'K，最优上限 '+Math.round(optimalMax/1000)+'K', '');

    // 检查是否远超模型容量（>80%），自动分割为多部处理
    const maxContext = Math.max(...(nums||[]).map(n=>parseInt(n)*1000), 128000);
    if(totalTokens > maxContext * 0.8){
      const numParts = Math.ceil(totalTokens / (maxContext * 0.75));
      const partSize = Math.ceil(fullText.length / numParts);
      toast(`📚 文档较长（${Math.round(totalTokens/1000)}K），自动分割为 ${numParts} 部分分别处理`);
      logAnalysis('配置', `超出80%容量，分割为 ${numParts} 部分`, `每部分约 ${Math.round(totalTokens/numParts/1000)}K`);

      // 按顺序分割文本
      const textParts = [];
      for(let i=0; i<numParts; i++){
        const start = i * partSize;
        const end = (i+1 < numParts) ? (i+1)*partSize : fullText.length;
        textParts.push(fullText.substring(start, end).trim());
      }

      // 逐部分处理
      let allChapters = [];
      let allWorldTrees = [];
      let allCharacters = {};
      let allRhythms = [];

      for(let pi=0; pi<textParts.length; pi++){
        const partLabel = '第' + ['一','二','三','四','五','六','七','八','九','十'][pi] + '部分';
        toast(`📖 正在处理${partLabel}（${pi+1}/${textParts.length}）...`);
        logAnalysis('第2步', `处理${partLabel}`, `约 ${Math.round(estimateTokens(textParts[pi])/1000)}K`);

        // 每部分的独立对话
        const partConv = [{role:'system', content:'你是一个耐心的小说读者。我会分批发送小说章节给你阅读，你读完每批后只需回复"已读"即可。等我发出分析指令时，再基于所有已读内容做分析。'}];
        const partFull = textParts[pi];

        // 阅读此部分
        if(estimateTokens(partFull) <= optimalMax){
          partConv.push({role:'user', content:'请阅读以下' + partLabel + '内容，读完后回复"已读"：\n\n' + partFull});
          const readReply = await callLLMWithVerify(partConv, {max_tokens:100, temperature:0.1}, {
            validator: r => /已读/.test(r),
            retryPrompt: '请回复"已读"以确认你已经阅读了以上内容。只回复"已读"两个字。',
            maxRetries: 5
          });
          partConv.push({role:'assistant', content: readReply.substring(0,100)});
        } else {
          const subLimit = Math.floor(optimalMax * 0.9);
          const subParts = Math.ceil(estimateTokens(partFull) / subLimit);
          const subSize = Math.ceil(partFull.length / subParts);
          for(let si=0; si<subParts; si++){
            const ss = si * subSize;
            const se = (si+1 < subParts) ? (si+1)*subSize : partFull.length;
            partConv.push({role:'user', content:'请阅读以下' + partLabel + '第'+(si+1)+'/'+subParts+'部分内容，读完后回复"已读"：\n\n' + partFull.substring(ss, se).trim()});
            const subReply = await callLLMWithVerify(partConv, {max_tokens:100, temperature:0.1}, {
              validator: r => /已读/.test(r),
              retryPrompt: '请回复"已读"以确认你已经阅读了以上内容。只回复"已读"两个字。',
              maxRetries: 5
            });
            partConv.push({role:'assistant', content:subReply.substring(0,200)});
          }
        }
        // 验证阅读是否成功
        const lastAsst = partConv.filter(m=>m.role==='assistant').slice(-1)[0];
        if(!lastAsst || !lastAsst.content || lastAsst.content.trim().length === 0){
          // assistant response was empty, continue processing anyway
        }

        // 对此部分进行章节拆分（复用已阅读的对话，LLM 已记住全文）
        toast(`📑 ${partLabel}：正在识别章节...`);
        partConv.push({role:'user', content:'现在请切换为章节分析模式。根据你刚才阅读的' + partLabel + '全部内容，逐条发送章节信息。对每章提供：章节编号、章节标题、该章开头一段独特原文文字（20-40字）、该章结尾一段独特原文文字（20-40字）。\n\n格式：\n第1章 | 完整标题 | 【章首】开头20-40字原文 | 【章尾】结尾20-40字原文\n\n注意：【章首】和【章尾】后面的文字必须是原文中的原句，不要改写。\n默认情况下，文章开头就是第一章。\n\n请一条条发，我收到后会划分并保存该章，然后回复"已存档，划分好章节，请发下一条"。全部发完后请回复"所有章节已发完"。'});
        // 保存对话到磁盘
        saveFileToDisk(name, 'projectLog', `对话记录_${partLabel}_第3步.json`, partConv);

        // 对每部分的章节进行匹配切分
        let partSearchFrom = 0;
        const n1Part = _norm1(partFull);
        const n2Part = _norm2(n1Part);
        let partDone = false;
        let partTries = 0;
        while(!partDone && partTries < 50){
          partTries++;
          const preply = await callLLMWithVerify(partConv, {max_tokens:1024, temperature:0.1}, {
            validator: r => r.length > 10 && !/^我无法/.test(r),
            retryPrompt: '请根据你刚才阅读的内容发送章节信息。如果你无法确定章节划分，请根据原文中的（０１）（０２）等标记或章节标题来划分。格式：第1章 | 标题 | 【章首】原文 | 【章尾】原文',
            maxRetries: 5
          });
          // 每次LLM回复后保存对话到磁盘
          saveFileToDisk(name, 'projectLog', `对话记录_${partLabel}_第3步.json`, partConv);
          if(/所有章节已发完/.test(preply)){ partDone = true; break; }

          for(const line of preply.split('\n')){
            const p = line.split('|').map(s=>s.trim());
            const nm = p[0] && p[0].match(/(\d+)/);
            if(p.length<4 || !nm) continue;
            const oi=p[2].indexOf('【章首】'); const ot=oi>=0?p[2].substring(oi+4).trim():'';
            const ci=p[3].indexOf('【章尾】'); const ct=ci>=0?p[3].substring(ci+4).trim():'';
            if(ot.length<=5||ct.length<=5) continue;

            const no=_norm1(ot); let si=n1Part.indexOf(no, partSearchFrom);
            if(si<0){ const n2o=_norm2(no).replace(/[\s]/g,'').substring(0,15); if(n2o.length>=3){const b=n2Part.indexOf(n2o);if(b>=0){let c=0;for(let j=0;j<n1Part.length;j++){if(!/[\s\n\r【】《》「」『』（）\[\]""''，。、；：？！·—…\.,;:!?'"\(\)\[\]]/.test(n1Part[j]))c++;if(c>b){si=j;break}}}}}
            if(si<0) continue;
            const nc=_norm1(ct); let ei=n1Part.indexOf(nc, si+1);
            if(ei<0){ const n2c=_norm2(nc).replace(/[\s]/g,'').substring(0,15); if(n2c.length>=3){const b=n2Part.indexOf(n2c);if(b>=0){let c=0;for(let j=0;j<n1Part.length;j++){if(!/[\s\n\r【】《》「」『』（）\[\]""''，。、；：？！·—…\.,;:!?'"\(\)\[\]]/.test(n1Part[j]))c++;if(c>b){ei=j;break}}}}}
            if(ei<0) continue;

            const ep=ei+nc.length; const num=parseInt(nm[1]);
            const content=partFull.substring(si,ep).trim();
            if(content.length>50){
              // 全局章节号 = 已存章节数 + 1
              const gNum = allChapters.length + 1;
              const fname='chapter_'+String(gNum).padStart(3,'0')+'.md';
              p.folders.chapters.push({file:fname,content});
              saveFileToDisk(name,'chapters',fname,content);
              allChapters.push({number:gNum, title:partLabel+'-'+num, content, status:'draft', created_at:new Date().toISOString()});
              partSearchFrom=ep;
              partConv.push({role:'assistant',content:'已存档，划分好章节，请发下一条'});
              break;
            }
          }
        }

        // 对此部分进行多轮分析
        toast(`🧠 ${partLabel}：正在分析...`);
        // 逐章阅读体验
        partConv.push({role:'user', content:'你已读完了' + partLabel + '的全部内容。请以一位普通读者的身份，逐章给出阅读体验。对每章回答：阅读吸引力(1-10)、情感浓度(1-10)、作用标签(引入/铺垫/冲突/转折/高潮/收尾/过渡/揭秘)。用自然语言回答。'});
        let pr = await callLLM(partConv, {max_tokens:2048, temperature:0.7});
        logAnalysis('第4步-'+partLabel+'-第1轮', '阅读体验', pr.substring(0,300));
        partConv.push({role:'assistant', content:pr.substring(0,1000)});
        saveFileToDisk(name, 'projectLog', `分析报告_${partLabel}_第1轮_阅读体验.md`, pr);

        // 故事结构
        partConv.push({role:'user', content:'分析' + partLabel + '的故事结构：1. 主线脉络，列出关键事件节点，标注章节和重要性(1-10)。2. 正在发展的支线。3. 未揭晓的伏笔。4. 独特世界观设定。用自然语言回答。'});
        pr = await callLLM(partConv, {max_tokens:2048, temperature:0.7});
        logAnalysis('第4步-'+partLabel+'-第2轮', '故事结构', pr.substring(0,300));
        partConv.push({role:'assistant', content:pr.substring(0,1000)});
        saveFileToDisk(name, 'projectLog', `分析报告_${partLabel}_第2轮_故事结构.md`, pr);

        // 角色印象
        partConv.push({role:'user', content:'识别' + partLabel + '中所有角色。对每个角色：一句话评价、最大特点、应对困难的方式、做决定风格、最在意和最怕什么、和谁亲近和谁冲突。用自然语言回答。'});
        pr = await callLLM(partConv, {max_tokens:2048, temperature:0.7});
        logAnalysis('第4步-'+partLabel+'-第3轮', '角色印象', pr.substring(0,300));
        partConv.push({role:'assistant', content:pr.substring(0,1000)});
        saveFileToDisk(name, 'projectLog', `分析报告_${partLabel}_第3轮_角色印象.md`, pr);
      }

      // 所有部分处理完毕，合并结果
      p.chapters = allChapters;
      toast(`✅ 全部分析完成！共 ${allChapters.length} 章`);
      logAnalysis('✅ 完成', `共 ${allChapters.length} 章，${textParts.length} 部分合并`, '');
      _isAnalyzing = false; window.onbeforeunload = null;
      return;
    }

    // 文档在容量范围内，正常处理
    let batches = [];
    const conversation = [{role:'system', content:'你是一个耐心的小说读者。我会分批发送小说章节给你阅读，你读完每批后只需回复"已读"即可。等我发出分析指令时，再基于所有已读内容做分析。'}];
    if(totalTokens <= optimalMax){
      // 在最优范围内，整篇发送
      batches = [fullText];
      // 存入磁盘
      if(fullText.length > 50){
        p.folders.chapters.push({file:'full_text.md', content:fullText});
        saveFileToDisk(name, 'chapters', 'full_text.md', fullText);
      }
      logAnalysis('第2步', '文档在最优范围内，整篇发送（'+Math.round(totalTokens/1000)+'K）', '');
    } else {
      // 超出最优范围，按最优上限的 90% 等分
      const partLimit = Math.floor(optimalMax * 0.9);
      const numParts = Math.ceil(totalTokens / partLimit);
      const partSize = Math.ceil(fullText.length / numParts);
      for(let i=0; i<numParts; i++){
        const start = i * partSize;
        const end = (i+1 < numParts) ? (i+1)*partSize : fullText.length;
        const part = fullText.substring(start, end).trim();
        batches.push(part);
        // 切分后的文档也存入磁盘
        if(part.length > 50){
          p.folders.chapters.push({file:`part_${String(i+1).padStart(3,'0')}.md`, content:part});
          saveFileToDisk(name, 'chapters', `part_${String(i+1).padStart(3,'0')}.md`, part);
        }
      }
      logAnalysis('第2步', '超出最优范围，等分为 '+batches.length+' 批（每批约 '+Math.round(partLimit/1000)+'K）', '');
    }
    for(let i=0; i<batches.length; i++){
      toast(`📖 第${i+1}/${batches.length}批：阅读中...`);
      const preview = batches[i].substring(0,80).replace(/\n/g,' ');
      conversation.push({role:'user', content:'请阅读以下第'+(i+1)+'/'+batches.length+'部分内容，读完后回复"已读"：\n\n'+batches[i]});
      const reply = await callLLMWithVerify(conversation, {max_tokens:100, temperature:0.1}, {
        validator: r => /已读/.test(r),
        retryPrompt: '请回复"已读"以确认你已经阅读了以上内容。只回复"已读"两个字。',
        maxRetries: 8
      });
      // 检查 LLM 是否返回空（超长文本/API错误）
      if(!reply || reply.trim().length === 0){
        throw new Error('第2步阅读失败：LLM 返回空内容，文本可能超出模型容量限制');
      
    // ─── 第3步前验证阅读是否成功 ───
    // 检查最后一条 assistant 回复是否为空
    const lastAssistant = conversation.filter(m=>m.role==='assistant').slice(-1)[0];
    if(!lastAssistant || !lastAssistant.content || lastAssistant.content.trim().length === 0){
      throw new Error('LLM 未能正确阅读全文，请检查文本长度是否超出模型能力，或 API Key 是否有效');
    }

    // ─── 第3步：逐条获取→立即匹配分割（复用已阅读对话，LLM已记住全文）───
    toast('📑 正在逐条获取章节标记...');
    logAnalysis('第3步', '逐条获取章节标记', '');
    conversation.push({role:'user', content:'现在请切换为章节分析模式。根据你刚才阅读的全文，逐条发送章节信息。对每章提供：章节编号、章节标题、该章开头一段独特原文文字（20-40字）、该章结尾一段独特原文文字（20-40字）。\n\n格式如下：\n第1章 | 完整标题 | 【章首】该章开头20-40字原文 | 【章尾】该章结尾20-40字原文\n\n注意：【章首】和【章尾】后面的文字必须是原文中的原句，不要改写。\n默认情况下，文章开头就是第一章，除非作者明确写明是序章，遇到序章的情况直接把文章开头作为第一章，后面的第一章作为第二章，以此类推。\n\n请一条条发，我收到后会划分并保存该章，然后回复"已存档，划分好章节，请发下一条"。你收到确认后再发下一条。全部发完后请回复"所有章节已发完"。'});
    // 保存对话到磁盘
    saveFileToDisk(name, 'projectLog', '对话记录_第3步.json', conversation);
    const chMarks = [];
    // 归一化函数
    function _norm1(t){ return t.replace(/[\uff01-\uff5e]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xfee0)).replace(/\u3000/g,' '); }
    function _norm2(t){ return t.replace(/[\s\n\r【】《》「」『』（）\[\]""''，。、；：？！·—…\.,;:!?'"\(\)\[\]]/g,''); }
    const n1Full = _norm1(fullText);
    const n2Full = _norm2(n1Full);
    let searchFrom = 0;
    let step3Done = false;
    let step3Tries = 0;
    while(!step3Done && step3Tries < 100){
      step3Tries++;
      const reply = await callLLMWithVerify(conversation, {max_tokens:1024, temperature:0.1}, {
        validator: r => r.length > 10 && !/^我无法/.test(r),
        retryPrompt: '请根据你刚才阅读的全文发送章节信息。如果你无法确定章节划分，请根据原文中的（０１）（０２）等标记或章节标题来划分。格式：第1章 | 标题 | 【章首】原文 | 【章尾】原文',
        maxRetries: 5
      });
      // 每次LLM回复后保存对话到磁盘
      saveFileToDisk(name, 'projectLog', '对话记录_第3步.json', conversation);
      logAnalysis('第3步 回复', '', reply.substring(0,300));
      if(/所有章节已发完|已全部|没有更多/.test(reply)){ step3Done = true; break; }

      // 解析：第N章 | 标题 | 【章首】开头 | 【章尾】结尾
      let matchedAny = false;
      for(const line of reply.split('\n')){
        const parts = line.split('|').map(s=>s.trim());
        const numMatch = parts[0] && parts[0].match(/(\d+)/);
        if(parts.length < 4 || !numMatch) continue;
        const zsIdx = parts[2].indexOf('【章首】');
        const openText = zsIdx>=0 ? parts[2].substring(zsIdx+4).trim() : '';
        const zwIdx = parts[3].indexOf('【章尾】');
        const closeText = zwIdx>=0 ? parts[3].substring(zwIdx+4).trim() : '';
        if(openText.length<=5 || closeText.length<=5) continue;

        // 定位章首
        const n1Open = _norm1(openText);
        let sIdx = n1Full.indexOf(n1Open, searchFrom);
        if(sIdx < 0){
          const n2O = _norm2(n1Open).replace(/[\s]/g,'').substring(0,15);
          if(n2O.length>=3){
            const b = n2Full.indexOf(n2O);
            if(b>=0){ let c=0; for(let j=0;j<n1Full.length;j++){if(!/[\s\n\r【】《》「」『』（）\[\]""''，。、；：？！·—…\.,;:!?'"\(\)\[\]]/.test(n1Full[j]))c++;if(c>b){sIdx=j;break}} }
          }
        }
        if(sIdx < 0) continue;

        // 定位章尾
        const n1Close = _norm1(closeText);
        let eIdx = n1Full.indexOf(n1Close, sIdx+1);
        if(eIdx < 0){
          const n2C = _norm2(n1Close).replace(/[\s]/g,'').substring(0,15);
          if(n2C.length>=3){
            const b = n2Full.indexOf(n2C);
            if(b>=0){ let c=0; for(let j=0;j<n1Full.length;j++){if(!/[\s\n\r【】《》「」『』（）\[\]""''，。、；：？！·—…\.,;:!?'"\(\)\[\]]/.test(n1Full[j]))c++;if(c>b){eIdx=j;break}} }
          }
        }
        if(eIdx < 0) continue;

        // 保存章节
        const endPos = eIdx + n1Close.length;
        const number = parseInt(numMatch[1]);
        const title = parts[1]||'';
        const content = fullText.substring(sIdx, endPos).trim();
        if(content.length > 50){
          const fname = 'chapter_'+String(number).padStart(3,'0')+'.md';
          p.folders.chapters.push({file:fname,content});
          saveFileToDisk(name,'chapters',fname,content);
          chMarks.push({number,title,openText});
          logAnalysis('第3步 保存',`第${number}章`,`位置 ${sIdx}-${endPos}`);
          searchFrom = endPos;
          matchedAny = true;
          conversation.push({role:'assistant',content:'已存档，划分好章节，请发下一条'});
          break;
        }
      }
      if(!matchedAny){
        conversation.push({role:'assistant', content:'我无法根据你发送的信息划分章节，请发送更多章节信息以供匹配，或者请自行划分清晰的章节信息。如果不需要划分章节了，请发送所有章节已发完'});
      }
    }

    logAnalysis('第3步 完成', `共 ${chMarks.length} 章`, '');
    // 构建 p.chapters
    if(chMarks.length > 0){
      p.chapters = [];
      p.folders.chapters = p.folders.chapters.filter(f=>!f.file || !/^chapter_\d{3}\.md$/.test(f.file));
      for(const cm of chMarks){
        const fname = 'chapter_'+String(cm.number).padStart(3,'0')+'.md';
        const content = await readFileFromDisk(name, 'chapters', fname);
        if(content){
          p.chapters.push({number:cm.number, title:cm.title, content, status:'draft', created_at:new Date().toISOString()});
          p.folders.chapters.push({file:fname, content});
        }
      }
      p.chapters.sort((a,b)=>a.number-b.number);
      toast(`✅ 已分割为 ${p.chapters.length} 章`);
      logAnalysis('第3步', '章节分割完成', `共 ${p.chapters.length} 章`);
    } else {
      if(fullText && fullText.length > 50){
        p.chapters = [{number:1, title:'', content:fullText, status:'draft', created_at:new Date().toISOString()}];
        p.folders.chapters.push({file:'chapter_001.md', content:fullText});
        saveFileToDisk(name, 'chapters', 'chapter_001.md', fullText);
      }
    }
    const marksJson = JSON.stringify(chMarks, null, 2);
    p.folders.chapters.push({file:'chapter_marks.json', content:marksJson});
    saveFileToDisk(name, 'chapters', 'chapter_marks.json', marksJson);

    // ─── 第4步：多轮分析 ───
    toast('🧠 第1轮：逐章阅读体验...');
    logAnalysis('第4步-第1轮', '逐章阅读体验', '');
    conversation.push({role:'user', content:'你已读完了整部小说的全部内容。现在请以一位普通读者的身份，逐章给出阅读体验。对每章回答：阅读吸引力(1-10)、情感浓度(1-10)、作用标签(引入/铺垫/冲突/转折/高潮/收尾/过渡/揭秘)。用自然语言回答，不必JSON。'});
    let r1 = await callLLM(conversation, {max_tokens:4096, temperature:0.7});
    logAnalysis('第1轮 回复', '', r1.substring(0,500));
    conversation.push({role:'assistant', content:r1.substring(0,2000)});
    saveFileToDisk(name, 'projectLog', '分析报告_第1轮_逐章阅读体验.md', r1);

    toast('🧠 第2轮：故事结构...');
    logAnalysis('第4步-第2轮', '故事结构分析', '');
    conversation.push({role:'user', content:'接下来分析故事结构：1. 主线脉络，按顺序列出关键事件节点，标注章节和重要性(1-10)。2. 有哪些正在发展的支线，标注始于哪章、当前进展、与主线关联度(1-10)。3. 作者埋了哪些还没揭晓的伏笔，按读者最想知道的迫切程度排序。4. 世界观有什么独特设定？用自然语言回答。'});
    let r2 = await callLLM(conversation, {max_tokens:4096, temperature:0.7});
    logAnalysis('第2轮 回复', '', r2.substring(0,500));
    conversation.push({role:'assistant', content:r2.substring(0,2000)});
    saveFileToDisk(name, 'projectLog', '分析报告_第2轮_故事结构.md', r2);

    toast('🧠 第3轮：角色印象...');
    logAnalysis('第4步-第3轮', '角色印象分析', '');
    conversation.push({role:'user', content:'请识别出故事中所有出现过的角色，一个都不要漏。对每个角色标注ta是主角、反派、配角还是主要角色。然后逐一给出：一句话评价、最大特点（举例）、遇到困难时的应对方式、做决定时的风格、倾向稳赚还是冒险、最在意什么和最怕什么、和谁亲近和谁冲突、言行是否一致（有没有出人意料的行为，是否合理）、如果要让ta做违背本性的事需要什么前提。用自然语言回答。'});
    let r3 = await callLLM(conversation, {max_tokens:8192, temperature:0.7});
    logAnalysis('第3轮 回复', '', r3.substring(0,500));
    conversation.push({role:'assistant', content:r3.substring(0,3000)});
    saveFileToDisk(name, 'projectLog', '分析报告_第3轮_角色印象.md', r3);

    toast('🧠 第4轮：整体感受...');
    logAnalysis('第4步-第4轮', '整体感受', '');
    conversation.push({role:'user', content:'现在给出整体感受：1. 目前节奏感觉如何（太平/有点慢/正好/偏快）？2. 读完你最想知道的三件事，按迫切程度排序。3. 如果下一章让你来写，你希望看到什么？4. 有什么想提醒作者注意的？用自然语言回答。'});
    let r4 = await callLLM(conversation, {max_tokens:2048, temperature:0.7});
    logAnalysis('第4轮 回复', '', r4.substring(0,300));
    conversation.push({role:'assistant', content:r4.substring(0,1000)});
    saveFileToDisk(name, 'projectLog', '分析报告_第4轮_整体感受.md', r4);

    toast('🧠 第5轮：写作技能评价...');
    logAnalysis('第4步-第5轮', '写作技能评价', '');
    conversation.push({role:'user', content:'最后，请以资深编辑的视角评价这部小说：1. 本文写得好的地方（优点，举例说明）。2. 本文的不足之处（缺点，举例说明并提出改进建议）。3. 给作者的综合建议（1-2条最核心的）。用自然语言回答。'});
    let r5 = await callLLM(conversation, {max_tokens:4096, temperature:0.7});
    logAnalysis('第5轮 回复', '', r5.substring(0,500));
    conversation.push({role:'assistant', content:r5.substring(0,2000)});
    saveFileToDisk(name, 'projectLog', '分析报告_第5轮_写作技能评价.md', r5);

    // ─── 第5步：综合输出 JSON ───
    toast('📋 正在整理为结构化数据...');
    logAnalysis('第5步', '输出结构化JSON', '');
    const jp1 = '{"plot_structure":{"trunk":[{"chapter":1,"event":"","importance":8}],"branches":[{"name":"","start_chapter":1,"status":"","relation":7}],"buds":[{"chapter":1,"foreshadow":"","urgency":""}],"roots":[{"chapter":1,"category":"","content":""}]}';
    const jp2 = '"characters":{"角色名":{"role":"","tag":"","traits":[],"decision_style":"","risk_attitude":"","cares_about":[],"fears":[],"bottom_line":"","relationships":{},"trust_pattern":"","conflict_style":"","consistency_issues":[],"breaking_point":"","behavioral_model":""}}';
    const jp3 = '"rhythm":{"per_chapter":[{"chapter":1,"page_turner":6,"emotion":4,"role":""}],"overall_pacing":"","top_questions":[],"next_chapter_hope":""},"memo":{"writer_advice":[],"warnings":[]},"skills":{"strengths":[{"aspect":"","examples":"","detail":""}],"weaknesses":[{"aspect":"","examples":"","detail":"","improvement":""}],"overall_advice":""}';
    conversation.push({role:'user', content:'根据以上所有分析，请输出以下JSON格式的分析结果（只输出JSON，不要其他文字）：\n{\n  '+jp1+',\n  '+jp2+',\n  '+jp3+'\n}'});
    const response = await callLLM(conversation, {max_tokens:65536, temperature:0.3});
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if(!jsonMatch) throw new Error('LLM 返回格式异常');
    const data = JSON.parse(jsonMatch[0]);
    logAnalysis('JSON', '解析成功，含: ' + Object.keys(data).join(', '), '');
    p.readerData = data;
    p.analyzed = true;
    saveFileToDisk(name, 'projectLog', '分析报告_第5步_综合JSON.json', response);

    const finalChCount = p.chapters?.length || 1;

    // 世界树
    if(data.plot_structure){
      const ps=data.plot_structure; p.worldTree={trunk:ps.trunk||[],branches:ps.branches||[],buds:ps.buds||[],roots:ps.roots||[],metrics:{pending_buds:(ps.buds||[]).length,active_branches:(ps.branches||[]).length,growth_health:0.6}};
      p.folders.worldTreeData={world_tree_json:JSON.stringify(p.worldTree)};
      p.folders.fuzzyMemory['世界树报告.md']=`# 世界树报告\n\n## 主干\n${(ps.trunk||[]).map(t=>'- 第'+t.chapter+'章: '+t.event).join('\n')}\n\n## 支线\n${(ps.branches||[]).map(b=>'- '+b.name+': '+b.status).join('\n')}\n\n## 伏笔\n${(ps.buds||[]).map(b=>'- 第'+b.chapter+'章 ['+b.urgency+']: '+b.foreshadow).join('\n')}`;
    }

    // 角色
    if(data.characters) for(const[nm,info] of Object.entries(data.characters)){
      let cid=null; for(const[id,cd] of Object.entries(p.characters||{})) if(cd.name===nm){cid=id;break}
      if(!cid){cid='char_'+String(Object.keys(p.characters||{}).length+1).padStart(3,'0'); if(!p.characters) p.characters={}; p.characters[cid]={name:nm,role:'未知',current_location:'未知',emotional_state:'平静'};}
      Object.assign(p.characters[cid],{role:info.role,reader_tag:info.tag,traits:info.traits,decision_style:info.decision_style,risk_attitude:info.risk_attitude,cares_about:info.cares_about,fears:info.fears,bottom_line:info.bottom_line,relationships:info.relationships,trust_pattern:info.trust_pattern,conflict_style:info.conflict_style,consistency_issues:info.consistency_issues,breaking_point:info.breaking_point,behavioral_model:info.behavioral_model});
      p.folders.characterProfiles[nm+'_读者印象.md']='# '+nm+' 读者印象\n\n'+(info.tag||'')+'\n\n## 角色定位\n'+(info.role||'')+'\n\n## 特点\n'+(info.traits||[]).map(t=>'- '+t).join('\n')+'\n\n## 行事风格\n'+(info.decision_style||'')+'\n\n## 风险态度\n'+(info.risk_attitude||'')+'\n\n## 在意\n'+(info.cares_about||[]).join('、')+'\n\n## 害怕\n'+(info.fears||[]).join('、')+'\n\n## 底线\n'+(info.bottom_line||'')+'\n\n## 关系\n'+Object.entries(info.relationships||{}).map(([k,v])=>'- '+k+': '+v).join('\n')+'\n\n## 信任模式\n'+(info.trust_pattern||'')+'\n\n## 冲突处理\n'+(info.conflict_style||'')+'\n\n## 一致性问题\n'+(info.consistency_issues||[]).map(i=>'- ⚠️ '+i).join('\n')+'\n\n## 突破底线\n'+(info.breaking_point||'')+'\n\n## 行为模型\n'+(info.behavioral_model||'');
    }

    // 节奏
    if(data.rhythm){p.rhythm=data.rhythm;p.tensions=(data.rhythm.per_chapter||[]).map(c=>({chapter:c.chapter,level:((c.page_turner||5)+(c.emotion||5))/2,phase:c.role||'未知'}));p.folders.tensionReports['读者节奏报告.md']='# 读者节奏报告\n\n## 逐章数据\n'+(data.rhythm.per_chapter||[]).map(c=>'- 第'+c.chapter+'章: 吸引力'+c.page_turner+'/10 情感'+c.emotion+'/10 作用:'+c.role).join('\n')+'\n\n## 整体\n'+(data.rhythm.overall_pacing||'')+'\n\n## 读者最想知道\n'+(data.rhythm.top_questions||[]).map((q,i)=>(i+1)+'. '+q).join('\n');}

    // 备忘录 & 技能
    if(data.memo) p.writerMemo=data.memo;
    if(data.skills){p.skills=data.skills;p.folders.skills=p.folders.skills||{external:[],self:[]};const sk=[];(data.skills.strengths||[]).forEach(s=>{sk.push('## 优点: '+s.aspect+'\n\n示例: '+(s.examples||'')+'\n\n'+(s.detail||''));});(data.skills.weaknesses||[]).forEach(w=>{sk.push('## 不足: '+w.aspect+'\n\n示例: '+(w.examples||'')+'\n\n'+(w.detail||'')+'\n\n改进建议: '+(w.improvement||''));});if(data.skills.overall_advice) sk.push('## 综合建议\n\n'+data.skills.overall_advice);p.folders.skills.self=sk;}

    p.folders.fuzzyMemory['模糊记忆上下文.md']='# 模糊记忆上下文\n\n分析时间: '+new Date().toLocaleString()+'\n\n共 '+finalChCount+' 章，已通过多轮对话完成分析。';
    saveDB();
    saveProjectFilesToDisk(name);
    // 会话结束标记
    const lockedP = getLockedProject();
    if(lockedP && DB.projects[lockedP.name]?.folders?.projectLog){
      DB.projects[lockedP.name].folders.projectLog.push({
        type:'analysis_session_end', sessionId: _currentSessionId,
        timestamp: new Date().toISOString(), time: new Date().toLocaleString()
      });
    }
    _isAnalyzing = false;
    window.onbeforeunload = null;
    toast('✅ 分析完成！'+finalChCount+'章已提取剧情/角色/节奏数据');
    logAnalysis('✅ 完成', '共 '+finalChCount+' 章，数据已保存', '');
  } catch(e){
    // 会话异常结束标记
    try {
      const lp = getLockedProject();
      if(lp && DB.projects[lp.name]?.folders?.projectLog){
        DB.projects[lp.name].folders.projectLog.push({
          type:'analysis_session_end', sessionId: _currentSessionId,
          timestamp: new Date().toISOString(), error: e.message?.substring(0,200)
        });
      }
    } catch(_){}
    window.onbeforeunload = null;
    if(e.message!=='no key'){
      logAnalysis('❌ 失败', e.message, '');
      toast('❌ 分析失败: '+e.message,'error');
      console.error(e);
    }
  }
}

// ═══════ 人类行为规律总结（写作时注入 Writer） ═══════
const WRITER_BEHAVIORAL_PRINCIPLES = `人类行为的关键规律——写作时让角色的行为真实可信：

【决策规律】
• 失去的痛苦≈得到的快乐的两倍。角色面对"确定损失"时会冒极大胆的风险去避免它
• 角色对已经投入的（时间/感情/金钱）难以割舍——即使继续投入已无意义
• 人做决定时不是在算绝对值，而是在和"参照点"比。同一个结果，对有的人是赚、对有的人是亏
• 面对收益时保守（见好就收），面对损失时冒险（赌一把翻盘）
• 人对"现在"的估值远高于"未来"。立flag容易，执行flag难
• 角色最在意的不是"得到什么"，而是"和身边的人比是多了还是少了"

【互动规律】
• 一次性相遇容易背叛（因为没有后果），长期关系容易合作（因为还要见面）
• 信任一旦被打破，需要10次合作才能修复1次背叛
• 合作的高风险需要信任机制：共同敌人、第三方担保、或长期的交情
• 双方都在赌对方先让步时，最危险——需要有非理性承诺的一方才会破局
• 人宁可得不到好处也要惩罚不公平的对待。这不是冲动，是人性深处的公平需求
• 人在社交场合和交易场合的行为逻辑完全不同——混用会出问题

【行为真实感规律】
• 任何出人意料的角色行为都需要：充分的动机 + 渐进的铺垫 + 匹配的代价
• 越反常的行为，需要的代价越大。一个好人撒个小谎不需要代价，一个忠臣叛国需要毁灭性的代价
• 反常行为的频率越低，单次反常的可信度越高
• 反常的是行为而不是价值观——底层价值观一致时，行为再反常也能被理解
• 角色做了反常的事之后，要有"事后反应"——愧疚、合理化、恐惧或解脱。没有后果的反常就是硬伤
• 角色的成长弧需要：旧信念→事件冲击→反思→新认知→新行为。跳过任何一步都会显得生硬`;

// ═══════ 写作上下文组装 ═══════
function getWriterContext(projectName){
  const p = DB.projects[projectName];
  if(!p) return '';

  let context = '';

  // 1. 世界树数据
  const wt = p.worldTree;
  if(wt && wt.trunk && wt.trunk.length){
    context += `【当前故事进展】\n主线已推进到以下节点：\n`;
    context += (wt.trunk||[]).map(t=>`· ${wt.trunk.indexOf(t)+1}. 第${t.chapter}章：${t.event}（重要性${t.importance}）`).join('\n') + '\n';
    if(wt.buds && wt.buds.length){
      const urgent = wt.buds.filter(b=>b.urgency==='高');
      if(urgent.length){
        context += `\n读者最想揭晓的伏笔：\n${urgent.map(b=>`· 第${b.chapter}章埋下：${b.foreshadow}`).join('\n')}\n`;
      }
    }
    context += '\n';
  }

  // 2. 角色行为模型
  const chars = p.readerData?.characters || p.characters || {};
  const charValues = Object.values(chars).filter(c=>c.name);
  if(charValues.length){
    context += `【角色行为模型——写作时必须严格遵守】\n`;
    charValues.forEach(ch=>{
      context += `\n【${ch.name}】${ch.reader_tag||ch.tag||''}\n`;
      if(ch.behavioral_model){
        context += `行为模式：${ch.behavioral_model}\n`;
      } else {
        // 如果没有behavioral_model（旧数据），从已有字段合成
        const parts = [];
        if(ch.decision_style) parts.push(`做决定${ch.decision_style}`);
        if(ch.risk_attitude) parts.push(`面对得失${ch.risk_attitude}`);
        if(ch.trust_pattern) parts.push(`信任倾向：${ch.trust_pattern}`);
        if(ch.conflict_style) parts.push(`冲突处理：${ch.conflict_style}`);
        if(ch.bottom_line) parts.push(`底线：${ch.bottom_line}`);
        if(ch.breaking_point) parts.push(`突破底线的条件：${ch.breaking_point}`);
        if(parts.length) context += `行为模式：${parts.join('；')}\n`;
      }
      if(ch.cares_about && ch.cares_about.length) context += `在意的：${ch.cares_about.join('、')}\n`;
      if(ch.fears && ch.fears.length) context += `恐惧的：${ch.fears.join('、')}\n`;
      if(ch.consistency_issues && ch.consistency_issues.length) context += `⚠️ 需注意的一致性：${ch.consistency_issues.join('；')}\n`;
    });
    context += '\n';
  }

  // 3. 节奏上下文
  const rhythm = p.rhythm || p.readerData?.rhythm;
  if(rhythm){
    context += `【当前阅读节奏】\n`;
    context += `整体节奏：${rhythm.overall_pacing||'未知'}\n`;
    if(rhythm.top_questions && rhythm.top_questions.length){
      context += `读者最想知道：${rhythm.top_questions.slice(0,3).map((q,i)=>`${i+1}、${q}`).join(' ')}\n`;
    }
    if(rhythm.next_chapter_hope) context += `读者对下一章的期待：${rhythm.next_chapter_hope}\n`;
    context += '\n';
  }

  // 4. 写作备忘录
  const memo = p.writerMemo || p.readerData?.memo;
  if(memo){
    if(memo.writer_advice && memo.writer_advice.length){
      context += `【写作建议】\n${memo.writer_advice.map(a=>`· ${a}`).join('\n')}\n\n`;
    }
    if(memo.warnings && memo.warnings.length){
      context += `【⚠️ 警告】\n${memo.warnings.map(w=>`· ⚠️ ${w}`).join('\n')}\n\n`;
    }
  }

  return context;
}

function renderTabs(){
  document.querySelectorAll('.nav-btn').forEach(b=>{
    const key = b.dataset.page;
    b.classList.toggle('active',key===currentPage);
  });
}

// ═══════ 模态对话框 ═══════
function showModal(html, buttons){
  const content = document.getElementById('modalContent');
  content.innerHTML = html;
  if(buttons){
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';
    buttons.forEach(b=>{
      const btn = document.createElement('button');
      btn.className = 'btn ' + (b.cls||'btn-secondary');
      btn.textContent = b.text;
      btn.onclick = b.fn;
      btnGroup.appendChild(btn);
    });
    content.appendChild(btnGroup);
  }
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal(){document.getElementById('modalOverlay').classList.remove('show')}

// ═══════ 章节展开/折叠（写作台用） ═══════
function toggleChapters(){
  const body = document.getElementById('chaptersBody');
  const icon = document.getElementById('chToggleIcon');
  if(!body || !icon) return;
  const isHidden = body.style.display === 'none';
  body.style.display = isHidden ? 'block' : 'none';
  icon.textContent = isHidden ? '▼' : '▶';
}
function toggleChapter(num){
  const body = document.getElementById('chBody_'+num);
  const icon = document.getElementById('chIcon_'+num);
  if(!body || !icon) return;
  const isHidden = body.style.display === 'none';
  body.style.display = isHidden ? 'block' : 'none';
  icon.textContent = isHidden ? '▲ 收起' : '▶ 展开';
}

// ═══════ 章节弹窗 ═══════
function showChapterModal(chapterNum){
  const locked = getLockedProject();
  if(!locked){toast('请先锁定项目','error');return}
  const p = DB.projects[locked.name];
  let ch = (p.chapters||[]).find(c=>c.number===chapterNum);
  if(!ch){
    // 尝试从磁盘读取
    const fname = 'chapter_'+String(chapterNum).padStart(3,'0')+'.md';
    readFileFromDisk(locked.name, 'chapters', fname).then(content=>{
      if(content){
        const safe = content.replace(/[<>&`]/g,function(c){var r={'<':'&lt;','>':'&gt;','&':'&amp;','`':'&#96;'};return r[c]||c;}).replace(/\$\{/g,'&#36;&#123;');
        showModal('<h3>📖 第'+chapterNum+'章</h3><div style="font-size:13px;line-height:1.8;white-space:pre-wrap;max-height:55vh;overflow-y:auto;background:rgba(0,0,0,.2);padding:12px;border-radius:8px">'+safe+'</div>',
          [{text:'✕ 关闭',cls:'btn-secondary',fn:closeModal}]);
      } else { toast(`第${chapterNum}章内容不存在`,'error'); }
    });
    return;
  }
  const content = ch.content || '(空)';
  // 转义 HTML 和模板字符串特殊字符
  const safe = content.replace(/[<>&`]/g,function(c){
    return {'<':'&lt;','>':'&gt;','&':'&amp;','`':'&#96;'}[c]||c;
  }).replace(/\$\{/g,'&#36;&#123;');
  showModal(`<h3>📖 第${chapterNum}章</h3>
    <div style="font-size:13px;line-height:1.8;white-space:pre-wrap;max-height:55vh;overflow-y:auto;background:rgba(0,0,0,.2);padding:12px;border-radius:8px">${safe}</div>`,
    [{text:'✕ 关闭',cls:'btn-secondary',fn:closeModal}]
  );
}

// ─── 全局常量 ───
const DIM_KEYS = ['plot','character','dialogue','pacing','style','consistency','emotional_impact','originality','readability','ai_detection_risk','character_psychology','social_dynamics','exceptional_authenticity'];
const DIM_NAMES = ['情节','角色','对话','节奏','文风','一致性','情感冲击','原创性','可读性','AI味检测','角色心理','角色关系','情节合理性'];
const PROVIDER_CONFIG = {
  deepseek:{label:'DeepSeek',envKey:'DEEPSEEK_API_KEY',
    models:['deepseek-v4-pro','deepseek-v4-flash'],defaultModel:'deepseek-v4-flash',
    supports:{temperature:true,max_tokens:true,thinking:true,reasoning_effort:true},
    params:{temperature:{min:0,max:2,default:1.0,step:0.05},max_tokens:{min:100,max:65536,default:8192,step:500},
      reasoning_effort:{options:['low','medium','high'],default:'medium'}}},
  openai:{label:'OpenAI',envKey:'OPENAI_API_KEY',
    models:['gpt-4o','gpt-4o-mini','gpt-4.1','o3','o4-mini'],defaultModel:'gpt-4o',
    supports:{temperature:true,max_tokens:true,reasoning_effort:true},
    params:{temperature:{min:0,max:2,default:0.7,step:0.05},max_tokens:{min:100,max:128000,default:8192,step:500},
      reasoning_effort:{options:['low','medium','high'],default:'medium'}}},
  custom:{label:'🛠️ 自定义',envKey:'CUSTOM_API_KEY',
    models:['custom-model'],defaultModel:'custom-model',
    supports:{temperature:true,max_tokens:true},
    params:{temperature:{min:0,max:2,default:0.7,step:0.05},max_tokens:{min:100,max:128000,default:4096,step:500}}},
};

// ═══════ Toast 通知 ═══════
function toast(msg, type='success'){
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// ═══════ 分析中提示 ═══════
function analyzingMsg(){
  return `<div style="text-align:center;padding:60px 20px">
    <div style="font-size:48px;margin-bottom:16px">🔍</div>
    <div style="font-size:18px;font-weight:600;color:var(--cyan);margin-bottom:8px">AI 分析进行中...</div>
    <div style="font-size:13px;color:var(--text-dim)">分析完成后数据将自动更新，请稍候</div>
  </div>`;
}

// ═══════ 分析日志（存入项目历史日志） ═══════
let _analysisLogEntries = [];
let _currentSessionId = null;
function logAnalysis(round, question, answer){
  const entry = {
    round, question: question.substring(0,200),
    answer: (answer||'(等待回复...)').substring(0,1000),
    time: new Date().toLocaleTimeString(),
    sessionId: _currentSessionId
  };
  _analysisLogEntries.push(entry);
  // 同时存入项目日志
  const locked = getLockedProject();
  if(locked){
    const p = DB.projects[locked.name];
    if(p && p.folders?.projectLog){
      p.folders.projectLog.push({
        type:'analysis_log', round, question:question.substring(0,200),
        answer:(answer||'').substring(0,1000), timestamp:new Date().toISOString(),
        sessionId: _currentSessionId
      });
    }
  }
}
function clearAnalysisLog(){
  _currentSessionId = Date.now();
  _analysisLogEntries = [];
  // 在 projectLog 中写入会话开始标记
  const locked = getLockedProject();
  if(locked){
    const p = DB.projects[locked.name];
    if(p && p.folders?.projectLog){
      p.folders.projectLog.push({
        type:'analysis_session_start', sessionId: _currentSessionId,
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleString()
      });
    }
  }
}

// ═══════ 世界树页面 ═══════
renderers.worldtree = function(){
  const main = document.getElementById('page-worldtree');
  const side = document.getElementById('page-worldtree-side');
  const locked = getLockedProject();
  if(!locked){main.innerHTML=lockedMsg();side.innerHTML='';return}
  if(_isAnalyzing){main.innerHTML=analyzingMsg();side.innerHTML='';return}
  const p = DB.projects[locked.name];
  const rd = p?.readerData?.plot_structure;
  const wt = p?.worldTree;
  const hasData = (rd && (rd.trunk?.length||rd.branches?.length||rd.buds?.length||rd.roots?.length)) || 
                  (wt && (wt.trunk?.length||wt.branches?.length||wt.buds?.length||wt.roots?.length));
  if(!hasData){
    main.innerHTML = `<div class="page-title">🌳 世界树</div><div class="empty-state"><p>暂无剧情数据</p><p style="font-size:12px;color:var(--text-dim);margin-top:8px">请在项目管理中对项目执行「分析」后查看</p></div>`;
    side.innerHTML = `<div class="card"><div class="card-title">📖 项目</div><div style="font-size:13px;color:var(--text-dim)">${locked.name}</div></div>`;
    return;
  }

  // 计算健康度
  const totalBuds = (wt?.buds||rd?.buds||[]).length;
  const activeBranches = (wt?.branches||rd?.branches||[]).length;
  const totalTrunk = (wt?.trunk||rd?.trunk||[]).length;
  const health = Math.min(1, (totalTrunk*0.3 + (activeBranches>0?0.3:0) + (totalBuds<10?0.4:0.2)));

  let html = `<div class="page-title">🌳 世界树</div>`;

  // 四指标卡片
  html += `<div class="grid-4" style="margin-bottom:12px">
    <div class="card" style="text-align:center"><div style="font-size:24px">🌱</div><div style="font-size:20px;font-weight:700">${totalBuds}</div><div style="font-size:11px;color:var(--text-dim)">伏笔</div></div>
    <div class="card" style="text-align:center"><div style="font-size:24px">🌿</div><div style="font-size:20px;font-weight:700">${activeBranches}</div><div style="font-size:11px;color:var(--text-dim)">支线</div></div>
    <div class="card" style="text-align:center"><div style="font-size:24px">📖</div><div style="font-size:20px;font-weight:700">${totalTrunk}</div><div style="font-size:11px;color:var(--text-dim)">主干节拍</div></div>
    <div class="card" style="text-align:center"><div style="font-size:24px">🌳</div><div style="font-size:20px;font-weight:700">${Math.round(health*100)}%</div><div style="font-size:11px;color:var(--text-dim)">健康度</div></div>
  </div>`;

  // 主干剧情线
  const trunk = rd?.trunk||wt?.trunk||[];
  html += `<div class="card"><div class="card-title">📖 主线剧情</div>`;
  if(trunk.length){
    html += `<div style="padding:8px 0">`;
    trunk.forEach((t,i)=>{
      const imp = t.importance||5;
      const chNum = t.chapter||(i+1);
      html += `<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">
        <span style="background:var(--cyan);color:var(--bg);border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;cursor:pointer" onclick="showChapterModal(${chNum})" title="点击查看第${chNum}章">${chNum}</span>
        <div style="flex:1"><div>${t.event||t.title||''}</div>
          <div style="font-size:11px;color:var(--text-dim)">重要性: ${'⭐'.repeat(Math.min(Math.round(imp/2),5))} (${imp}/10) · <span style="cursor:pointer;color:var(--cyan);text-decoration:underline" onclick="showChapterModal(${chNum})">📖 查看原文</span></div></div>
      </div>`;
    });
    html += `</div>`;
  } else { html += `<p style="color:var(--text-dim)">暂无主干数据</p>`; }
  html += `</div>`;

  // 支线 + 伏笔双栏
  html += `<div class="row" style="gap:12px"><div class="col">`;
  html += `<div class="card"><div class="card-title">🌿 支线</div>`;
  const branches = rd?.branches||wt?.branches||[];
  if(branches.length){
    branches.forEach(b=>{
      const icon = {seed:'🌱',sprout:'🌿',growing:'🌳',blooming:'🌸',fruiting:'🍎'}[b.status]||'🌿';
      html += `<div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">
        <div>${icon} <strong>${b.name||''}</strong></div>
        <div style="font-size:11px;color:var(--text-dim)">始于第${b.start_chapter||'?'}章 · ${b.status||'发展中'} · 关联度: ${(b.relation||5)+'/10'}</div>
      </div>`;
    });
  } else { html += `<p style="color:var(--text-dim)">暂无支线数据</p>`; }
  html += `</div></div><div class="col">`;

  // 伏笔
  html += `<div class="card"><div class="card-title">🌱 伏笔</div>`;
  const buds = rd?.buds||wt?.buds||[];
  if(buds.length){
    buds.forEach(b=>{
      const urg = b.urgency||'中';
      const color = urg==='高'?'var(--accent)':urg==='中'?'var(--orange)':'var(--text-dim)';
      const chNum = b.chapter||b.planted||'?';
      html += `<div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">
        <div style="color:${color}">${urg==='高'?'🔴':urg==='中'?'🟡':'⚪'} ${b.foreshadow||b.title||''}</div>
        <div style="font-size:11px;color:var(--text-dim)">第${chNum}章埋设${chNum!=='?'?` · <span style="cursor:pointer;color:var(--cyan);text-decoration:underline" onclick="showChapterModal(${chNum})">📖 查看原文</span>`:''}</div>
      </div>`;
    });
  } else { html += `<p style="color:var(--text-dim)">暂无伏笔数据</p>`; }
  html += `</div></div></div>`;

  // 世界观根
  const roots = rd?.roots||wt?.roots||[];
  if(roots.length){
    html += `<div class="card"><div class="card-title">🌳 世界观设定</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">`;
    roots.forEach(r=>{
      html += `<span style="background:rgba(46,213,115,.1);color:var(--green);padding:4px 10px;border-radius:12px;font-size:12px">${r.category||'设定'}: ${(r.content||'').substring(0,40)}</span>`;
    });
    html += `</div></div>`;
  }

  main.innerHTML = html;
  side.innerHTML = `<div class="card"><div class="card-title">📖 ${locked.name}</div>
    <div style="font-size:12px;color:var(--text-dim);line-height:1.8">
      <div>🌱 伏笔: ${totalBuds}个</div>
      <div>🌿 支线: ${activeBranches}条</div>
      <div>📖 主干: ${totalTrunk}个节拍</div>
      <div>🌳 健康度: ${Math.round(health*100)}%</div>
    </div>
  </div>`;
};

// ═══════ 节奏控制台页面 ═══════
renderers.tension = function(){
  const main = document.getElementById('page-tension');
  const side = document.getElementById('page-tension-side');
  const locked = getLockedProject();
  if(!locked){main.innerHTML=lockedMsg();side.innerHTML='';return}
  if(_isAnalyzing){main.innerHTML=analyzingMsg();side.innerHTML='';return}
  const p = DB.projects[locked.name];
  const rhythm = p?.readerData?.rhythm;
  const tensions = p?.tensions||[];
  const hasData = rhythm && rhythm.per_chapter?.length;
  const name = T('tension');

  if(!hasData){
    main.innerHTML = `<div class="page-title">${name}</div><div class="empty-state"><p>暂无节奏数据</p><p style="font-size:12px;color:var(--text-dim);margin-top:8px">请在项目管理中对项目执行「分析」后查看</p></div>`;
    side.innerHTML = `<div class="card"><div class="card-title">📖 项目</div><div style="font-size:13px;color:var(--text-dim)">${locked.name}</div></div>`;
    return;
  }

  const chapters = rhythm.per_chapter;
  const lastCh = chapters[chapters.length-1];
  const avg = chapters.reduce((s,c)=>(s+c.page_turner||0)+(c.emotion||0),0)/(chapters.length*2);
  const recent3 = chapters.slice(-3);
  const trend = recent3.length>=3?(recent3[2].page_turner > recent3[0].page_turner?'上升中':recent3[2].page_turner<recent3[0].page_turner?'回落中':'稳定'):'待定';

  let html = `<div class="page-title">📊 阅读节奏</div>`;

  // 当前状态卡片
  html += `<div class="grid-3" style="margin-bottom:12px">
    <div class="card" style="text-align:center">
      <div style="font-size:11px;color:var(--text-dim)">最新章节吸引力</div>
      <div style="font-size:28px;font-weight:700;color:var(--cyan)">${lastCh.page_turner||'?'}</div>
      <div style="font-size:11px;color:var(--text-dim)">/ 10</div>
    </div>
    <div class="card" style="text-align:center">
      <div style="font-size:11px;color:var(--text-dim)">整体节奏</div>
      <div style="font-size:20px;font-weight:700;color:var(--orange)">${rhythm.overall_pacing||'未知'}</div>
      <div style="font-size:11px;color:var(--text-dim)">${trend}</div>
    </div>
    <div class="card" style="text-align:center">
      <div style="font-size:11px;color:var(--text-dim)">平均阅读吸引力</div>
      <div style="font-size:28px;font-weight:700;color:var(--green)">${avg.toFixed(1)}</div>
      <div style="font-size:11px;color:var(--text-dim)">/ 10</div>
    </div>
  </div>`;

  // 逐章数据卡片
  html += `<div class="card"><div class="card-title">📖 逐章阅读体验</div>`;
  chapters.forEach(c=>{
    const total = ((c.page_turner||5)+(c.emotion||5))/2;
    html += `<div style="display:flex;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04);align-items:center">
      <span style="background:linear-gradient(135deg,var(--cyan),var(--purple));color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">${c.chapter}</span>
      <div style="flex:1">
        <div style="display:flex;gap:12px;font-size:12px">
          <span>吸引力: <strong style="color:var(--cyan)">${c.page_turner||'?'}</strong></span>
          <span>情感: <strong style="color:var(--accent)">${c.emotion||'?'}</strong></span>
          <span>综合: <strong>${total.toFixed(1)}</strong></span>
          <span style="color:var(--text-dim)">${c.role||''}</span>
        </div>
      </div>
      <div style="width:80px;height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${total*10}%;background:linear-gradient(90deg,var(--cyan),var(--purple));border-radius:3px"></div>
      </div>
    </div>`;
  });
  html += `</div>`;

  // 读者最想知道 + 下一章期待
  html += `<div class="row" style="gap:12px;margin-top:12px"><div class="col">`;
  html += `<div class="card"><div class="card-title">❓ 读者最想知道</div>`;
  if(rhythm.top_questions?.length){
    rhythm.top_questions.forEach((q,i)=>{
      html += `<div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">${i+1}. ${q}</div>`;
    });
  } else { html += `<p style="color:var(--text-dim)">暂无数据</p>`; }
  html += `</div></div><div class="col">`;
  html += `<div class="card"><div class="card-title">🔮 读者对下一章的期待</div>
    <p style="color:var(--text-dim)">${rhythm.next_chapter_hope||'暂无数据'}</p>
  </div>`;
  html += `</div></div>`;

  // 张弛指导
  html += `<div class="card" style="margin-top:12px"><div class="card-title">🎯 节奏写作指导</div>
    <div style="font-size:12px;color:var(--text-dim);line-height:1.8">
      <div>🌊 <strong>平静期</strong> (1-3): 角色发展、日常、铺垫<br>
      📈 <strong>蓄力期</strong> (3-5): 冲突酝酿、伏笔埋设<br>
      🔥 <strong>上升期</strong> (5-7): 障碍增加、紧迫感上升<br>
      💥 <strong>高潮</strong> (8-10): 正面冲突、真相揭露<br>
      🌿 <strong>回落期</strong> (5→3): 后果处理、新方向萌芽</div>
      <div style="margin-top:8px;padding:8px;background:rgba(255,159,67,.1);border-radius:6px;color:var(--orange)">
        ⚡ 关键规则: 连续上升不超过5章 | 高潮后至少2章恢复期 | 张力永不降至1.0以下
      </div>
    </div>
  </div>`;

  main.innerHTML = html;
  side.innerHTML = `<div class="card"><div class="card-title">📖 ${locked.name}</div>
    <div style="font-size:12px;color:var(--text-dim);line-height:1.8">
      <div>📊 共 ${chapters.length} 章</div>
      <div>🎯 节奏: ${rhythm.overall_pacing||'未知'}</div>
      <div>📈 趋势: ${trend}</div>
      <div>💡 读者想知道: ${(rhythm.top_questions||[]).length}件事</div>
    </div>
  </div>`;
};

// ═══════ 角色池页面 ═══════
renderers.characters = function(){
  const main = document.getElementById('page-characters');
  const side = document.getElementById('page-characters-side');
  const locked = getLockedProject();
  if(!locked){main.innerHTML=lockedMsg();side.innerHTML='';return}
  if(_isAnalyzing){main.innerHTML=analyzingMsg();side.innerHTML='';return}
  const p = DB.projects[locked.name];

  // 合并角色数据：readerData.characters（LLM分析，键名=角色名）和 p.characters（键名=char_XXX）
  const readerChars = p?.readerData?.characters || {};
  const projChars = p?.characters || {};
  const merged = [];

  Object.entries(readerChars).forEach(([cName, info])=>{
    const r = info.role || '主要角色';
    merged.push({
      name: cName,
      role: r,
      roleIcon: r.includes('主角')?'⭐':r.includes('反派')?'💀':'👤',
      tag: info.tag || '',
      traits: info.traits || [],
      decision_style: info.decision_style,
      risk_attitude: info.risk_attitude,
      cares_about: info.cares_about || [],
      fears: info.fears || [],
      bottom_line: info.bottom_line,
      relationships: info.relationships || {},
      trust_pattern: info.trust_pattern,
      conflict_style: info.conflict_style,
      consistency_issues: info.consistency_issues || [],
      breaking_point: info.breaking_point,
      behavioral_model: info.behavioral_model || ''
    });
  });
  Object.entries(projChars).forEach(([cid, ch])=>{
    if(ch.name && !merged.find(m=>m.name===ch.name)){
      const r = ch.role || '主要角色';
      merged.push({
        name: ch.name, role: r,
        roleIcon: r.includes('主角')?'⭐':r.includes('反派')?'💀':'👤',
        tag: ch.reader_tag || ch.tag || '',
        traits: ch.traits || [],
        decision_style: ch.decision_style,
        risk_attitude: ch.risk_attitude,
        cares_about: ch.cares_about || [],
        fears: ch.fears || [],
        bottom_line: ch.bottom_line,
        relationships: ch.relationships || {},
        trust_pattern: ch.trust_pattern,
        conflict_style: ch.conflict_style,
        consistency_issues: ch.consistency_issues || [],
        breaking_point: ch.breaking_point,
        behavioral_model: ch.behavioral_model || ''
      });
    }
  });

  if(!merged.length){
    main.innerHTML = `<div class="page-title">🧠 角色池</div><div class="empty-state"><p>暂无角色数据</p><p style="font-size:12px;color:var(--text-dim);margin-top:8px">请在项目管理中对项目执行「分析」后查看</p></div>`;
    side.innerHTML = `<div class="card"><div class="card-title">📖 项目</div><div style="font-size:13px;color:var(--text-dim)">${locked.name}</div></div>`;
    return;
  }

  const order = {'⭐ 主角':0,'💀 反派':1,'👤 主要角色':2,'👤 配角':3};
  merged.sort((a,b)=>(order[a.roleIcon+' '+a.role]??9)-(order[b.roleIcon+' '+b.role]??9));

  let html = `<div class="page-title">🧠 角色池 <span style="font-size:13px;font-weight:400;color:var(--text-dim)">${merged.length} 个角色</span></div>`;
  html += `<div style="margin-bottom:12px"><button class="btn btn-primary" onclick="analyzeProject('${locked.name}')">🔄 AI重新分析</button></div>`;

  merged.forEach(ch=>{
    const roleColor = ch.role.includes('主角')?'var(--cyan)':ch.role.includes('反派')?'var(--accent)':'var(--text-dim)';

    html += `<div class="card" style="margin-bottom:8px;border-left:3px solid ${roleColor}">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:20px">${ch.roleIcon}</span>
        <div><div style="font-weight:600">${ch.name}</div>
        <div style="font-size:12px;color:${roleColor}">${ch.roleIcon} ${ch.role}</div></div>
        ${ch.tag?`<span style="margin-left:auto;font-size:12px;color:var(--cyan);background:rgba(0,212,255,.1);padding:2px 8px;border-radius:8px">${ch.tag}</span>`:''}
      </div>
      ${ch.behavioral_model?`<div style="margin-top:6px;padding:6px 8px;background:rgba(0,212,255,.04);border-left:2px solid var(--cyan);border-radius:4px;font-size:12px;line-height:1.6;color:var(--text-dim)">${ch.behavioral_model}</div>`:''}
      <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">${ch.traits.map(t=>`<span style="background:rgba(255,255,255,.06);padding:2px 8px;border-radius:6px;font-size:12px">${t}</span>`).join('')}</div>
      <div style="margin-top:6px;font-size:12px;line-height:1.6">
        ${ch.cares_about.length?`<div><span style="color:var(--green)">❤️ 在意:</span> ${ch.cares_about.join('、')}</div>`:''}
        ${ch.fears.length?`<div><span style="color:var(--accent)">😨 害怕:</span> ${ch.fears.join('、')}</div>`:''}
        ${Object.keys(ch.relationships).length?`<div><span style="color:var(--cyan)">🤝 关系:</span> ${Object.entries(ch.relationships).map(([k,v])=>`${k}(${v})`).join('、')}</div>`:''}
      </div>`;

    const hasExtra = ch.decision_style||ch.risk_attitude||ch.bottom_line||ch.trust_pattern||ch.conflict_style||ch.breaking_point;
    if(hasExtra){
      html += `<details style="margin-top:4px"><summary style="cursor:pointer;font-size:12px;color:var(--text-dim)">📋 更多行为特征</summary>
        <div style="margin-top:6px;padding:6px 8px;background:rgba(255,255,255,.03);border-radius:4px;line-height:1.7">
          ${ch.decision_style?`<div><span style="color:var(--orange)">⚡ 决策风格:</span> ${ch.decision_style}</div>`:''}
          ${ch.risk_attitude?`<div><span style="color:var(--orange)">🎲 风险态度:</span> ${ch.risk_attitude}</div>`:''}
          ${ch.bottom_line?`<div><span style="color:var(--accent)">🛡️ 底线:</span> ${ch.bottom_line}</div>`:''}
          ${ch.trust_pattern?`<div><span style="color:var(--cyan)">🔑 信任模式:</span> ${ch.trust_pattern}</div>`:''}
          ${ch.conflict_style?`<div><span style="color:var(--orange)">⚔️ 冲突处理:</span> ${ch.conflict_style}</div>`:''}
          ${ch.breaking_point?`<div><span style="color:var(--accent)">💥 突破底线的条件:</span> ${ch.breaking_point}</div>`:''}
        </div></details>`;
    }
    if(ch.consistency_issues.length){
      html += `<div style="margin-top:4px;padding:4px 8px;background:rgba(233,96,96,.1);border-radius:4px;color:var(--accent);font-size:12px">⚠️ 一致性提醒: ${ch.consistency_issues.join('; ')}</div>`;
    }
    html += `</div>`;
  });

  main.innerHTML = html;
  side.innerHTML = `<div class="card"><div class="card-title">📖 ${locked.name}</div>
    <div style="font-size:12px;color:var(--text-dim);line-height:1.8">
      <div>⭐ 主角: ${merged.filter(c=>c.role.includes('主角')).length}</div>
      <div>💀 反派: ${merged.filter(c=>c.role.includes('反派')).length}</div>
      <div>👤 其他: ${merged.filter(c=>!c.role.includes('主角')&&!c.role.includes('反派')).length}</div>
      <div>👥 共 ${merged.length} 个角色</div>
    </div>
  </div>`;
};

// ═══════ 审查室页面 ═══════
renderers.review = function(){
  const main = document.getElementById('page-review');
  const side = document.getElementById('page-review-side');
  const locked = getLockedProject();
  if(!locked){main.innerHTML=lockedMsg();side.innerHTML='';return}
  main.innerHTML = `<div class="page-title">🔍 审查室</div><div class="empty-state"><p>审查功能待实现</p></div>`;
  side.innerHTML = `<div class="card"><div class="card-title">📖 项目</div><div style="font-size:13px;color:var(--text-dim)">${locked.name}</div></div>`;
};

// ═══════ 写作台页面 ═══════
renderers.writer = function(){
  const main = document.getElementById('page-writer');
  const side = document.getElementById('page-writer-side');
  const locked = getLockedProject();
  if(!locked){main.innerHTML=lockedMsg();side.innerHTML='';return}
  const p = DB.projects[locked.name];
  // 尝试从磁盘加载章节
  const chapters = p.chapters||[];
  const nextCh = chapters.length + 1;
  const context = getWriterContext(locked.name);
  // 异步加载磁盘章节，完成后刷新
  if((!chapters.length) && locked){
    (async()=>{
      if(await loadChaptersFromDisk(locked.name)) renderers.writer();
    })();
  }

  // 主面板：写作表单
  let html = `<div class="page-title">✍️ 写作台</div>
  <div class="card">
    <div style="font-size:13px;color:var(--text-dim);margin-bottom:12px">🔒 当前项目：${locked.name}（${chapters.length}章已写）</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div><label>章节号</label><input type="number" id="writerChNum" value="${nextCh}" min="1" style="width:80px"></div>
      <div><label>写作方向</label>
        <textarea id="writerDirection" rows="4" placeholder="描述这一章要写什么：关键事件、角色发展、氛围基调……越具体越好" style="width:100%;resize:vertical"></textarea>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <div style="flex:1;min-width:140px">
          <label>温度 <span id="writerTempV" style="color:var(--cyan)">0.8</span></label>
          <input type="range" id="writerTemp" min="0.1" max="1.5" step="0.05" value="0.8" oninput="document.getElementById('writerTempV').textContent=parseFloat(this.value).toFixed(2)">
          <div style="font-size:11px;color:var(--text-muted)">越高越有创意，越低越稳定</div>
        </div>
        <div style="flex:1;min-width:100px">
          <label>目标字数</label>
          <input type="number" id="writerWords" value="3000" min="500" max="20000" step="500" style="width:100%">
          <div style="font-size:11px;color:var(--text-muted)">建议 2000~5000 字</div>
        </div>
        <div style="flex:1;min-width:100px">
          <label>&nbsp;</label>
          <button class="btn btn-primary" id="btnWrite" style="width:100%;padding:10px 20px;font-size:15px">✍️ 开始写作</button>
        </div>
      </div>
    </div>
  </div>
  <div id="writerResult" style="display:none">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-weight:600">📝 生成结果</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm" id="btnRegenerate">🔄 重新生成</button>
          <button class="btn btn-primary btn-sm" id="btnSaveChapter">💾 保存并分析</button>
        </div>
      </div>
      <textarea id="writerContent" rows="15" style="width:100%;resize:vertical;font-size:13px;line-height:1.7;font-family:inherit"></textarea>
    </div>
  </div>`;

  main.innerHTML = html;

  // 右侧面板：上下文 + 行为规律
  let sideHtml = `<div class="card"><div class="card-title">📖 项目</div>
    <div style="font-size:12px;color:var(--text-dim);line-height:1.8">
      <div>📊 共 ${chapters.length} 章</div>
      <div>👥 ${Object.keys(p.readerData?.characters||p.characters||{}).length} 个角色</div>
      <div>📈 已分析: ${p.analyzed?'✅':'❌'}</div>
    </div>
    <div style="margin-top:10px">
      <button class="btn btn-sm" id="btnSplitChapters" style="width:100%">📑 划分章节</button>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px">手动触发：根据 chapter_marks.json 重新分割</div>
    </div>
  </div>`;

  // 写作上下文面板
  if(context){
    sideHtml += `<div class="card"><div class="card-title">📋 写作上下文</div>
      <div style="font-size:12px;color:var(--text-dim);line-height:1.7;max-height:400px;overflow-y:auto">${context.replace(/\n/g,'<br>')}</div>
    </div>`;
  }

  // 行为规律参考（可折叠）
  sideHtml += `<div class="card"><details><summary style="cursor:pointer;font-size:13px;font-weight:600;color:var(--cyan)">📖 人类行为规律参考</summary>
    <div style="font-size:11px;color:var(--text-dim);line-height:1.6;margin-top:6px;max-height:350px;overflow-y:auto">${WRITER_BEHAVIORAL_PRINCIPLES.replace(/\n/g,'<br>')}</div>
  </details></div>`;

  side.innerHTML = sideHtml;

  // ─── 已有章节展示（主面板下方，可折叠展开） ───
  if(chapters.length){
    const container = document.getElementById('writerResult');
    // 展开/折叠按钮插入到生成结果卡片之前
    const chSection = document.createElement('div');
    chSection.id = 'writerChapterSection';
    chSection.style.marginTop = '12px';
    let chHtml = `<div class="card" id="chaptersCard">
      <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="toggleChapters()">
        <span class="card-title" style="margin:0">📚 已有章节（${chapters.length}章）</span>
        <span id="chToggleIcon" style="font-size:18px;color:var(--cyan)">▼</span>
      </div>
      <div id="chaptersBody">`;
    // 按章节号降序排列，最新的在最上面
    chapters.slice().reverse().forEach(ch=>{
      const preview = (ch.content||'').substring(0,120);
      chHtml += `<div style="border-bottom:1px solid rgba(255,255,255,.06)">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;cursor:pointer" onclick="toggleChapter(${ch.number})">
          <div><span style="font-weight:600">📄 第${ch.number}章</span> ${ch.title||''}</div>
          <span id="chIcon_${ch.number}" style="font-size:12px;color:var(--text-dim)">▶ 展开</span>
        </div>
        <div id="chBody_${ch.number}" style="display:none;padding:0 0 12px 0">
          <div style="font-size:13px;line-height:1.8;white-space:pre-wrap;background:rgba(0,0,0,.15);padding:12px;border-radius:6px;max-height:400px;overflow-y:auto">${ch.content.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/`/g,'&#96;').replace(/\$\{/g,'&#36;&#123;')}</div>
        </div>
      </div>`;
    });
    chHtml += `</div></div>`;
    chSection.innerHTML = chHtml;
    container.parentNode.insertBefore(chSection, container);

    // 默认展开章节列表
    document.getElementById('chaptersBody').style.display = 'block';
    document.getElementById('chToggleIcon').textContent = '▼';
  }

  // ─── 事件绑定 ───
  document.getElementById('btnWrite')?.addEventListener('click', async ()=>{
    const chNum = parseInt(document.getElementById('writerChNum').value) || nextCh;
    const direction = document.getElementById('writerDirection').value.trim();
    const temp = parseFloat(document.getElementById('writerTemp').value) || 0.8;
    const maxWords = parseInt(document.getElementById('writerWords').value) || 3000;

    if(!direction){
      toast('请填写写作方向','error');
      return;
    }

    const btn = document.getElementById('btnWrite');
    btn.disabled = true; btn.textContent = '⏳ 写作中...';

    await writeChapter(locked.name, chNum, direction, temp, maxWords);

    btn.disabled = false; btn.textContent = '✍️ 开始写作';
  });

  document.getElementById('btnRegenerate')?.addEventListener('click', ()=>{
    document.getElementById('btnWrite')?.click();
  });

  document.getElementById('btnSaveChapter')?.addEventListener('click', async ()=>{
    const chNum = parseInt(document.getElementById('writerChNum').value) || nextCh;
    const content = document.getElementById('writerContent').value.trim();
    if(!content){toast('没有可保存的内容','error');return}

    const btn = document.getElementById('btnSaveChapter');
    btn.disabled = true; btn.textContent = '⏳ 保存中...';

    // 保存章节
    const p = DB.projects[locked.name];
    if(!p.chapters) p.chapters = [];
    const existing = p.chapters.findIndex(c=>c.number===chNum);
    const chData = {number:chNum, content, status:'draft', created_at:new Date().toISOString()};
    if(existing>=0) p.chapters[existing] = {...p.chapters[existing], ...chData};
    else p.chapters.push(chData);
    p.chapters.sort((a,b)=>a.number-b.number);
    saveDB();
    // 持久化到磁盘
    saveFileToDisk(locked.name, 'chapters', `chapter_${String(chNum).padStart(3,'0')}.md`, content);
    toast(`✅ 第${chNum}章已保存`);

    // 自动触发分析
    await analyzeProject(locked.name);
    renderers.writer();

    btn.disabled = false; btn.textContent = '💾 保存并分析';
  });

  document.getElementById('btnSplitChapters')?.addEventListener('click', async ()=>{
    const btn = document.getElementById('btnSplitChapters');
    btn.disabled = true; btn.textContent = '⏳ 分割中...';
    await splitChaptersByMarks(locked.name);
    btn.disabled = false; btn.textContent = '📑 划分章节';
  });
};

// ═══════ 写作函数 ═══════
async function writeChapter(projectName, chNum, direction, temperature, maxWords){
  const p = DB.projects[projectName];
  const context = getWriterContext(projectName);
  const chapters = p.chapters||[];
  const prevChapter = chapters.filter(c=>c.number<chNum).sort((a,b)=>b.number-a.number)[0];

  const systemPrompt = `你是一位擅长${p.genre||'长篇'}小说创作的作家。你的任务是写出高质量的小说章节内容。

${WRITER_BEHAVIORAL_PRINCIPLES}

写作时请注意：
1. 角色行为必须符合他们的性格和行为模式——不能为了推动剧情而让角色做出不符合人设的事
2. 如果角色要做出的行为与其惯常模式不同，必须在上下文中提供充分的动机、铺垫和代价
3. 角色间的互动要符合他们之间的关系状态——信任、防备、合作或对抗
4. 关注读者当前的节奏感受，该加速时加速，该沉淀时沉淀
5. 一次写好这一章，不要依赖后续修改`;

  let userPrompt = `请写第${chNum}章。\n`;

  if(prevChapter){
    userPrompt += `\n上一章（第${prevChapter.number}章）结尾：\n${prevChapter.content.slice(-200)}\n\n`;
  }

  if(context){
    userPrompt += `以下是当前的故事状态和角色信息，写作时必须严格遵守：\n\n${context}\n`;
  }

  userPrompt += `【写作方向】\n${direction}\n\n`;
  userPrompt += `请写出一章约${maxWords}字的小说内容。直接输出章节正文，不要额外说明。`;

  try {
    const content = await callLLM([
      {role:'system', content:systemPrompt},
      {role:'user', content:userPrompt}
    ], {max_tokens: Math.min(maxWords * 2, 16384), temperature});

    // 显示结果
    document.getElementById('writerContent').value = content;
    document.getElementById('writerResult').style.display = 'block';
    toast('✅ 写作完成！请预览并保存');
    return content;
  } catch(e){
    toast('❌ 写作失败: '+e.message,'error');
    throw e;
  }
}

// ═══════ 历史日志页面 ═══════
renderers.history = function(){
  const main = document.getElementById('page-history');
  const side = document.getElementById('page-history-side');
  const locked = getLockedProject();
  if(!locked){main.innerHTML=lockedMsg();side.innerHTML='';return}
  const p = DB.projects[locked.name];
  const logs = p.folders?.projectLog || [];

  // 分析过程日志（按会话分组显示）
  let analysisHtml = '';
  if(_analysisLogEntries.length > 0){
    // 当前会话
    analysisHtml += `<div class="card"><div class="card-title">🔍 分析过程日志</div>
      <div style="max-height:60vh;overflow-y:auto">
      <div style="font-size:11px;color:var(--cyan);padding:4px 0;border-bottom:1px solid var(--border)}">🟢 当前会话 ${new Date(_currentSessionId).toLocaleString()}</div>`;
    _analysisLogEntries.forEach(e=>{
      analysisHtml += `<div class="history-entry">
        <span class="h-time">${e.time||''}</span>
        <div class="h-round">${e.round}</div>
        ${e.question ? `<div class="h-q">📤 ${e.question}</div>` : ''}
        ${e.answer ? `<div class="h-a">📥 ${e.answer}</div>` : ''}
      </div>`;
    });
    analysisHtml += `</div></div>`;
  } else {
    // 从磁盘读取，按会话分组
    const allLogs = logs.filter(l=>l.type==='analysis_log');
    // 提取所有会话标记
    const sessions = logs.filter(l=>l.type==='analysis_session_start' || l.type==='analysis_session_end');
    // 按 sessionId 分组
    const groups = {};
    for(const l of allLogs){
      const sid = l.sessionId || 'unknown';
      if(!groups[sid]) groups[sid] = [];
      groups[sid].push(l);
    }
    const sessionIds = Object.keys(groups).sort((a,b)=>b-a).slice(0,5); // 最近5次
    if(sessionIds.length > 0){
      analysisHtml = `<div class="card"><div class="card-title">🔍 分析过程日志</div>
        <div style="max-height:60vh;overflow-y:auto">`;
      for(const sid of sessionIds){
        const startMarker = sessions.find(s=>s.sessionId==parseInt(sid) && s.type==='analysis_session_start');
        const timeStr = startMarker?.time || new Date(parseInt(sid)).toLocaleString();
        analysisHtml += `<div style="font-size:11px;color:var(--text-muted);padding:6px 0 2px;border-top:1px solid var(--border);margin-top:6px">📅 ${timeStr}</div>`;
        groups[sid].forEach(e=>{
          analysisHtml += `<div class="history-entry">
            <span class="h-time">${e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : ''}</span>
            <div class="h-round">${e.round}</div>
            ${e.question ? `<div class="h-q">📤 ${e.question}</div>` : ''}
            ${e.answer ? `<div class="h-a">📥 ${e.answer}</div>` : ''}
          </div>`;
        });
      }
      analysisHtml += `</div></div>`;
    } else {
      analysisHtml = `<div class="card"><div class="card-title">🔍 分析过程日志</div>
        <div class="empty-state"><p>暂无分析日志</p><p style="font-size:12px;color:var(--text-dim);margin-top:4px">执行分析后，每轮对话的提问和回复将显示在这里</p></div>
      </div>`;
    }
  }
  let html = `<div class="page-title">📋 历史日志</div>` + analysisHtml;

  // 项目操作日志
  const opLogs = logs.filter(l=>l.type!=='analysis_log');
  if(opLogs.length > 0){
    html += `<div class="card" style="margin-top:12px"><div class="card-title">📋 操作记录</div>
      <div style="max-height:30vh;overflow-y:auto">`;
    opLogs.slice().reverse().slice(0,30).forEach(l=>{
      html += `<div class="history-entry">
        <span class="h-time">${l.timestamp ? new Date(l.timestamp).toLocaleString() : ''}</span>
        <div>${l.category||l.type||''} ${l.data ? JSON.stringify(l.data).substring(0,100) : ''}</div>
      </div>`;
    });
    html += `</div></div>`;
  }

  main.innerHTML = html;
  const analysisLogCount = _analysisLogEntries.length || logs.filter(l=>l.type==='analysis_log').length;
  side.innerHTML = `<div class="card"><div class="card-title">📖 ${locked.name}</div>
    <div style="font-size:12px;color:var(--text-dim);line-height:1.8">
      <div>🔍 分析日志: ${analysisLogCount}条</div>
      <div>📋 操作记录: ${opLogs.length}条</div>
      <div>📅 分析次数: ${new Set(logs.filter(l=>l.type==='analysis_session_start').map(l=>l.sessionId)).size}次</div>
    </div>
  </div>`;

  // 自动刷新：分析中每2秒检查新日志
  if(window._historyRefreshTimer) clearInterval(window._historyRefreshTimer);
  window._historyRefreshTimer = setInterval(()=>{
    // 只在历史页面可见时刷新
    if(!document.getElementById('page-history')?.classList.contains('active')) return;
    const newCount = _analysisLogEntries.length;
    if(window._lastHistoryCount !== undefined && window._lastHistoryCount !== newCount){
      renderers.history();
    }
    window._lastHistoryCount = newCount;
  }, 2000);
};
function lockedMsg(){
  return `<div style="text-align:center;padding:60px 20px">
    <div style="font-size:48px;margin-bottom:16px">🔓</div>
    <div style="font-size:18px;font-weight:600;color:var(--orange);margin-bottom:8px">请先在项目管理中锁定一个项目</div>
    <div style="font-size:13px;color:var(--text-dim);margin-bottom:20px">锁定后可使用写作、审查、世界树等全部功能</div>
    <button class="btn btn-primary" onclick="navigateTo('project')">📁 前往项目管理</button>
  </div>`;
}

// ═══════ 设置页（不依赖锁定） ═══════
renderers.settings = function(){
  const main = document.getElementById('page-settings');
  const side = document.getElementById('page-settings-side');
  const cfg = DB.config || {};
  if(!DB.config) DB.config = {};

  if(!cfg.provider) cfg.provider = 'deepseek';
  if(!cfg.model) cfg.model = 'deepseek-v4-flash';
  if(!cfg.apiKeys) cfg.apiKeys = {};
  if(!cfg.qualityGate) cfg.qualityGate = {passThreshold:75,reviseThreshold:50,maxIterations:3,strictMinDim:5};
  if(!cfg.reviewWeights) cfg.reviewWeights = {strict:1.0,moderate:0.7,lenient:0.4};
  if(!cfg.dimWeights) cfg.dimWeights = {};
  if(!cfg.roleParams) cfg.roleParams = {};

  const ROLES = [
    {key:'writer',label:'✍️ 写作',temp:0.8,mt:8192},
    {key:'strict',label:'🔴 严审',temp:0.3,mt:4096},
    {key:'moderate',label:'🟡 衡审',temp:0.3,mt:4096},
    {key:'lenient',label:'🟢 宽审',temp:0.4,mt:3072},
    {key:'voter',label:'🗳️ 投票',temp:0.2,mt:2048},
    {key:'skill',label:'📚 技能学习',temp:0.5,mt:4096},
  ];

  const prov = PROVIDER_CONFIG[cfg.provider] || PROVIDER_CONFIG.deepseek;
  let html = `<div class="page-title">⚙️ 设置</div>`;

  // LLM供应商
  html += `<div class="card"><details open><summary style="cursor:pointer;font-size:14px;font-weight:600;color:var(--cyan)">🤖 LLM 供应商配置</summary>
    <p style="font-size:12px;color:var(--text-dim);margin:8px 0">选择 AI 供应商并配置 API Key。不同供应商支持不同的模型和参数。</p>
    <div class="row" style="margin-bottom:8px">
      <div class="col"><label>供应商</label>
        <select id="setProvider" onchange="onSetProviderChange()">
          ${Object.keys(PROVIDER_CONFIG).map(id=>`<option value="${id}" ${id===cfg.provider?'selected':''}>${PROVIDER_CONFIG[id].label}</option>`).join('')}
        </select>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">切换供应商后模型列表会自动更新</div>
      </div>
      <div class="col"><label>模型</label>
        ${cfg.provider==='custom'
          ? `<input type="text" id="setModel" value="${cfg.customModel||''}" placeholder="如: deepseek-chat, gpt-4o-mini" style="border-color:var(--orange)">`
          : `<select id="setModel">${prov.models.map(m=>`<option value="${m}" ${m===cfg.model?'selected':''}>${m}</option>`).join('')}</select>`}
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${cfg.provider==='custom'?'💡 直接输入模型名称':'各角色可在「分角色参数」中单独指定不同模型'}</div>
      </div>
    </div>
    ${cfg.provider==='custom' ? `
    <div style="margin-bottom:8px"><label>API 地址</label>
      <input type="text" id="setCustomUrl" value="${cfg.customUrl||''}" placeholder="如: http://127.0.0.1:8000/v1">
      <div style="font-size:11px;color:var(--text-muted);margin-top:2px">需兼容 OpenAI API 格式，支持本地部署的模型</div>
    </div>
    ` : ''}
    <div style="margin-bottom:8px"><label>API Key（<span id="setEnvKey" style="color:var(--cyan)">${prov.envKey}</span>）</label>
      ${_isApiKeyApplied(cfg.provider)
        ? `<div style="display:flex;gap:6px;flex-wrap:wrap">
             <input type="password" id="setApiKey" value="********" disabled placeholder="已保存" style="flex:1">
             <button class="btn btn-success btn-sm" id="btnTestConnection">🔗 测试连接</button>
             <button class="btn btn-warning btn-sm" id="btnReenterKey">🔄 重新输入</button>
           </div>
           <div style="font-size:11px;color:var(--green);margin-top:2px">✅ API Key 已加密保存</div>
           <div id="connectionResult" style="font-size:12px;margin-top:4px"></div>`
        : `<input type="password" id="setApiKey" value="${_apiKeysCache[cfg.provider]||''}" placeholder="输入 API Key">
           <button class="btn btn-primary btn-sm" style="margin-top:4px" id="btnSaveKey">💾 保存 Key</button>
           <div style="font-size:11px;color:var(--text-muted);margin-top:2px">API Key 将加密存储在本地浏览器中</div>`}
    </div>
    ${prov.restricted?`<div style="font-size:12px;padding:8px;background:rgba(233,96,96,.1);border-radius:6px;color:var(--accent)">⚠️ ${prov.label} 在中国大陆可能无法直接访问，建议使用 DeepSeek 或自定义供应商</div>`:''}
  </details></div>`;

  // 分角色参数
  html += `<div class="card"><details open><summary style="cursor:pointer;font-size:14px;font-weight:600;color:var(--cyan)">🎯 分角色参数配置</summary>
    <p style="font-size:12px;color:var(--text-dim);margin:8px 0">每个角色可独立指定模型和参数，不填则使用上方全局设置。写作温度影响创造力（低→严谨，高→发散）；最大Token控制输出长度。</p>`;
  ROLES.forEach(r=>{
    const rp = cfg.roleParams[r.key] || {};
    const curM = rp.model || cfg.model;
    const curT = rp.temperature ?? r.temp;
    const curMT = rp.maxTokens ?? r.mt;
    html += `<details style="margin-top:4px"><summary style="cursor:pointer;color:var(--cyan);font-size:13px;padding:4px 0">${r.label}</summary>
      <div class="row" style="margin-top:4px">
        <div class="col"><label>模型</label>
          ${cfg.provider==='custom'
            ? `<input type="text" id="rp_${r.key}_model" value="${curM}" placeholder="输入模型名">`
            : `<select id="rp_${r.key}_model">${prov.models.map(m=>`<option value="${m}" ${m===curM?'selected':''}>${m}</option>`).join('')}</select>`}</div>
        <div class="col"><label>温度 <span id="rp_${r.key}_temp_v" style="color:var(--cyan)">${curT}</span></label>
          <input type="range" min="0" max="2" step="0.05" value="${curT}" oninput="document.getElementById('rp_${r.key}_temp_v').textContent=parseFloat(this.value).toFixed(2)"></div>
        <div class="col"><label>最大Token</label>
          <input type="number" id="rp_${r.key}_mt" value="${curMT}" min="100" max="128000" step="500"></div>
      </div></details>`;
  });
  html += `</div>`;

  // 质量门禁
  const qg = cfg.qualityGate;
  html += `<div class="card"><details open><summary style="cursor:pointer;font-size:14px;font-weight:600;color:var(--cyan)">🚪 质量门禁</summary>
    <p style="font-size:12px;color:var(--text-dim);margin:8px 0">章节质量自动门禁系统。评分 &gt;= 通过阈值→自动通过；评分 &gt;= 修订阈值且 &lt; 通过阈值→启动修订循环；评分 &lt; 修订阈值→标记为需要人工审查。</p>
    <div class="grid-2">
      <div class="slider-group"><label>通过阈值 <span id="qg_pass_v" style="color:var(--cyan)">${qg.passThreshold}</span></label>
        <input type="range" min="50" max="95" step="5" value="${qg.passThreshold}" oninput="document.getElementById('qg_pass_v').textContent=this.value">
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">太低(&lt;60)：低质量章节也会自动通过。太高(&gt;85)：大部分章节需反复修订。<br><strong>推荐 70-80</strong></div></div>
      <div class="slider-group"><label>修订阈值 <span id="qg_revise_v" style="color:var(--cyan)">${qg.reviseThreshold}</span></label>
        <input type="range" min="30" max="80" step="5" value="${qg.reviseThreshold}" oninput="document.getElementById('qg_revise_v').textContent=this.value">
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">太低(&lt;40)：即使严重问题也自动修订浪费 API。太高(&gt;60)：轻微问题也触发循环。<br><strong>推荐 45-55</strong></div></div>
      <div class="slider-group"><label>最大迭代 <span id="qg_iter_v" style="color:var(--cyan)">${qg.maxIterations}</span></label>
        <input type="range" min="1" max="10" step="1" value="${qg.maxIterations}" oninput="document.getElementById('qg_iter_v').textContent=this.value">
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">太少(1-2)：修订不充分。太多(&gt;5)：消耗大量 API 且内容可能偏离原意。<br><strong>推荐 3</strong></div></div>
      <div class="slider-group"><label>严审最低维度分 <span id="qg_min_v" style="color:var(--cyan)">${qg.strictMinDim}</span></label>
        <input type="range" min="1" max="10" step="1" value="${qg.strictMinDim}" oninput="document.getElementById('qg_min_v').textContent=this.value">
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">严审任一维度低于此分即触发阻断。太低(1-3)：严审约束失效。太高(8-10)：过于严格。<br><strong>推荐 5</strong></div></div>
    </div>
  </details></div>`;

  // 审查权重
  const rw = cfg.reviewWeights;
  html += `<div class="card"><details open><summary style="cursor:pointer;font-size:14px;font-weight:600;color:var(--cyan)">⚖️ 审查权重</summary>
    <p style="font-size:12px;color:var(--text-dim);margin:8px 0">三位审查官在最终加权评分中的权重系数。严审最严格（上限），宽审最宽松（下限），衡审取中间值。</p>
    <div class="grid-3">
      <div class="slider-group"><label>严审 <span id="rw_strict_v" style="color:var(--cyan)">${rw.strict}</span></label>
        <input type="range" min="0.5" max="2" step="0.1" value="${rw.strict}" oninput="document.getElementById('rw_strict_v').textContent=parseFloat(this.value).toFixed(1)">
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">太低(&lt;0.7)：严审约束效果被削弱。太高(&gt;1.5)：评分整体偏低。<br><strong>推荐 1.0</strong></div></div>
      <div class="slider-group"><label>衡审 <span id="rw_moderate_v" style="color:var(--cyan)">${rw.moderate}</span></label>
        <input type="range" min="0.5" max="2" step="0.1" value="${rw.moderate}" oninput="document.getElementById('rw_moderate_v').textContent=parseFloat(this.value).toFixed(1)">
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">过低时评分偏向极端，过高时评分过于中庸。<br><strong>推荐 0.7</strong></div></div>
      <div class="slider-group"><label>宽审 <span id="rw_lenient_v" style="color:var(--cyan)">${rw.lenient}</span></label>
        <input type="range" min="0.1" max="1" step="0.1" value="${rw.lenient}" oninput="document.getElementById('rw_lenient_v').textContent=parseFloat(this.value).toFixed(1)">
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">太低(&lt;0.2)：失去纠偏作用。太高(&gt;0.8)：评分过于宽松。<br><strong>推荐 0.4</strong></div></div>
    </div>
  </details></div>`;

  // 13维度权重
  const DIM_HELPS = [
    '情节结构、转折合理性、因果逻辑。太低：情节问题被低估；太高：轻微瑕疵拉低总分。',
    '角色人设一致性、行为动机、成长弧线。太低：角色OOC被忽略；太高：稍有不足就拉低总分。',
    '对话自然度、角色声音区分度、潜台词。太低：僵硬对话被放过；太高：轻微不自然也被标记。',
    '节奏控制、场景长度、张弛交替。太低：节奏问题被忽视；太高：正常叙事也被判定为问题。',
    '文风、句式变化、比喻新鲜度。太低：文风问题被低估；太高：风格偏好影响客观评分。',
    '时间线、角色细节、世界观规则前后一致性。推荐保持较高权重。',
    '情感共鸣、共情力、是否刻意煽情。太低：情感平淡被放过；太高：正常情感也被认为不够。',
    '原创性、避免陈词滥调、可预测性。太低：套路化内容被高估；太高：对新颖度要求苛刻。',
    '段落长度、句子流畅度、视角清晰度。太低：难读文本也被接受；太高：轻微晦涩也被扣分。',
    'AI 生成痕迹检测敏感度。太低：AI味可能漏检；太高：正常文本也被怀疑为 AI 生成。',
    '角色心理深度和人格一致性。太低：扁平角色被放过；太高：对心理刻画过于严格。',
    '角色间互动逻辑和关系合理性。太低：关系不合理被忽略；太高：正常互动也被质疑。',
    '情节选择的内部逻辑和代价合理性。太低："为了特别而特别"被放过；太高：正常处理也被质疑。',
  ];
  html += `<div class="card"><details open><summary style="cursor:pointer;font-size:14px;font-weight:600;color:var(--cyan)">🔍 13维度权重</summary>
    <p style="font-size:12px;color:var(--text-dim);margin:8px 0">配置 13 个审查维度的权重系数，权重越高该维度在最终评分中影响力越大。1.0 为标准权重。</p>
    <div class="grid-2">`;
  DIM_KEYS.forEach((k,i)=>{
    const w = cfg.dimWeights[k] ?? 1.0;
    html += `<div class="slider-group"><label>${DIM_NAMES[i]} <span id="dw_${k}_v" style="color:var(--cyan)">${w.toFixed(1)}</span></label>
      <input type="range" min="0.5" max="2" step="0.1" value="${w}" oninput="document.getElementById('dw_${k}_v').textContent=parseFloat(this.value).toFixed(1)">
      <div style="font-size:10px;color:var(--text-muted);line-height:1.3;margin-top:1px">${DIM_HELPS[i]}</div></div>`;
  });
  html += `</div></details></div>`;

  html += `<button class="btn btn-primary btn-block" id="btnSaveAllSettings">💾 保存全部配置</button>`;

  // 导出/导入设置（不含 LLM 信息）
  const proj = getProj();
  const hasExport = proj && proj.folders?.config?.settings_export;
  html += `<div style="display:flex;gap:8px;margin-top:12px">
    <button class="btn btn-secondary btn-block" id="btnExportSettings" ${proj?'':'disabled'}>📤 导出设置到项目文件夹</button>
    <button class="btn btn-secondary btn-block" id="btnImportSettings" ${hasExport?'':'disabled'}>📥 从项目文件夹导入设置</button>
  </div>
  <div id="exportImportMsg" style="font-size:12px;color:var(--text-dim);margin-top:6px;text-align:center">
    ${!proj?'⚠️ 需要先锁定一个项目才能导出设置':''}
    ${proj&&!hasExport?'💡 导出后设置将存入项目文件夹，切换项目时可导入复用':''}
    ${hasExport?'✅ 该项目已有已导出的设置，可导入':''}
  </div>`;

  main.innerHTML = html;
  side.innerHTML = `<div class="card"><div class="card-title">ℹ️ 系统信息</div>
    <div style="font-size:12px;color:var(--text-dim);line-height:1.8">
      <div>• 三层审核流程</div>
      <div>• 三审查官（严/衡/宽）</div>
      <div>• 综合评分优选器</div>
      <div>• 模糊记忆引擎</div>
      <div>• 世界树生长模型</div>
      <div>• 张力波动管理器</div>
    </div>
  </div>`;

  // 用 addEventListener 绑定按钮事件（比 onclick 属性更可靠）
  document.getElementById('btnSaveKey')?.addEventListener('click', saveApiKeySetting);
  document.getElementById('btnReenterKey')?.addEventListener('click', reenterApiKeySetting);
  document.getElementById('btnTestConnection')?.addEventListener('click', testConnection);
  document.getElementById('btnExportSettings')?.addEventListener('click', exportSettings);
  document.getElementById('btnImportSettings')?.addEventListener('click', importSettings);
  document.getElementById('btnSaveAllSettings')?.addEventListener('click', saveSettings);
};

// ─── 设置操作函数 ───
function _isApiKeyApplied(provider){
  const st = DB.apiKeyStates;
  return st[provider] === 'applied' && !!_apiKeysCache[provider];
}

function onSetProviderChange(){
  const cfg = DB.config;
  cfg.provider = document.getElementById('setProvider').value;
  const pc = PROVIDER_CONFIG[cfg.provider];
  if(!pc) return;
  // 重新渲染设置页（因为自定义供应商的UI结构不同）
  renderers.settings();
}

function saveApiKeySetting(){
  const prov = document.getElementById('setProvider').value;
  const key = document.getElementById('setApiKey').value.trim();
  if(!key){toast('请输入 API Key','error');return}
  // 加密持久化
  _apiKeysCache[prov] = key;
  _saveApiKeys(_apiKeysCache);
  // 标记为已应用
  if(!DB.apiKeyStates) DB.apiKeyStates = {};
  DB.apiKeyStates[prov] = 'applied';
  saveDB();
  toast('✅ API Key 已加密保存');
  renderers.settings();
}

function reenterApiKeySetting(){
  const prov = document.getElementById('setProvider').value;
  // 清除已保存的 Key
  delete _apiKeysCache[prov];
  _saveApiKeys(_apiKeysCache);
  if(DB.apiKeyStates) DB.apiKeyStates[prov] = 'editing';
  saveDB();
  toast('已清除 API Key，可重新输入');
  renderers.settings();
}

// ═══════ 导出/导入设置 ═══════
function exportSettings(){
  const proj = getProj();
  if(!proj){toast('请先锁定一个项目','error');return}
  // 提取非 LLM 设置
  const cfg = DB.config || {};
  const exportData = {
    qualityGate: JSON.parse(JSON.stringify(cfg.qualityGate || {passThreshold:75,reviseThreshold:50,maxIterations:3,strictMinDim:5})),
    reviewWeights: JSON.parse(JSON.stringify(cfg.reviewWeights || {strict:1.0,moderate:0.7,lenient:0.4})),
    dimWeights: JSON.parse(JSON.stringify(cfg.dimWeights || {})),
    exportedAt: Date.now(),
    version: 1,
  };
  if(!proj.folders) proj.folders = createDefaultFolders();
  if(!proj.folders.config) proj.folders.config = {};
  proj.folders.config.settings_export = exportData;
  saveDB();
  toast('✅ 设置已导出到项目文件夹');
  renderers.settings();
}

function importSettings(){
  const proj = getProj();
  if(!proj || !proj.folders?.config?.settings_export){toast('项目文件夹中无已导出的设置','error');return}
  const data = proj.folders.config.settings_export;
  const cfg = DB.config || {};
  if(!DB.config) DB.config = {};
  if(data.qualityGate) cfg.qualityGate = JSON.parse(JSON.stringify(data.qualityGate));
  if(data.reviewWeights) cfg.reviewWeights = JSON.parse(JSON.stringify(data.reviewWeights));
  if(data.dimWeights) cfg.dimWeights = JSON.parse(JSON.stringify(data.dimWeights));
  saveDB();
  toast('✅ 已从项目文件夹导入设置（LLM 配置保持不变）');
  renderers.settings();
}

async function testConnection(){
  const el = document.getElementById('connectionResult');
  if(!el) return;
  const prov = document.getElementById('setProvider')?.value || 'deepseek';
  const key = _apiKeysCache[prov];
  if(!key){el.innerHTML='<span style="color:var(--accent)">⚠️ 未找到 API Key，请先保存</span>';return;}
  el.innerHTML = '<span style="color:var(--text-dim)">⏳ 正在连接...</span>';
  try{
    const pc = PROVIDER_CONFIG[prov] || PROVIDER_CONFIG.deepseek;
    const baseUrl = prov==='custom' ? (document.getElementById('setCustomUrl')?.value || '') : (pc.base_url || 'https://api.deepseek.com');
    const url = baseUrl.replace(/\/+$/,'') + '/chat/completions';
    const resp = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model:DB.config?.model||'deepseek-v4-flash',messages:[{role:'user',content:'回复"连接成功"四个字'}],max_tokens:50})
    });
    const data = await resp.json();
    if(resp.ok && data.choices){
      el.innerHTML = '<span style="color:var(--green)">✅ 连接成功！模型返回: "' + data.choices[0].message.content + '"</span>';
    } else {
      el.innerHTML = '<span style="color:var(--accent)">❌ 连接失败: ' + (data.error?.message||'HTTP '+resp.status) + '</span>';
    }
  } catch(e){
    el.innerHTML = '<span style="color:var(--accent)">❌ 网络错误: ' + e.message + '</span>';
  }
}

function saveSettings(){
  const cfg = DB.config;
  cfg.provider = document.getElementById('setProvider').value;
  const modelEl = document.getElementById('setModel');
  cfg.model = cfg.provider==='custom' ? (modelEl?.value || '') : modelEl?.value;
  // 从加密存储同步 Key
  const keyInput = document.getElementById('setApiKey');
  if(keyInput && !keyInput.disabled){
    const key = keyInput.value.trim();
    if(key){_apiKeysCache[cfg.provider]=key;_saveApiKeys(_apiKeysCache);}
  }
  // 自定义供应商额外字段
  if(cfg.provider==='custom'){
    cfg.customModel = cfg.model;
    cfg.customUrl = document.getElementById('setCustomUrl')?.value || '';
  }
  cfg.qualityGate.passThreshold = parseInt(document.getElementById('qg_pass_v').textContent);
  cfg.qualityGate.reviseThreshold = parseInt(document.getElementById('qg_revise_v').textContent);
  cfg.qualityGate.maxIterations = parseInt(document.getElementById('qg_iter_v').textContent);
  cfg.qualityGate.strictMinDim = parseInt(document.getElementById('qg_min_v').textContent);
  cfg.reviewWeights.strict = parseFloat(document.getElementById('rw_strict_v').textContent);
  cfg.reviewWeights.moderate = parseFloat(document.getElementById('rw_moderate_v').textContent);
  cfg.reviewWeights.lenient = parseFloat(document.getElementById('rw_lenient_v').textContent);
  ['writer','strict','moderate','lenient','voter','skill'].forEach(rk=>{
    const elM = document.getElementById('rp_'+rk+'_model');
    const elT = document.getElementById('rp_'+rk+'_temp_v');
    const elMT = document.getElementById('rp_'+rk+'_mt');
    if(elM) cfg.roleParams[rk] = {model:elM.value, temperature:parseFloat(elT?.textContent||0.5), maxTokens:parseInt(elMT?.value||4096)};
  });
  DIM_KEYS.forEach(k=>{
    const el = document.getElementById('dw_'+k+'_v');
    if(el) cfg.dimWeights[k] = parseFloat(el.textContent);
  });
  saveDB();
  toast('✅ 全部配置已保存');
}

// ═══════ 初始化 ═══════
document.querySelectorAll('.lang-btn').forEach(b=>{
  b.addEventListener('click',()=>setLang(b.dataset.lang));
});

// ═══════ 服务器状态检测 ═══════
let _serverOnline = false;
async function checkServerNow(){
  const dot = document.getElementById('serverDot');
  const text = document.getElementById('serverText');
  dot.style.background = '#FFA500'; text.textContent = '检测中...';
  try {
    const resp = await fetch('http://127.0.0.1:8899/api/health', {cache:'no-store'});
    if(resp.ok){
      _serverOnline = true;
      dot.style.background = '#00C853';
      text.textContent = '服务器在线';
      text.style.color = 'var(--green)';
    } else {
      throw new Error();
    }
  } catch(e){
    _serverOnline = false;
    dot.style.background = '#FF1744';
    text.innerHTML = '服务器离线 - <span style="color:var(--accent);text-decoration:underline">点击查看帮助</span>';
    text.style.color = 'var(--text-dim)';
    // 弹出提示
    const helpMsg = '<h3>🚀 服务器未启动</h3><p style="font-size:14px;color:var(--text-dim);margin:12px 0">需要先启动本地服务器才能使用全部功能。</p><div style="background:rgba(0,0,0,.3);padding:12px;border-radius:6px;font-family:monospace;font-size:13px;line-height:1.8">方法1：双击项目文件夹中的 <b>start_server.bat</b><br><br>方法2：在终端运行：<br>.venv\\Scripts\\python server.py</div><p style="font-size:13px;color:var(--text-dim);margin:12px 0">启动后刷新页面即可。</p>';
    showModal(helpMsg, [{text:'知道了',cls:'btn-primary',fn:closeModal}]);
  }
}
// 每15秒检测一次
checkServerNow();
setInterval(checkServerNow, 15000);

// 加载数据（磁盘主存储 → localStorage 缓存）
initApp().then(() => {
  updateLockBadge();
  navigateTo('project');
});
