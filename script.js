"use strict";
// ══════════════════════════════════════
// DATA
// ══════════════════════════════════════
const ALGOS = {
  bfs:   {name:"Breadth-First Search",short:"BFS",    color:"#00f7ff",ql:"Queue (FIFO)",    desc:"Explores <b>level by level</b> — like ripples in water. Uses a Queue (FIFO). Always finds the shortest path.",use:"Best when you need the shortest path.",time:"O(V+E)",   space:"O(V)",optimal:"✅ Yes",complete:"✅ Yes",tag:"OPTIMAL"},
  dfs:   {name:"Depth-First Search",  short:"DFS",    color:"#a78bfa",ql:"Stack (LIFO)",    desc:"Dives <b>as deep as possible</b> before backtracking. Uses a Stack (LIFO). Not always the shortest path.",use:"Best when you just need any path.",time:"O(V+E)",   space:"O(V)",optimal:"❌ No", complete:"⚠️ May loop",tag:"EXPLORATORY"},
  bestfs:{name:"Best-First Search",   short:"Best-FS",color:"#f472b6",ql:"Priority Queue (h(n))",desc:"Always picks the node <b>closest to goal</b> by heuristic. Greedy — fast but not always optimal.",use:"Best when speed matters more than optimality.",time:"O(V+E)",   space:"O(V)",optimal:"❌ No", complete:"⚠️ Depends",tag:"GREEDY"},
  ucs:   {name:"Uniform Cost Search", short:"UCS",    color:"#34d399",ql:"Priority Queue (g(n))",desc:"Expands the <b>cheapest cumulative path</b> first. Optimal even with different edge weights.",use:"Best when edges have different costs.",time:"O(V+E logV)",space:"O(V)",optimal:"✅ Yes",complete:"✅ Yes",tag:"COST-OPTIMAL"},
  iddfs: {name:"Iterative Deepening DFS",short:"IDDFS",color:"#fb923c",ql:"Recursion Stack", desc:"DFS with increasing <b>depth limits</b>. BFS-optimal result with very low memory usage.",use:"Best when low memory + optimal path needed.",time:"O(b^d)",    space:"O(d)",optimal:"✅ Yes",complete:"✅ Yes",tag:"LOW MEMORY"},
};

const CODES = {
  bfs:{
    python:["from collections import deque","def bfs(start, goal):","    queue = deque([start])","    visited = set([start])","    while queue:","        node = queue.popleft()","        if node == goal: return True","        for n in neighbors(node):","            if n not in visited:","                visited.add(n)","                queue.append(n)"],
    c:["#include <stdio.h>","void bfs(int start, int goal) {","    int q[1000], f=0, r=0;","    bool vis[1000] = {false};","    q[r++] = start; vis[start] = true;","    while (f < r) {","        int node = q[f++];","        if (node == goal) return;","        for each unvisited neighbor nb:","            vis[nb] = true;","            q[r++] = nb;","    }","}"],
    cpp:["#include <queue>","#include <set>","void bfs(int start, int goal) {","    queue<int> q;","    set<int> vis;","    q.push(start); vis.insert(start);","    while (!q.empty()) {","        int node = q.front(); q.pop();","        if (node == goal) return;","        for (int nb : neighbors(node))","            if (!vis.count(nb)) {","                vis.insert(nb);","                q.push(nb);","            }","    }","}"]
  },
  dfs:{
    python:["def dfs(start, goal):","    stack = [start]","    visited = set()","    while stack:","        node = stack.pop()  # LIFO!","        if node in visited: continue","        visited.add(node)","        if node == goal: return True","        for n in neighbors(node):","            if n not in visited:","                stack.append(n)"],
    c:["#include <stdio.h>","void dfs(int start, int goal) {","    int stack[1000], top = 0;","    bool vis[1000] = {false};","    stack[top++] = start;","    while (top > 0) {","        int node = stack[--top]; // LIFO","        if (vis[node]) continue;","        vis[node] = true;","        if (node == goal) return;","        for each neighbor nb:","            stack[top++] = nb;","    }","}"],
    cpp:["#include <stack>","#include <set>","void dfs(int start, int goal) {","    stack<int> st;","    set<int> vis;","    st.push(start);","    while (!st.empty()) {","        int node = st.top(); st.pop();","        if (vis.count(node)) continue;","        vis.insert(node);","        if (node == goal) return;","        for (int nb : neighbors(node))","            st.push(nb);","    }","}"]
  },
  bestfs:{
    python:["import heapq","def best_first(start, goal):","    h = lambda n: manhattan(n, goal)","    pq = [(h(start), start)]","    visited = set()","    while pq:","        _, node = heapq.heappop(pq)","        if node in visited: continue","        visited.add(node)","        if node == goal: return True","        for n in neighbors(node):","            if n not in visited:","                heapq.heappush(pq, (h(n), n))"],
    c:["// MinHeap ordered by h(n)","void best_first(int start, int goal) {","    MinHeap pq;","    bool vis[1000] = {false};","    pq.push(h(start), start);","    while (!pq.empty()) {","        int node = pq.pop_min();","        if (vis[node]) continue;","        vis[node] = true;","        if (node == goal) return;","        for each neighbor nb:","            pq.push(h(nb), nb);","    }","}"],
    cpp:["#include <queue>","void best_first(int start, int goal) {","    // {heuristic, node}","    priority_queue<pair<int,int>,","        vector<pair<int,int>>, greater<>> pq;","    set<int> vis;","    pq.push({h(start), start});","    while (!pq.empty()) {","        auto [hv, node] = pq.top(); pq.pop();","        if (vis.count(node)) continue;","        vis.insert(node);","        if (node == goal) return;","        for (int nb : neighbors(node))","            pq.push({h(nb), nb});","    }","}"]
  },
  ucs:{
    python:["import heapq","def ucs(start, goal):","    pq = [(0, start)]","    visited = {}","    while pq:","        cost, node = heapq.heappop(pq)","        if node in visited: continue","        visited[node] = cost","        if node == goal: return cost","        for n, w in neighbors(node):","            if n not in visited:","                heapq.heappush(pq, (cost+w, n))"],
    c:["// MinHeap ordered by g(n)","void ucs(int start, int goal) {","    MinHeap pq;","    int dist[1000]; fill(dist, INF);","    dist[start] = 0; pq.push(0, start);","    while (!pq.empty()) {","        int cost = pq.top_cost();","        int node = pq.pop_min();","        if (node == goal) return;","        for each neighbor nb with weight w:","            if (dist[node]+w < dist[nb]) {","                dist[nb] = dist[node]+w;","                pq.push(dist[nb], nb);","            }","    }","}"],
    cpp:["void ucs(int start, int goal) {","    // {cost, node}","    priority_queue<pair<int,int>,","        vector<pair<int,int>>, greater<>> pq;","    map<int,int> dist;","    pq.push({0, start});","    while (!pq.empty()) {","        auto [cost, node] = pq.top(); pq.pop();","        if (dist.count(node)) continue;","        dist[node] = cost;","        if (node == goal) return;","        for (auto [nb, w] : neighbors(node))","            pq.push({cost + w, nb});","    }","}"]
  },
  iddfs:{
    python:["def iddfs(start, goal):","    depth = 0","    while True:","        if dls(start, goal, depth): return True","        depth += 1","","def dls(node, goal, limit):","    if node == goal: return True","    if limit == 0: return False","    for n in neighbors(node):","        if dls(n, goal, limit-1): return True","    return False"],
    c:["int dls(int node, int goal, int lim) {","    if (node == goal) return 1;","    if (lim == 0) return 0;","    for each neighbor nb:","        if (dls(nb, goal, lim-1)) return 1;","    return 0;","}","void iddfs(int start, int goal) {","    for (int d = 0; ; d++)","        if (dls(start, goal, d)) return;","}"],
    cpp:["bool dls(int n, int g, int lim, set<int>& vis) {","    if (n == g) return true;","    if (lim == 0) return false;","    vis.insert(n);","    for (int nb : neighbors(n))","        if (!vis.count(nb))","            if (dls(nb, g, lim-1, vis)) return true;","    vis.erase(n); // backtrack","    return false;","}","void iddfs(int s, int g) {","    for (int d = 0; ; d++) {","        set<int> vis;","        if (dls(s, g, d, vis)) return;","    }","}"]
  },
};

const CEX = {
  bfs:{
    python:{0:"Import deque — efficient FIFO queue.",2:"Queue = who to visit next.",4:"Keep going while nodes remain.",5:"Take FIRST node — FIFO. This makes BFS expand level by level!",6:"Goal found!",8:"Check all neighbors.",10:"Add unvisited neighbor to queue."},
    c:{1:"BFS function takes start and goal.",2:"Array q acts as queue. f=front, r=rear.",4:"Add start to queue and mark visited.",5:"Loop while queue has items.",6:"Dequeue from front — FIFO order.",7:"Goal reached — stop!",9:"Mark neighbour visited and enqueue."},
    cpp:{3:"STL queue — efficient FIFO structure.",4:"Set tracks visited nodes.",5:"Push start, mark visited.",6:"Loop while queue not empty.",7:"Front = oldest element. pop() removes it.",8:"Goal reached!",9:"Loop over neighbours.",11:"Insert to set = mark visited, push to queue."}
  },
  dfs:{
    python:{1:"Stack = LIFO — last pushed, first popped.",3:"Loop while stack has nodes.",4:"Pop from TOP — LIFO. This sends DFS DEEP!",5:"Skip if already visited.",9:"Push neighbour — DFS dives here next."},
    c:{2:"Array acts as stack. top tracks the top index.",4:"Push start onto stack.",5:"Loop while stack not empty.",6:"Pop from top — LIFO! Last in, first out.",7:"Skip already-visited nodes.",9:"Goal reached — stop!",11:"Push neighbours — DFS explores the last one first."},
    cpp:{3:"STL stack — LIFO data structure.",5:"Push start node.",6:"Loop while stack not empty.",7:"top() peeks, pop() removes — LIFO order.",8:"Skip visited nodes.",9:"Goal reached!",10:"Loop over neighbours — push all, explore deepest next."}
  },
  bestfs:{
    python:{2:"h(n) = Manhattan distance to goal. Pure estimate.",3:"Priority queue — smallest h(n) expanded first.",6:"Pop node with LOWEST heuristic — greedy choice!",12:"Push with heuristic priority."},
    c:{1:"MinHeap ordered by h(n) — smallest heuristic first.",3:"Push start with its heuristic value.",4:"Loop while heap not empty.",5:"Pop node with minimum heuristic — greedy!",7:"Goal reached!",9:"Push neighbours with their heuristic values."},
    cpp:{3:"priority_queue with greater<> = min-heap.",5:"Push start with h(start).",6:"Loop while heap not empty.",7:"top() gives minimum heuristic. pop() removes it.",8:"Skip visited nodes.",9:"Goal reached!",11:"Push neighbour with h(nb) — sorted by heuristic."}
  },
  ucs:{
    python:{2:"pq stores (cost, node). Cheapest path first.",5:"Pop CHEAPEST path so far — guarantees optimal!",8:"Goal — return total cost!",10:"Add with cumulative cost."},
    c:{3:"dist array tracks best known cost to each node.",4:"Start at cost 0.",5:"Loop while heap not empty.",6:"Pop minimum cost node.",7:"Goal reached!",8:"For each neighbour: if cheaper path found, update."},
    cpp:{2:"priority_queue with greater<> = min-heap by cost.",5:"Push start at cost 0.",6:"Loop while heap not empty.",7:"top() gives cheapest. pop() removes it.",8:"Skip if already finalised.",9:"Goal reached!",11:"Push neighbour with cumulative cost."}
  },
  iddfs:{
    python:{0:"Run DFS multiple times with increasing depth limits.",3:"Run DLS = Depth-Limited Search.",7:"DLS = DFS with a max depth ceiling.",8:"Base case: at goal!",9:"Hit depth limit — backtrack!",10:"Try neighbour with limit-1."},
    c:{0:"DLS = DFS with depth ceiling.",1:"Base case: at goal!",2:"Base case: depth limit hit — stop going deeper.",3:"Try each neighbour recursively.",7:"IDDFS: increase depth limit each round.",8:"Run DLS with limit d.",9:"If not found, try d+1."},
    cpp:{0:"DLS with visited set to avoid cycles on current path.",1:"Base case: at goal!",2:"Base case: depth limit hit.",3:"Add current node to visited.",4:"Try each unvisited neighbour.",6:"Recurse with limit-1.",7:"Backtrack: remove from visited.",11:"IDDFS: loop increasing depth.",12:"Fresh visited set each round.",13:"Stop when path found."}
  },
};

// ══════════════════════════════════════
// STATE
// ══════════════════════════════════════
let algo="bfs", lang="python", mode="grid";
let sz=8,ROWS=8,COLS=8, gridArr, startP, goalP, lastC;
let running=false, paused=false, stepRes=null;

// custom graph
let cgNodes=[],cgEdges=[],cgStart=null,cgGoal=null;
let cgTool_="node",cgSrc=null,cgVis=new Set(),cgCur=null,cgPath=new Set();
let cgRunning=false,cgPaused=false,cgStepRes=null;
let cgDrag=null,cgDX=0,cgDY=0,cgCtxId=null,cgIdN=0;
function cgID(){return"n"+(++cgIdN);}

// ══════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════
function toggleSB(){document.getElementById("sidebar").classList.toggle("open");document.getElementById("sbo").classList.toggle("show");}
function closeSB(){document.getElementById("sidebar").classList.remove("open");document.getElementById("sbo").classList.remove("show");}

// ══════════════════════════════════════
// PAGES
// ══════════════════════════════════════
function showPage(p){
  document.querySelectorAll(".page").forEach(el=>el.classList.remove("on"));
  document.getElementById("page-"+p).classList.add("on");
  document.querySelectorAll(".nav-item").forEach(el=>el.classList.remove("active"));
  const map={viz:0,about:1,compare:2};
  document.querySelectorAll("#sb-nav .nav-item")[map[p]]?.classList.add("active");
  closeSB();
  if(p==="compare")buildDemos();
}

// ══════════════════════════════════════
// ALGORITHM SELECT
// ══════════════════════════════════════
function selectAlgo(a){
  algo=a;
  const I=ALGOS[a];
  ["bfs","dfs","bestfs","ucs","iddfs"].forEach(k=>{
    document.getElementById("nav-"+k).classList.toggle("active-algo",k===a);
  });
  const d=document.getElementById("adot");
  d.style.background=I.color; d.style.boxShadow="0 0 8px "+I.color;
  document.getElementById("algo-label").textContent=I.name;
  document.getElementById("algo-desc").textContent=I.use;
  document.getElementById("cm-name").textContent=I.short;
  document.getElementById("cm-name").style.color=I.color;
  document.getElementById("cm-time").textContent=I.time;
  document.getElementById("cm-space").textContent=I.space;
  document.getElementById("cm-opt").textContent=I.optimal;
  document.getElementById("cm-comp").textContent=I.complete;
  document.getElementById("panel-title").innerHTML="📖 What is "+I.short+"?";
  document.getElementById("algo-info").innerHTML=I.desc+'<br><br><span class="atag" style="border-color:'+I.color+';color:'+I.color+'">'+I.tag+'</span> <small style="color:var(--text3)">'+I.use+'</small>';
  document.getElementById("qlabel").textContent="📦 "+I.ql;
  displayCode();
  closeSB();
}

// ══════════════════════════════════════
// CODE
// ══════════════════════════════════════
function displayCode(){
  const panel=document.getElementById("codePanel");
  panel.innerHTML="";
  ((CODES[algo]||{})[lang]||[]).forEach((line,i)=>{
    const p=document.createElement("p");
    p.innerText=line||" "; p.id="L"+i;
    panel.appendChild(p);
  });
  document.getElementById("codeEx").textContent="";
}
function changeLang(){lang=document.getElementById("langSel").value;displayCode();}
function hlLine(i){
  document.querySelectorAll("#codePanel p").forEach(p=>p.classList.remove("al"));
  const l=document.getElementById("L"+i);
  if(l){l.classList.add("al");l.scrollIntoView({block:"nearest"});}
  const ex=((CEX[algo]||{})[lang]||{})[i];
  document.getElementById("codeEx").textContent=ex?"💡 "+ex:"";
}

// ══════════════════════════════════════
// MODE SWITCH
// ══════════════════════════════════════
function setMode(m){
  mode=m;
  const isGrid=m==="grid";
  document.getElementById("grid-view").style.display=isGrid?"flex":"none";
  document.getElementById("graph-view").style.display=isGrid?"none":"flex";
  document.getElementById("ctrl-grid").style.display=isGrid?"flex":"none";
  document.getElementById("ctrl-graph").style.display=isGrid?"none":"flex";
  document.getElementById("ggPanel").style.display=isGrid?"flex":"none";
  document.getElementById("mbGrid").classList.toggle("on",isGrid);
  document.getElementById("mbGraph").classList.toggle("on",!isGrid);
  if(isGrid){
    showGridHint();
  } else {
    showGraphHint();
    displayCode();
    sizeCGCanvas();
    drawCG();
  }
}

// ══════════════════════════════════════
// HINT BAR
// ══════════════════════════════════════
function showGridHint(){
  document.getElementById("hintbar").innerHTML=`
    <div class="step on" id="s1"><span class="snum">1</span><span>Click → <b>Start</b></span></div>
    <span class="sarr">→</span>
    <div class="step" id="s2"><span class="snum">2</span><span>Click → <b>Goal</b></span></div>
    <span class="sarr">→</span>
    <div class="step" id="s3"><span class="snum">3</span><span>More → <b>Walls</b></span></div>
    <span class="sarr">→</span>
    <div class="step" id="s4"><span class="snum">4</span><span>Press <b>▶ Run</b></span></div>`;
}
function showGraphHint(){
  document.getElementById("hintbar").innerHTML=`<span id="cg-hint-bar" style="color:var(--cyan);font-weight:600">🟢 Tool: Add Node — click canvas to place a node</span><span style="color:var(--text3);margin-left:14px;font-size:11px">Right-click / Long-press node → Set Start / Goal / Delete</span>`;
  updateCGHint();
}
function updateCGHint(){
  const el=document.getElementById("cg-hint-bar")||document.getElementById("cg-hint");
  if(!el)return;
  if(cgTool_==="node"){
    el.textContent="🟢 Tool: Add Node — click canvas to place a node";
    el.style.color="var(--cyan)";
  } else {
    el.innerHTML=algo==="ucs"
      ? "⟶ Tool: Add Edge — click node 1 then node 2 (prompts for weight) &nbsp;|&nbsp; <span style='color:var(--text3)'>Click existing edge to edit weight</span>"
      : "⟶ Tool: Add Edge — click node 1 then node 2 &nbsp;|&nbsp; <span style='color:var(--text3)'>Click existing edge to edit weight</span>";
    el.style.color="var(--pink)";
  }
}

// ══════════════════════════════════════
// LOG
// ══════════════════════════════════════
function log(msg){
  const d=document.getElementById("log");
  const p=document.createElement("p");
  p.innerHTML=msg; d.appendChild(p);
  d.scrollTop=d.scrollHeight;
}
function clearLog(){document.getElementById("log").innerHTML="";}

// ══════════════════════════════════════
// QUEUE DISPLAY
// ══════════════════════════════════════
function showQ(items,lbl){
  const d=document.getElementById("qdisplay");
  const col=ALGOS[algo].color;
  if(!items||!items.length){d.innerHTML=`<span style="color:var(--text3);font-size:11px;padding:5px 10px;display:block">${lbl}: empty</span>`;return;}
  const shown=items.slice(0,10);
  let h=`<div class="qrow"><span class="qlbl">${lbl}:</span>`;
  shown.forEach((item,i)=>{
    const label=typeof item==="object"?item.label:item;
    const cost=typeof item==="object"&&item.cost!==undefined?`<span style="font-size:9px;color:var(--text3);margin-left:2px">(${item.cost})</span>`:"";
    h+=`<span class="qn" style="border-color:${col};color:${col}">${label}${cost}</span>`;
    if(i<shown.length-1)h+=`<span class="qarr">›</span>`;
  });
  if(items.length>10)h+=`<span class="qlbl">+${items.length-10}</span>`;
  h+="</div>";
  d.innerHTML=h;
}

// ══════════════════════════════════════
// STEPS
// ══════════════════════════════════════
function setStep(n){
  for(let i=1;i<=4;i++){
    const el=document.getElementById("s"+i);
    if(!el)continue;
    el.classList.remove("on","done");
    if(i<n)el.classList.add("done");
    if(i===n)el.classList.add("on");
  }
}

// ══════════════════════════════════════
// GRID
// ══════════════════════════════════════
function cellSz(){
  const vw=window.innerWidth;
  if(vw<=640){
    const avail=Math.min(vw,640)-80;
    const s=Math.floor(avail/COLS);
    return Math.max(22,Math.min(44,s));
  }
  return sz<=8?42:sz<=12?36:sz<=16?30:24;
}
function createGrid(){
  const v=parseInt(document.getElementById("sizeIn").value);
  if(!isNaN(v)&&v>=2&&v<=20){sz=v;ROWS=COLS=sz;}
  const g=document.getElementById("grid");
  g.innerHTML="";
  g.style.gridTemplateColumns=`repeat(${COLS},${cellSz()}px)`;
  document.getElementById("grid-view").style.setProperty("--cols", COLS);
  gridArr=Array.from({length:ROWS},()=>Array(COLS).fill(0));
  startP=null;goalP=null;lastC=null;running=false;
  setBtns(false);
  document.getElementById("grid-summary").classList.add("hide");
  setStep(1);clearLog();
  const ggcv=document.getElementById("ggCanvas");
  ggcv.getContext("2d").clearRect(0,0,ggcv.width,ggcv.height);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const cell=document.createElement("div");
    cell.classList.add("cell");
    cell.style.width=cell.style.height=cellSz()+"px";
    cell.dataset.r=r;cell.dataset.c=c;
    cell.addEventListener("click",()=>cellClick(cell,r,c));
    g.appendChild(cell);
  }
}
function cellClick(el,r,c){
  if(running)return;
  if(!startP){el.classList.add("S");startP=[r,c];log(`🟢 <b>Start</b> at (${r},${c})`);setStep(2);}
  else if(!goalP){if(el.classList.contains("S"))return;el.classList.add("G");goalP=[r,c];log(`🔴 <b>Goal</b> at (${r},${c})`);setStep(3);}
  else{if(el.classList.contains("S")||el.classList.contains("G"))return;el.classList.toggle("W");gridArr[r][c]^=1;log(gridArr[r][c]?`🧱 Wall at (${r},${c})`:`🟦 Wall removed (${r},${c})`);}
}
function resetGrid(){createGrid();}
function setBtns(r){running=r;document.getElementById("bPause").disabled=!r;document.getElementById("bStep").disabled=!r;}
function togglePause(){paused=!paused;document.getElementById("bPause").textContent=paused?"▶ Resume":"⏸ Pause";if(!paused&&stepRes){stepRes();stepRes=null;}}
function doStep(){if(paused&&stepRes){stepRes();stepRes=null;paused=true;document.getElementById("bPause").textContent="▶ Resume";}}
function tick(ms){return new Promise(r=>{if(paused){stepRes=r;}else setTimeout(r,ms);});}
function hlCell(r,c){
  const el=document.querySelector(`[data-r='${r}'][data-c='${c}']`);
  if(!el)return;
  if(lastC){lastC.classList.remove("C");if(!lastC.classList.contains("S")&&!lastC.classList.contains("G"))lastC.classList.add("V");}
  el.classList.add("C");lastC=el;
}

// ══════════════════════════════════════
// GRID ALGORITHMS
// ══════════════════════════════════════
function mh(r,c,gr,gc){return Math.abs(r-gr)+Math.abs(c-gc);}

function computeSteps(){
  const steps=[],K=(r,c)=>`${r},${c}`;
  const GR=goalP[0],GC=goalP[1],SR=startP[0],SC=startP[1];
  const dirs=[[0,1],[1,0],[0,-1],[-1,0]];
  const nbrs=(r,c)=>dirs.map(([dr,dc])=>[r+dr,c+dc]).filter(([nr,nc])=>nr>=0&&nc>=0&&nr<ROWS&&nc<COLS&&!gridArr[nr][nc]);
  const par={};let vis=new Set(),found=false;

  if(algo==="bfs"){
    const q=[[SR,SC]];vis.add(K(SR,SC));
    while(q.length){
      const[r,c]=q.shift();
      steps.push({t:"v",r,c,ln:5,q:q.map(([r,c])=>K(r,c))});
      if(r===GR&&c===GC){found=true;break;}
      for(const[nr,nc]of nbrs(r,c)){const nk=K(nr,nc);if(!vis.has(nk)){vis.add(nk);par[nk]=K(r,c);q.push([nr,nc]);steps.push({t:"e",nr,nc,ln:10,msg:`📥 (${nr},${nc}) → queue`,q:q.map(([r,c])=>K(r,c))});}}
    }
  } else if(algo==="dfs"){
    const st=[[SR,SC,null]];
    while(st.length){
      const[r,c,p]=st.pop();const k=K(r,c);
      if(vis.has(k))continue;vis.add(k);if(p!==null)par[k]=p;
      steps.push({t:"v",r,c,ln:4,q:st.map(([r,c])=>K(r,c))});
      if(r===GR&&c===GC){found=true;break;}
      for(const[nr,nc]of nbrs(r,c).reverse()){const nk=K(nr,nc);if(!vis.has(nk)){st.push([nr,nc,k]);steps.push({t:"e",nr,nc,ln:9,msg:`📥 (${nr},${nc}) → stack`,q:st.map(([r,c])=>K(r,c))});}}
    }
  } else if(algo==="bestfs"){
    const h=(r,c)=>mh(r,c,GR,GC);const pq=[[h(SR,SC),SR,SC]];
    while(pq.length){
      pq.sort((a,b)=>a[0]-b[0]);const[hv,r,c]=pq.shift();const k=K(r,c);
      if(vis.has(k))continue;vis.add(k);
      steps.push({t:"v",r,c,ln:6,msg:`🌸 (${r},${c}) h=${hv}`,q:pq.map(([h,r,c])=>({label:K(r,c),cost:"h="+h}))});
      if(r===GR&&c===GC){found=true;break;}
      for(const[nr,nc]of nbrs(r,c)){const nk=K(nr,nc);if(!vis.has(nk)){if(!par[nk])par[nk]=k;pq.push([h(nr,nc),nr,nc]);steps.push({t:"e",nr,nc,ln:12,msg:`📥 (${nr},${nc}) h=${h(nr,nc)}`,q:pq.map(([h,r,c])=>({label:K(r,c),cost:"h="+h}))});}}
    }
  } else if(algo==="ucs"){
    const pq=[[0,SR,SC]];const cost={[K(SR,SC)]:0};
    while(pq.length){
      pq.sort((a,b)=>a[0]-b[0]);const[g,r,c]=pq.shift();const k=K(r,c);
      if(vis.has(k))continue;vis.add(k);
      steps.push({t:"v",r,c,ln:5,msg:`🟢 (${r},${c}) g=${g}`,q:pq.map(([g,r,c])=>({label:K(r,c),cost:"g="+g}))});
      if(r===GR&&c===GC){found=true;break;}
      for(const[nr,nc]of nbrs(r,c)){const nk=K(nr,nc);const ng=g+1;if(!vis.has(nk)&&(cost[nk]===undefined||ng<cost[nk])){cost[nk]=ng;par[nk]=k;pq.push([ng,nr,nc]);steps.push({t:"e",nr,nc,ln:10,msg:`📥 (${nr},${nc}) g=${ng}`,q:pq.map(([g,r,c])=>({label:K(r,c),cost:"g="+g}))});}}
    }
  } else if(algo==="iddfs"){
    const MD=Math.min(ROWS+COLS,20),MS=1500;
    for(let d=0;d<=MD&&!found;d++){
      const rP={},pS=new Set(),rS=new Set();
      steps.push({t:"d",d,ln:2,msg:`🔁 <b>Round ${d}</b>: depth limit=${d}`});
      found=dlsS(SR,SC,null,d,steps,rP,pS,rS,K,nbrs,MS);
      for(const v of rS)vis.add(v);
      if(found)Object.assign(par,rP);
      if(steps.length>=MS){steps.push({t:"d",d,ln:2,msg:"⚠️ Step cap — IDDFS is slow on large grids. Try 5×5."});break;}
    }
  }

  if(found){
    let cur=K(...goalP);const sk=K(...startP);const path=[];let s=0;
    while(cur&&cur!==sk&&s++<ROWS*COLS){path.unshift(cur);cur=par[cur];}
    steps.push({t:"done",found:true,vc:vis.size,pl:path.length});
    path.forEach(k=>steps.push({t:"path",k}));
  } else steps.push({t:"done",found:false,vc:vis.size,pl:0});
  return steps;
}

function dlsS(r,c,p,lim,steps,par,pS,seen,K,nbrs,mx){
  if(steps.length>=mx)return false;
  const k=K(r,c);if(pS.has(k))return false;
  pS.add(k);seen.add(k);if(p!==null)par[k]=p;
  steps.push({t:"v",r,c,ln:7,msg:`🔶 DLS (${r},${c}) d=${lim}`});
  if(r===goalP[0]&&c===goalP[1])return true;
  if(lim===0){pS.delete(k);return false;}
  for(const[nr,nc]of nbrs(r,c)){if(pS.has(K(nr,nc)))continue;if(dlsS(nr,nc,k,lim-1,steps,par,pS,seen,K,nbrs,mx))return true;}
  pS.delete(k);return false;
}

async function runGrid(){
  if(!startP||!goalP){log("⚠️ Set <b>Start</b> and <b>Goal</b> first!");return;}
  if(running)return;
  document.querySelectorAll(".cell").forEach(el=>el.classList.remove("V","C","P"));
  lastC=null;paused=false;
  document.getElementById("bPause").textContent="⏸ Pause";
  document.getElementById("grid-summary").classList.add("hide");
  setStep(4);setBtns(true);clearLog();
  log(`🚀 <b>${ALGOS[algo].name}</b> starting...`);
  const steps=computeSteps();
  for(const s of steps){
    await tick(260);
    if(s.t==="v"){hlCell(s.r,s.c);if(s.ln!==undefined)hlLine(s.ln);log(s.msg||`🟡 Exploring (${s.r},${s.c})`);if(s.q)showQ(s.q,algo==="dfs"?"Stack":"Queue");}
    else if(s.t==="e"){if(s.ln!==undefined)hlLine(s.ln);log(s.msg||"📥 Added");}
    else if(s.t==="d"){hlLine(s.ln);log(s.msg);}
    else if(s.t==="path"){const[pr,pc]=s.k.split(",").map(Number);const el=document.querySelector(`[data-r='${pr}'][data-c='${pc}']`);if(el&&!el.classList.contains("S")&&!el.classList.contains("G")){el.classList.remove("V","C");el.classList.add("P");}}
    else if(s.t==="done"){setBtns(false);if(s.found){log("🎯 <b>Goal reached!</b>");log(`🟣 Purple = shortest path (${s.pl} steps)`);}else log("❌ <b>No path found</b>");showSumCard(s.vc,s.pl,s.found,"grid-summary","grid-sum-body");showQ([],"Done");}
  }
}

function showSumCard(vc,pl,found,cardId,bodyId){
  const c=ALGOS[algo].color;
  document.getElementById(bodyId).innerHTML=`
    <div class="sstat"><div class="sv">${vc}</div><div class="sl">EXPLORED</div></div>
    <div class="sstat"><div class="sv">${found?pl:"—"}</div><div class="sl">PATH LEN</div></div>
    <div class="sstat"><div class="sv">${found?"✅":"❌"}</div><div class="sl">${found?"FOUND":"NO PATH"}</div></div>
    <div class="sstat"><div class="sv" style="font-size:12px;color:${c}">${ALGOS[algo].short}</div><div class="sl">ALGO</div></div>`;
  document.getElementById(cardId).classList.remove("hide");
}

// ══════════════════════════════════════
// GRID → GRAPH VIEW
// ══════════════════════════════════════
const ggc=()=>document.getElementById("ggCanvas");
const ggx=()=>ggc().getContext("2d");
function runGG(){
  if(!startP){log("⚠️ Set start in grid first!");return;}
  const g={};
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    if(gridArr[r][c])continue;const n=`${r},${c}`;g[n]=[];
    [[0,1],[1,0],[0,-1],[-1,0]].forEach(([dr,dc])=>{const nr=r+dr,nc=c+dc;if(nr>=0&&nc>=0&&nr<ROWS&&nc<COLS&&!gridArr[nr][nc])g[n].push(`${nr},${nc}`);});
  }
  const cv=ggc();const w=cv.width,h=cv.height;
  const sp=Math.min((w-20)/Math.max(COLS-1,1),(h-20)/Math.max(ROWS-1,1));
  const pos={};
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)pos[`${r},${c}`]=[10+c*sp,10+r*sp];
  const start=`${startP[0]},${startP[1]}`,goal=goalP?`${goalP[0]},${goalP[1]}`:null;
  const queue=[start],vis=new Set([start]);
  const R=Math.max(3,Math.min(6,90/Math.max(ROWS,COLS)));
  function draw(cur){
    const ctx=ggx();ctx.clearRect(0,0,w,h);
    for(const nd in g)for(const n of g[nd]){ctx.beginPath();ctx.moveTo(...pos[nd]);ctx.lineTo(...pos[n]);ctx.strokeStyle="rgba(255,255,255,0.06)";ctx.lineWidth=1;ctx.stroke();}
    for(const nd in pos){if(!(nd in g))continue;const[x,y]=pos[nd];ctx.beginPath();ctx.arc(x,y,R,0,Math.PI*2);ctx.fillStyle=nd===cur?ALGOS[algo].color:nd===start?"#00ff88":nd===goal?"#ff4d4d":vis.has(nd)?"#1e5a8a":"#1e293b";ctx.fill();}
  }
  async function go(){
    while(queue.length){
      const nd=algo==="dfs"?queue.pop():queue.shift();
      if(!vis.has(nd))vis.add(nd);draw(nd);log(`🔵 Graph visiting <b>${nd}</b>`);
      await new Promise(r=>setTimeout(r,260));
      if(nd===goal){draw(null);log("🎯 <b>Graph goal reached!</b>");return;}
      for(const n of(g[nd]||[])){if(!vis.has(n)){vis.add(n);queue.push(n);}}
    }
    draw(null);log("✅ Graph traversal done.");
  }
  log(`🕸️ <b>Graph ${ALGOS[algo].short}</b> running...`);go();
}

// ══════════════════════════════════════
// CUSTOM GRAPH — CANVAS
// ══════════════════════════════════════
function sizeCGCanvas(){
  const gv=document.getElementById("graph-view");
  const cv=document.getElementById("cgCanvas");
  const w=gv.offsetWidth||600;
  const h=Math.max(gv.offsetHeight-60,300)||400;
  cv.width=w; cv.height=h;
}

function cgTool(t){
  cgTool_=t;
  // NOTE: do NOT reset cgSrc here — only reset on explicit cancel (Esc)
  document.getElementById("btnNode").classList.toggle("on",t==="node");
  document.getElementById("btnEdge").classList.toggle("on",t==="edge");
  const cv=document.getElementById("cgCanvas");
  cv.classList.remove("tool-node","tool-edge","tool-drag");
  cv.classList.add(t==="node"?"tool-node":"tool-edge");
  updateCGHint();drawCG();
}

function nodeAt(x,y){return cgNodes.find(n=>Math.hypot(n.x-x,n.y-y)<26);}

function edgeAt(x,y){
  const seen=new Set();
  const unique=[];
  for(const e of cgEdges){
    const key=[e.from,e.to].sort().join("|");
    if(!seen.has(key)){seen.add(key);unique.push(e);}
  }
  let best=null,bestDist=14;
  for(const e of unique){
    const a=cgNodes.find(n=>n.id===e.from),b=cgNodes.find(n=>n.id===e.to);
    if(!a||!b)continue;
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
    if(len<1)continue;
    const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(len*len)));
    const px=a.x+t*dx,py=a.y+t*dy;
    const dist=Math.hypot(x-px,y-py);
    if(dist<bestDist){bestDist=dist;best=e;}
  }
  return best;
}

function editEdgeWeight(e){
  const a=cgNodes.find(n=>n.id===e.from),b=cgNodes.find(n=>n.id===e.to);
  const lbl=(a?.label||"?")+"–"+(b?.label||"?");
  const val=prompt("Set weight for edge "+lbl+"\nCurrent: "+e.weight+"\n\nEnter new weight (positive number):",e.weight);
  if(val===null||val.trim()==="")return;
  const w=parseFloat(val);
  if(isNaN(w)||w<=0){alert("Enter a valid positive number (e.g. 3 or 2.5)");return;}
  let count=0;
  for(const ed of cgEdges){
    const sameDir=ed.from===e.from&&ed.to===e.to;
    const revDir =ed.from===e.to  &&ed.to===e.from;
    if(sameDir||revDir){ed.weight=w;count++;}
  }
  log(`✏️ Edge <b>${lbl}</b> → weight = <b>${w}</b> (updated ${count} edge${count>1?'s':''})`);
  drawCG();
}

// ── EDGE CONNECTION HELPER ──
// Centralised so both mouse and touch use identical logic.
// Returns true if an edge was created, false otherwise.
function handleEdgeClick(hitId){
  if(!cgSrc){
    // First click — select source node
    cgSrc=hitId;
    drawCG();
    return false;
  }
  if(hitId===cgSrc){
    // Clicked same node — deselect
    cgSrc=null;
    drawCG();
    return false;
  }
  // Second click — create edge
  const dir=document.getElementById("dirCk")?.checked;
  let weight=1;
  if(algo==="ucs"){
    const raw=prompt("Edge weight (leave blank for 1):",1);
    if(raw===null){
      // user cancelled prompt — keep cgSrc so they can try again
      return false;
    }
    const w=parseFloat(raw)||1;
    weight=isNaN(w)||w<=0?1:w;
  }
  cgEdges.push({from:cgSrc,to:hitId,weight});
  if(!dir)cgEdges.push({from:hitId,to:cgSrc,weight});
  const srcLabel=cgNodes.find(n=>n.id===cgSrc)?.label||"?";
  const dstLabel=cgNodes.find(n=>n.id===hitId)?.label||"?";
  log(`🔗 Edge <b>${srcLabel} → ${dstLabel}</b>${weight!==1?" (w="+weight+")":""}`);
  cgSrc=null;
  drawCG();
  return true;
}

function drawCG(){
  const cv=document.getElementById("cgCanvas");
  if(!cv||!cv.width)return;
  const ctx=cv.getContext("2d");
  const w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="rgba(255,255,255,0.025)";
  for(let x=25;x<w;x+=32)for(let y=25;y<h;y+=32){ctx.beginPath();ctx.arc(x,y,1,0,Math.PI*2);ctx.fill();}
  const col=ALGOS[algo].color;
  for(const e of cgEdges){
    const a=cgNodes.find(n=>n.id===e.from),b=cgNodes.find(n=>n.id===e.to);
    if(!a||!b)continue;
    const inP=cgPath.has(e.from)&&cgPath.has(e.to);
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=inP?"#a78bfa":"rgba(255,255,255,0.15)";ctx.lineWidth=inP?2.5:1.5;ctx.stroke();
    const showW=(algo==="ucs")||e.weight!==1;
    if(showW&&e.weight){
      const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
      ctx.fillStyle="rgba(253,230,138,0.15)";ctx.beginPath();ctx.roundRect(mx-12,my-16,24,14,4);ctx.fill();
      ctx.fillStyle="#fde68a";ctx.font="bold 10px monospace";ctx.textAlign="center";ctx.fillText(e.weight,mx,my-6);
    }
    if(document.getElementById("dirCk")?.checked)drawArrowCG(ctx,a.x,a.y,b.x,b.y);
  }
  const R=22;
  for(const nd of cgNodes){
    const iS=nd.id===cgStart,iG=nd.id===cgGoal,iC=nd.id===cgCur;
    const isVis=cgVis.has(nd.id),isPath=cgPath.has(nd.id),isSrc=nd.id===cgSrc;
    ctx.shadowBlur=0;
    if(iC||isSrc){ctx.shadowColor=col;ctx.shadowBlur=18;}
    else if(iS){ctx.shadowColor="#00ff88";ctx.shadowBlur=12;}
    else if(iG){ctx.shadowColor="#ff4d4d";ctx.shadowBlur=12;}
    ctx.beginPath();ctx.arc(nd.x,nd.y,R,0,Math.PI*2);
    ctx.fillStyle=iC?col:iS?"#00ff88":iG?"#ff4d4d":isPath?"#a78bfa":isVis?"#1e5a8a":isSrc?"rgba(0,247,255,0.12)":"#0d1528";
    ctx.strokeStyle=isSrc?col:iS?"#00ff88":iG?"#ff4d4d":iC?col:isPath?"#a78bfa":isVis?"#38bdf8":"rgba(255,255,255,0.18)";
    ctx.lineWidth=iC||isSrc?2.5:1.5;
    ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=(iC||isPath)?"#000":"#e2e8f0";
    ctx.font="bold 13px Arial";ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText(nd.label,nd.x,nd.y);
    if(nd.cost){ctx.fillStyle="rgba(250,204,21,0.9)";ctx.font="9px monospace";ctx.fillText(nd.cost,nd.x,nd.y+R+9);}
  }
  ctx.textBaseline="alphabetic";
}

function drawArrowCG(ctx,x1,y1,x2,y2){
  const ang=Math.atan2(y2-y1,x2-x1),r=24;
  const ex=x2-r*Math.cos(ang),ey=y2-r*Math.sin(ang);
  const ah=9,aw=Math.PI/7;
  ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-ah*Math.cos(ang-aw),ey-ah*Math.sin(ang-aw));ctx.lineTo(ex-ah*Math.cos(ang+aw),ey-ah*Math.sin(ang+aw));ctx.closePath();
  ctx.fillStyle="rgba(255,255,255,0.35)";ctx.fill();
}

// ══════════════════════════════════════
// MOUSE / TOUCH
// ══════════════════════════════════════
function cgPt(e){const r=document.getElementById("cgCanvas").getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}

let _longPressTimer=null;
let _swallowNextClick=false;

document.addEventListener("DOMContentLoaded",()=>{
  const cv=document.getElementById("cgCanvas");

  // ── MOUSE DOWN ──
  cv.addEventListener("mousedown",e=>{
    if(e.button!==0)return; // left click only
    const{x,y}=cgPt(e);
    const hit=nodeAt(x,y);

    if(cgTool_==="node"){
      if(hit){
        // drag
        cgDrag=hit;cgDX=x-hit.x;cgDY=y-hit.y;
        cv.classList.add("tool-drag");
      } else {
        // place new node
        cgNodes.push({id:cgID(),label:nextLabel(),x,y,cost:null});
        drawCG();
      }
    } else {
      // ── EDGE TOOL ──
      if(hit){
        // clicked a node — delegate to central handler
        handleEdgeClick(hit.id);
      } else {
        // clicked empty space — check for edge weight edit
        const eHit=edgeAt(x,y);
        if(eHit) editEdgeWeight(eHit);
        // do NOT reset cgSrc when clicking empty space
      }
    }
  });

  // ── MOUSE MOVE ──
  cv.addEventListener("mousemove",e=>{
    if(!cgDrag)return;
    const{x,y}=cgPt(e);
    cgDrag.x=x-cgDX;cgDrag.y=y-cgDY;
    drawCG();
  });

  // ── MOUSE UP ──
  cv.addEventListener("mouseup",()=>{
    if(cgDrag){
      cgDrag=null;
      cv.classList.remove("tool-drag");
      cv.classList.add(cgTool_==="node"?"tool-node":"tool-edge");
    }
  });

  // ── RIGHT CLICK (desktop context menu) ──
  cv.addEventListener("contextmenu",e=>{
    e.preventDefault();
    const{x,y}=cgPt(e),hit=nodeAt(x,y);
    if(hit){
      cgCtxId=hit.id;
      const m=document.getElementById("ctx");
      m.classList.remove("hide");
      // keep menu on screen
      const mw=160,mh=100;
      const left=Math.min(e.clientX,window.innerWidth-mw-8);
      const top =Math.min(e.clientY,window.innerHeight-mh-8);
      m.style.left=left+"px";
      m.style.top =top+"px";
    }
  });

  // ── TOUCH START ──
  cv.addEventListener("touchstart",e=>{
    e.preventDefault();
    const t=e.touches[0];
    const rect=cv.getBoundingClientRect();
    const x=t.clientX-rect.left,y=t.clientY-rect.top;
    const hit=nodeAt(x,y);

    // Long-press → context menu
    _longPressTimer=setTimeout(()=>{
      _longPressTimer=null;
      if(hit){
        cgCtxId=hit.id;
        const m=document.getElementById("ctx");
        m.classList.remove("hide");
        const mw=160,mh=100;
        const left=Math.min(t.clientX+10,window.innerWidth-mw-8);
        const top =Math.max(8,Math.min(t.clientY-60,window.innerHeight-mh-8));
        m.style.left=left+"px";
        m.style.top =top+"px";
        _swallowNextClick=true;
      }
    },500);

    if(cgTool_==="node"){
      if(hit){
        cgDrag=hit;cgDX=x-hit.x;cgDY=y-hit.y;
      } else {
        cgNodes.push({id:cgID(),label:nextLabel(),x,y,cost:null});
        drawCG();
      }
    } else {
      // ── EDGE TOOL (touch) ──
      if(hit){
        handleEdgeClick(hit.id);
      } else {
        const eHit=edgeAt(x,y);
        if(eHit) editEdgeWeight(eHit);
        // do NOT reset cgSrc
      }
    }
  },{passive:false});

  // ── TOUCH MOVE ──
  cv.addEventListener("touchmove",e=>{
    e.preventDefault();
    if(_longPressTimer){clearTimeout(_longPressTimer);_longPressTimer=null;}
    if(!cgDrag)return;
    const t=e.touches[0];
    const rect=cv.getBoundingClientRect();
    cgDrag.x=t.clientX-rect.left-cgDX;
    cgDrag.y=t.clientY-rect.top -cgDY;
    drawCG();
  },{passive:false});

  // ── TOUCH END ──
  cv.addEventListener("touchend",()=>{
    if(_longPressTimer){clearTimeout(_longPressTimer);_longPressTimer=null;}
    cgDrag=null;
  });

  // ── GLOBAL CLICK — close context menu ──
  document.addEventListener("click",e=>{
    if(_swallowNextClick){_swallowNextClick=false;return;}
    const menu=document.getElementById("ctx");
    if(!menu.classList.contains("hide")&&!menu.contains(e.target)){
      menu.classList.add("hide");
    }
  });
});

function nextLabel(){const idx=cgNodes.length;return idx<26?String.fromCharCode(65+idx):"N"+idx;}

function ctxDo(a){
  if(!cgCtxId)return;
  const nd=cgNodes.find(n=>n.id===cgCtxId);
  if(a==="start"){cgStart=cgCtxId;log(`🟢 <b>${nd?.label}</b> = Start`);}
  else if(a==="goal"){cgGoal=cgCtxId;log(`🔴 <b>${nd?.label}</b> = Goal`);}
  else{
    cgNodes=cgNodes.filter(n=>n.id!==cgCtxId);
    cgEdges=cgEdges.filter(e=>e.from!==cgCtxId&&e.to!==cgCtxId);
    if(cgStart===cgCtxId)cgStart=null;
    if(cgGoal===cgCtxId)cgGoal=null;
  }
  cgCtxId=null;
  document.getElementById("ctx").classList.add("hide");
  drawCG();
}

// TYPE EDGES
function openEM(){document.getElementById("edge-modal").classList.remove("hide");}
function closeEM(){document.getElementById("edge-modal").classList.add("hide");}
function buildFromText(){
  const raw=document.getElementById("etInput").value.trim();
  if(!raw){log("⚠️ Enter edges first!");return;}
  const dir=document.getElementById("dirCk").checked;
  const lines=raw.split(/[\n,]+/).map(l=>l.trim()).filter(Boolean);
  const map={};cgNodes=[];cgEdges=[];cgStart=null;cgGoal=null;cgVis=new Set();cgCur=null;cgPath=new Set();cgIdN=0;
  const cv=document.getElementById("cgCanvas");
  const w=cv.width||500,h=cv.height||380;
  function getN(lbl){
    if(!map[lbl]){const nd={id:cgID(),label:lbl,x:0,y:0,cost:null};cgNodes.push(nd);map[lbl]=nd;}
    return map[lbl];
  }
  for(const line of lines){
    const m=line.match(/^([A-Za-z0-9]+)\s*[-–>]+\s*([A-Za-z0-9]+)(?:\s*:\s*(\d+\.?\d*))?$/);
    if(!m){log(`⚠️ Skipped: "${line}"`);continue;}
    const a=getN(m[1]),b=getN(m[2]),wt=m[3]?parseFloat(m[3]):1;
    cgEdges.push({from:a.id,to:b.id,weight:wt});
    if(!dir)cgEdges.push({from:b.id,to:a.id,weight:wt});
  }
  const tot=cgNodes.length,cx=w/2,cy=h/2,rx=Math.min(w,h)*0.36;
  cgNodes.forEach((nd,i)=>{const ang=(2*Math.PI*i/tot)-Math.PI/2;nd.x=cx+rx*Math.cos(ang);nd.y=cy+rx*Math.sin(ang);});
  if(cgNodes.length>0)cgStart=cgNodes[0].id;
  if(cgNodes.length>1)cgGoal=cgNodes[cgNodes.length-1].id;
  closeEM();drawCG();
  log(`✅ <b>${cgNodes.length} nodes</b>, <b>${lines.filter(l=>/[-–>]/.test(l)).length} edges</b>`);
  log(`🟢 Start=<b>${cgNodes.find(n=>n.id===cgStart)?.label}</b>  🔴 Goal=<b>${cgNodes.find(n=>n.id===cgGoal)?.label}</b>`);
}

function cgClear(){
  cgNodes=[];cgEdges=[];cgStart=null;cgGoal=null;
  cgVis=new Set();cgCur=null;cgPath=new Set();cgIdN=0;
  cgSrc=null; // also clear any pending edge source
  document.getElementById("cg-summary").classList.add("hide");
  clearLog();drawCG();
}

// CG PAUSE/STEP
function setCGBtns(r){cgRunning=r;document.getElementById("bGPause").disabled=!r;document.getElementById("bGStep").disabled=!r;}
function toggleCGPause(){cgPaused=!cgPaused;document.getElementById("bGPause").textContent=cgPaused?"▶ Resume":"⏸ Pause";if(!cgPaused&&cgStepRes){cgStepRes();cgStepRes=null;}}
function doCGStep(){if(cgPaused&&cgStepRes){cgStepRes();cgStepRes=null;cgPaused=true;document.getElementById("bGPause").textContent="▶ Resume";}}
function cgTick(ms){return new Promise(r=>{if(cgPaused){cgStepRes=r;}else setTimeout(r,ms);});}

async function runCG(){
  if(cgNodes.length<2){log("⚠️ Need at least 2 nodes!");return;}
  if(!cgStart){log("⚠️ Right-click / long-press a node → Set as Start");return;}
  if(!cgGoal){log("⚠️ Right-click / long-press a node → Set as Goal");return;}
  if(cgRunning)return;
  cgVis=new Set();cgCur=null;cgPath=new Set();
  cgNodes.forEach(n=>n.cost=null);
  document.getElementById("cg-summary").classList.add("hide");
  setCGBtns(true);cgPaused=false;
  document.getElementById("bGPause").textContent="⏸ Pause";
  clearLog();displayCode();
  const sL=cgNodes.find(n=>n.id===cgStart)?.label,gL=cgNodes.find(n=>n.id===cgGoal)?.label;
  log(`🚀 <b>${ALGOS[algo].name}</b>  Start:<b>${sL}</b> → Goal:<b>${gL}</b>`);
  const adj={};for(const n of cgNodes)adj[n.id]=[];
  for(const e of cgEdges)if(adj[e.from])adj[e.from].push({id:e.to,w:e.weight||1});
  const par={};let vo=[],found=false;
  const NL=(id)=>cgNodes.find(n=>n.id===id)?.label||"?";

  if(algo==="bfs"){
    const q=[cgStart],vis=new Set([cgStart]);
    while(q.length){
      await cgTick(420);const id=q.shift();
      cgCur=id;cgVis.add(id);vo.push(id);hlLine(5);
      log(`🟡 <b>Visiting ${NL(id)}</b>`);showQ(q.map(id=>({label:NL(id)})),"Queue");drawCG();
      if(id===cgGoal){found=true;break;}
      for(const nb of(adj[id]||[])){if(!vis.has(nb.id)){vis.add(nb.id);par[nb.id]=id;q.push(nb.id);log(`📥 → <b>${NL(nb.id)}</b>`);}}
    }
  } else if(algo==="dfs"){
    const st=[{id:cgStart,p:null}],vis=new Set();
    while(st.length){
      await cgTick(420);const{id,p}=st.pop();
      if(vis.has(id))continue;vis.add(id);if(p!==null)par[id]=p;
      cgCur=id;cgVis.add(id);vo.push(id);hlLine(4);
      log(`🟣 <b>Visiting ${NL(id)}</b> (stack pop)`);showQ(st.map(s=>({label:NL(s.id)})),"Stack");drawCG();
      if(id===cgGoal){found=true;break;}
      for(const nb of[...(adj[id]||[])].reverse()){if(!vis.has(nb.id))st.push({id:nb.id,p:id});}
    }
  } else if(algo==="bestfs"){
    const gNd=cgNodes.find(n=>n.id===cgGoal);
    const h=id=>{const n=cgNodes.find(n=>n.id===id);return n&&gNd?Math.hypot(n.x-gNd.x,n.y-gNd.y):0;};
    const pq=[[h(cgStart),cgStart]],vis=new Set();
    while(pq.length){
      await cgTick(420);pq.sort((a,b)=>a[0]-b[0]);const[hv,id]=pq.shift();
      if(vis.has(id))continue;vis.add(id);cgCur=id;cgVis.add(id);vo.push(id);
      const nd=cgNodes.find(n=>n.id===id);if(nd)nd.cost="h="+Math.round(hv);
      hlLine(6);log(`🌸 <b>${NL(id)}</b> h=${Math.round(hv)}`);showQ(pq.map(([h,id])=>({label:NL(id),cost:"h="+Math.round(h)})),"PQueue");drawCG();
      if(id===cgGoal){found=true;break;}
      for(const nb of(adj[id]||[])){if(!vis.has(nb.id)){if(!par[nb.id])par[nb.id]=id;pq.push([h(nb.id),nb.id]);}}
    }
  } else if(algo==="ucs"){
    const pq=[[0,cgStart]],vis=new Set(),cost={[cgStart]:0};
    while(pq.length){
      await cgTick(420);pq.sort((a,b)=>a[0]-b[0]);const[g,id]=pq.shift();
      if(vis.has(id))continue;vis.add(id);cgCur=id;cgVis.add(id);vo.push(id);
      const nd=cgNodes.find(n=>n.id===id);if(nd)nd.cost="g="+g;
      hlLine(5);log(`🟢 <b>${NL(id)}</b> cost=${g}`);showQ(pq.map(([g,id])=>({label:NL(id),cost:"g="+g})),"PQueue");drawCG();
      if(id===cgGoal){found=true;break;}
      for(const nb of(adj[id]||[])){const ng=g+nb.w;if(!vis.has(nb.id)&&(cost[nb.id]===undefined||ng<cost[nb.id])){cost[nb.id]=ng;par[nb.id]=id;pq.push([ng,nb.id]);}}
    }
  } else if(algo==="iddfs"){
    const maxD=Math.min(cgNodes.length+2,15);
    for(let d=0;d<=maxD&&!found;d++){
      hlLine(1);
      log(`🔁 <b>IDDFS Round ${d}</b> — depth limit raised to <b>${d}</b>. Running DFS up to depth ${d}...`);
      showQ([{label:"limit="+d}],"Depth Limit");
      cgVis=new Set();cgNodes.forEach(n=>n.cost=null);drawCG();await cgTick(500);
      const rP={},pS=new Set();
      found=await cgDLS(cgStart,null,d,adj,rP,pS,vo,d);
      if(found)Object.assign(par,rP);
      if(!found)log(`↩️ Round ${d} exhausted — no path within depth ${d}, increasing limit...`);
    }
  }

  if(found){
    let cur=cgGoal;const path=[];let s=0;
    while(cur&&cur!==cgStart&&s++<200){path.unshift(cur);cur=par[cur];}
    path.forEach(id=>cgPath.add(id));cgPath.add(cgStart);cgCur=null;drawCG();
    const pL=[NL(cgStart),...path.map(NL)].join(" → ");
    log(`🎯 <b>Goal reached!</b>`);log(`🟣 Path: <b>${pL}</b>`);
    showSumCard(vo.length,path.length+1,true,"cg-summary","cg-sum-body");
  } else {
    cgCur=null;drawCG();log("❌ <b>No path found</b>");
    showSumCard(vo.length,0,false,"cg-summary","cg-sum-body");
  }
  setCGBtns(false);showQ([],"Done");
}

async function cgDLS(id,p,lim,adj,par,pS,vo,totalD){
  if(pS.has(id))return false;
  pS.add(id);if(p!==null)par[id]=p;
  cgCur=id;cgVis.add(id);vo.push(id);
  const nd=cgNodes.find(n=>n.id===id);
  const curDepth=totalD-lim;
  if(nd)nd.cost="d="+curDepth;
  hlLine(8);
  log(`🔶 DFS <b>${nd?.label}</b> &nbsp;depth=${curDepth} &nbsp;remaining=${lim}`);
  showQ([...pS].map(id=>({label:cgNodes.find(n=>n.id===id)?.label})),"Path Stack");
  drawCG();await cgTick(380);
  if(id===cgGoal)return true;
  if(lim===0){
    hlLine(9);
    log(`🛑 <b>${nd?.label}</b> — depth limit ${totalD} reached, backtracking`);
    if(nd)nd.cost=null;pS.delete(id);return false;
  }
  hlLine(10);
  for(const nb of(adj[id]||[])){if(await cgDLS(nb.id,id,lim-1,adj,par,pS,vo,totalD))return true;}
  if(nd)nd.cost=null;
  pS.delete(id);
  return false;
}

// ══════════════════════════════════════
// COMPARE DEMOS
// ══════════════════════════════════════
function buildDemos(){
  const data={bfs:[[0,1,2,3,4],[1,2,3,4,5],[2,3,4,5,6],[3,4,5,6,7],[4,5,6,7,8]],dfs:[[0,8,8,8,8],[1,8,8,8,8],[2,8,8,8,8],[3,8,8,8,8],[4,5,6,7,8]],bestfs:[[8,8,8,8,8],[8,8,8,3,8],[8,8,2,8,8],[8,1,8,8,8],[0,8,8,8,8]]};
  for(const[a,m]of Object.entries(data)){
    const el=document.getElementById("demo-"+a);if(!el)continue;el.innerHTML="";const col=ALGOS[a].color;
    m.flat().forEach(v=>{const d=document.createElement("div");d.className="dc";if(v<8){d.style.background=col;d.style.opacity=0.2+(1-v/8)*0.8;}el.appendChild(d);});
  }
}

// ══════════════════════════════════════
// GRID → CUSTOM GRAPH EXPORT
// ══════════════════════════════════════
function gridToCustomGraph(){
  if(!gridArr){log("⚠️ Create a grid first!");return;}
  cgNodes=[];cgEdges=[];cgStart=null;cgGoal=null;
  cgVis=new Set();cgCur=null;cgPath=new Set();cgIdN=0;cgSrc=null;
  setMode('graph');
  setTimeout(()=>{
    const cv=document.getElementById("cgCanvas");
    const W=cv.width||600,H=cv.height||400;
    const padding=40;
    const cellW=(W-padding*2)/Math.max(COLS-1,1);
    const cellH=(H-padding*2)/Math.max(ROWS-1,1);
    const spacing=Math.min(cellW,cellH,60);
    const offX=(W-spacing*(COLS-1))/2;
    const offY=(H-spacing*(ROWS-1))/2;
    const nodeMap={};
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        if(gridArr[r][c]===1)continue;
        const id=cgID();
        const label=String.fromCharCode(65+(cgNodes.length%26))+(cgNodes.length>=26?Math.floor(cgNodes.length/26):"");
        cgNodes.push({id,label,x:offX+c*spacing,y:offY+r*spacing,cost:null,gridR:r,gridC:c});
        nodeMap[r+","+c]=id;
      }
    }
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        if(gridArr[r][c]===1)continue;
        const fromId=nodeMap[r+","+c];
        [[0,1],[1,0]].forEach(([dr,dc])=>{
          const nr=r+dr,nc=c+dc;
          if(nr>=0&&nc>=0&&nr<ROWS&&nc<COLS&&gridArr[nr][nc]!==1){
            const toId=nodeMap[nr+","+nc];
            cgEdges.push({from:fromId,to:toId,weight:1});
            cgEdges.push({from:toId,to:fromId,weight:1});
          }
        });
      }
    }
    if(startP){const sId=nodeMap[startP[0]+","+startP[1]];if(sId){cgStart=sId;log(`🟢 Start node = <b>${cgNodes.find(n=>n.id===sId)?.label}</b>`);}}
    if(goalP){const gId=nodeMap[goalP[0]+","+goalP[1]];if(gId){cgGoal=gId;log(`🔴 Goal node = <b>${cgNodes.find(n=>n.id===gId)?.label}</b>`);}}
    drawCG();
    log(`✅ Grid exported: <b>${cgNodes.length} nodes</b>, <b>${cgEdges.length/2} edges</b>`);
    log(`💡 Long-press any node to change Start/Goal. Use ⟶ Edge tool to edit weights.`);
  },100);
}

// ══════════════════════════════════════
// MOBILE FAB
// ══════════════════════════════════════
let fabOpen=false;
function toggleFAB(){
  fabOpen=!fabOpen;
  document.getElementById("fab-menu").classList.toggle("show",fabOpen);
  document.getElementById("fab-backdrop").classList.toggle("show",fabOpen);
  document.getElementById("fab").textContent=fabOpen?"✕":"⚡";
  document.getElementById("fab-algo-name").textContent=ALGOS[algo]?.short||algo.toUpperCase();
  document.getElementById("fab-mode-label").textContent=mode==="grid"?"Custom Graph":"Grid Mode";
  document.getElementById("fab-mode-icon").textContent =mode==="grid"?"⬡":"⊞";
  document.getElementById("fab-panel-label").textContent=panelOpen?"Collapse Panel":"Expand Panel";
}
function closeFAB(){
  fabOpen=false;
  document.getElementById("fab-menu").classList.remove("show");
  document.getElementById("fab-backdrop").classList.remove("show");
  document.getElementById("fab").textContent="⚡";
}
function fabRun(){closeFAB();if(mode==="grid")runGrid();else runCG();kbdToast("▶ Running "+ALGOS[algo].short);}
function fabPause(){closeFAB();if(mode==="grid")togglePause();else toggleCGPause();}
function fabStep(){closeFAB();if(mode==="grid")doStep();else doCGStep();kbdToast("⏭ Step");}
function fabToggleMode(){closeFAB();const next=mode==="grid"?"graph":"grid";setMode(next);kbdToast(next==="grid"?"⊞ Grid mode":"⬡ Custom Graph mode");}
function fabNewGrid(){createGrid();kbdToast("🔲 New grid");}
function fabExport(){gridToCustomGraph();kbdToast("⬡ Exported to graph");}

// ══════════════════════════════════════
// PANEL TOGGLE
// ══════════════════════════════════════
let panelOpen=true;
function togglePanel(){
  panelOpen=!panelOpen;
  const wrap=document.getElementById("panel-wrap");
  const arrow=document.getElementById("panel-toggle-arrow");
  const hint=document.getElementById("panel-toggle-hint");
  if(panelOpen){wrap.classList.remove("collapsed");arrow.classList.add("up");arrow.textContent="▲";hint.textContent="tap to collapse";}
  else{wrap.classList.add("collapsed");arrow.classList.remove("up");arrow.textContent="▼";hint.textContent="tap to expand";}
}

// ══════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════
function openKbdGuide(){document.getElementById("kbd-guide").classList.remove("hide");}
function closeKbdGuide(){document.getElementById("kbd-guide").classList.add("hide");}

function kbdToast(msg){
  const t=document.getElementById("kbd-toast");
  t.textContent=msg;t.classList.add("show");
  clearTimeout(kbdToast._timer);
  kbdToast._timer=setTimeout(()=>t.classList.remove("show"),1400);
}

const ALGO_KEYS={"1":"bfs","2":"dfs","3":"bestfs","4":"ucs","5":"iddfs"};
const LANG_CYCLE=["python","c","cpp"];

document.addEventListener("keydown",e=>{
  if(["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName))return;
  const k=e.key;
  if(k==="Tab"){e.preventDefault();togglePanel();kbdToast(panelOpen?"📖 Panel expanded":"📖 Panel collapsed");return;}
  if(k==="?"){e.preventDefault();document.getElementById("kbd-guide").classList.toggle("hide");return;}
  if(k==="Escape"){
    if(!document.getElementById("kbd-guide").classList.contains("hide")){closeKbdGuide();return;}
    if(mode==="graph"&&cgSrc){cgSrc=null;drawCG();kbdToast("❌ Edge cancelled");return;}
    if(!document.getElementById("edge-modal").classList.contains("hide")){closeEM();return;}
    return;
  }
  if(ALGO_KEYS[k]){selectAlgo(ALGO_KEYS[k]);kbdToast("Algorithm: "+ALGOS[ALGO_KEYS[k]].short);return;}
  if(k==="g"||k==="G"){setMode("grid");kbdToast("⊞ Grid mode");return;}
  if(k==="c"||k==="C"){setMode("graph");kbdToast("⬡ Custom Graph mode");return;}
  if(k==="p"||k==="P"){
    const i=LANG_CYCLE.indexOf(lang);
    lang=LANG_CYCLE[(i+1)%LANG_CYCLE.length];
    document.getElementById("langSel").value=lang;
    displayCode();
    kbdToast("Language: "+lang.charAt(0).toUpperCase()+lang.slice(1));
    return;
  }
  if(k==="l"||k==="L"){clearLog();kbdToast("🗑 Log cleared");return;}
  if(mode==="grid"){
    if(k==="n"||k==="N"){createGrid();kbdToast("🔲 New grid");return;}
    if(k==="r"||k==="R"){resetGrid();kbdToast("🔄 Grid reset");return;}
    if(k===" "){e.preventDefault();if(running){togglePause();kbdToast(paused?"⏸ Paused":"▶ Resumed");}else{runGrid();kbdToast("▶ Running "+ALGOS[algo].short);}return;}
    if(k==="ArrowRight"){e.preventDefault();doStep();kbdToast("⏭ Step");return;}
    if(k==="e"||k==="E"){gridToCustomGraph();kbdToast("⬡ Exported to Graph");return;}
  }
  if(mode==="graph"){
    if(k==="a"||k==="A"){cgTool("node");kbdToast("＋ Node tool");return;}
    if(k==="d"||k==="D"){cgTool("edge");kbdToast("⟶ Edge tool");return;}
    if(k==="t"||k==="T"){openEM();kbdToast("📝 Type edges");return;}
    if(k==="x"||k==="X"){cgClear();kbdToast("🗑 Graph cleared");return;}
    if(k===" "){e.preventDefault();if(cgRunning){toggleCGPause();kbdToast(cgPaused?"⏸ Paused":"▶ Resumed");}else{runCG();kbdToast("▶ Running "+ALGOS[algo].short);}return;}
    if(k==="ArrowRight"){e.preventDefault();doCGStep();kbdToast("⏭ Step");return;}
  }
});

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════
window.addEventListener("resize",()=>{
  if(mode==="graph"){sizeCGCanvas();drawCG();}
  if(gridArr){
    const s=cellSz();
    document.querySelectorAll(".cell").forEach(c=>{c.style.width=s+"px";c.style.height=s+"px";});
    const g=document.getElementById("grid");
    if(g)g.style.gridTemplateColumns=`repeat(${COLS},${s}px)`;
  }
});

window.addEventListener("DOMContentLoaded",()=>{
  selectAlgo("bfs");
  displayCode();
  createGrid();
  setStep(1);
  showGridHint();
  setTimeout(()=>{sizeCGCanvas();},200);
});