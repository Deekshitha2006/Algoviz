// ══════════════════════════════════════
// FULLSCREEN PANEL EXPANDER
// Adds ⛶ button to each panel section.
// Clicking it opens that section fullscreen.
// Clicking ✕ or pressing Escape closes it.
// Zero changes to script.js / styles.css.
// ══════════════════════════════════════

// ── Detailed algorithm explanations for fullscreen algo info ──
const ALGO_DETAIL = {
  bfs: {
    title: "Breadth-First Search (BFS)",
    color: "#00f7ff",
    sections: [
      {
        heading: "🌊 What is BFS?",
        body: `BFS explores a graph <b>level by level</b> — like ripples spreading outward from a stone dropped in water. It visits all nodes at distance 1 from the start before any node at distance 2, and so on. This guarantees that the <b>first time</b> it reaches the goal, it has found the <b>shortest path</b> (in terms of number of edges).`
      },
      {
        heading: "📦 Data Structure: Queue (FIFO)",
        body: `BFS uses a <b>Queue</b> — First In, First Out. Nodes are added to the back and removed from the front. This is what enforces the level-by-level order: you always process the oldest (closest) node first before exploring newer (farther) ones.`
      },
      {
        heading: "🔢 Step-by-Step",
        body: `<ol style="padding-left:18px;line-height:2">
          <li>Add the <b>start node</b> to the queue and mark it visited.</li>
          <li>While the queue is not empty:</li>
          <li>&nbsp;&nbsp;&nbsp;Take the <b>front node</b> out of the queue.</li>
          <li>&nbsp;&nbsp;&nbsp;If it is the <b>goal</b> — done! Trace back the path.</li>
          <li>&nbsp;&nbsp;&nbsp;Otherwise, add all <b>unvisited neighbours</b> to the back of the queue and mark them visited.</li>
        </ol>`
      },
      {
        heading: "✅ Why BFS guarantees shortest path",
        body: `Because it explores by distance. When BFS reaches the goal for the first time, no shorter path exists — any shorter path would have been found in an earlier level. This only holds when <b>all edge weights are equal</b> (unweighted graphs). For weighted edges, use UCS instead.`
      },
      {
        heading: "⏱ Complexity",
        body: `<b>Time:</b> O(V + E) — every vertex and edge is visited once.<br>
               <b>Space:</b> O(V) — the queue can hold at most all vertices at one level.<br>
               <b>Optimal:</b> ✅ Yes (unweighted graphs)<br>
               <b>Complete:</b> ✅ Yes (always finds a solution if one exists)`
      },
      {
        heading: "📌 When to use BFS",
        body: `Use BFS when you need the <b>shortest path in an unweighted graph</b> — maze solving, social network distance (degrees of separation), web crawlers finding pages within N clicks, GPS navigation on equal-cost roads.`
      },
      {
        heading: "⚠️ Limitations",
        body: `BFS can use a lot of memory on wide graphs because it stores the entire frontier (current level) in the queue. In very large graphs with high branching factor, this can be prohibitive. Consider IDDFS for memory-constrained environments.`
      }
    ]
  },
  dfs: {
    title: "Depth-First Search (DFS)",
    color: "#a78bfa",
    sections: [
      {
        heading: "🕳️ What is DFS?",
        body: `DFS explores a graph by going <b>as deep as possible</b> along each branch before backtracking. Think of it like navigating a maze by always taking the first available turn and only turning back when you hit a dead end.`
      },
      {
        heading: "📦 Data Structure: Stack (LIFO)",
        body: `DFS uses a <b>Stack</b> — Last In, First Out. The most recently discovered node is always explored next. This is what drives it deep: you keep following the latest node rather than going back to earlier ones. In recursive implementations, the call stack plays this role automatically.`
      },
      {
        heading: "🔢 Step-by-Step",
        body: `<ol style="padding-left:18px;line-height:2">
          <li>Push the <b>start node</b> onto the stack.</li>
          <li>While the stack is not empty:</li>
          <li>&nbsp;&nbsp;&nbsp;Pop the <b>top node</b>.</li>
          <li>&nbsp;&nbsp;&nbsp;If already visited — skip it.</li>
          <li>&nbsp;&nbsp;&nbsp;Mark it visited. If it is the <b>goal</b> — done!</li>
          <li>&nbsp;&nbsp;&nbsp;Push all <b>unvisited neighbours</b> onto the stack.</li>
        </ol>`
      },
      {
        heading: "❌ Why DFS does NOT guarantee shortest path",
        body: `DFS dives deep immediately. It may find a path to the goal that goes through many unnecessary nodes before discovering a shorter route exists elsewhere. The path it finds first depends entirely on the order neighbours are pushed — not their distance.`
      },
      {
        heading: "⏱ Complexity",
        body: `<b>Time:</b> O(V + E) — every vertex and edge is visited once.<br>
               <b>Space:</b> O(V) — stack depth equals the longest path.<br>
               <b>Optimal:</b> ❌ No<br>
               <b>Complete:</b> ⚠️ May loop on graphs with cycles (needs visited tracking)`
      },
      {
        heading: "📌 When to use DFS",
        body: `Use DFS when you just need <b>any path</b> (not necessarily shortest) — puzzle solving, detecting cycles, topological sorting, finding connected components, maze generation, and tree traversals (pre/in/post-order).`
      },
      {
        heading: "⚠️ Limitations",
        body: `DFS can get stuck going infinitely deep in graphs with cycles if you don't track visited nodes. It also gives no guarantee about path quality. On very deep graphs it can cause stack overflow in recursive implementations.`
      }
    ]
  },
  bestfs: {
    title: "Best-First Search (Greedy)",
    color: "#f472b6",
    sections: [
      {
        heading: "🎯 What is Best-First Search?",
        body: `Best-First Search always expands the node that <b>looks closest to the goal</b> according to a heuristic function h(n). It is <b>greedy</b> — it trusts the heuristic completely and rushes toward the goal without considering the cost already paid to get there.`
      },
      {
        heading: "📦 Data Structure: Priority Queue (by h(n))",
        body: `A <b>min-heap priority queue</b> ordered by heuristic value h(n). The node with the <b>lowest estimated distance to goal</b> is always popped first. In a grid, h(n) is typically the Manhattan distance to the goal cell.`
      },
      {
        heading: "📐 What is a heuristic?",
        body: `A heuristic h(n) is an <b>estimate</b> of the cost from node n to the goal. It doesn't need to be exact — it just needs to be fast to compute and roughly correct. Common heuristics:<br>
        • <b>Manhattan distance</b>: |x1−x2| + |y1−y2| (grids, no diagonals)<br>
        • <b>Euclidean distance</b>: √((x1−x2)² + (y1−y2)²) (continuous space)<br>
        • <b>Chebyshev distance</b>: max(|x1−x2|, |y1−y2|) (grids with diagonals)`
      },
      {
        heading: "🔢 Step-by-Step",
        body: `<ol style="padding-left:18px;line-height:2">
          <li>Add start node to the priority queue with priority h(start).</li>
          <li>While the queue is not empty:</li>
          <li>&nbsp;&nbsp;&nbsp;Pop node with <b>lowest h(n)</b>.</li>
          <li>&nbsp;&nbsp;&nbsp;If already visited — skip.</li>
          <li>&nbsp;&nbsp;&nbsp;If goal — done!</li>
          <li>&nbsp;&nbsp;&nbsp;For each unvisited neighbour, push with priority h(neighbour).</li>
        </ol>`
      },
      {
        heading: "⏱ Complexity",
        body: `<b>Time:</b> O(V + E) in best case, can be worse with poor heuristic.<br>
               <b>Space:</b> O(V)<br>
               <b>Optimal:</b> ❌ No — may find a longer path<br>
               <b>Complete:</b> ⚠️ Depends on the graph and heuristic`
      },
      {
        heading: "📌 When to use Best-First Search",
        body: `Use when <b>speed matters more than optimality</b> — real-time games where approximate paths are fine, large graphs where BFS would be too slow, or as a starting point before switching to A*.`
      },
      {
        heading: "⚠️ Limitations",
        body: `Because it ignores the actual cost g(n) already paid, it can be misled by a heuristic that points toward the goal but along a very expensive route. It is not guaranteed to find the shortest path. For optimal results, use A* which combines g(n) + h(n).`
      }
    ]
  },
  ucs: {
    title: "Uniform Cost Search (UCS)",
    color: "#34d399",
    sections: [
      {
        heading: "💰 What is UCS?",
        body: `UCS expands the node with the <b>lowest cumulative path cost</b> g(n) from the start. Unlike BFS which counts hops, UCS counts actual edge weights — making it optimal even when edges have different costs. It is essentially <b>Dijkstra's algorithm</b>.`
      },
      {
        heading: "📦 Data Structure: Priority Queue (by g(n))",
        body: `A <b>min-heap priority queue</b> ordered by total path cost g(n). The node reached by the cheapest path so far is always expanded first. This guarantees that the first time a node is finalised, it has been reached at minimum cost.`
      },
      {
        heading: "🔢 Step-by-Step",
        body: `<ol style="padding-left:18px;line-height:2">
          <li>Add start node with cost g=0.</li>
          <li>While the queue is not empty:</li>
          <li>&nbsp;&nbsp;&nbsp;Pop node with <b>lowest g(n)</b>.</li>
          <li>&nbsp;&nbsp;&nbsp;If already finalised — skip.</li>
          <li>&nbsp;&nbsp;&nbsp;Finalise it. If goal — done! Return g(goal).</li>
          <li>&nbsp;&nbsp;&nbsp;For each neighbour: if g(current) + edge_weight &lt; known cost → update and push.</li>
        </ol>`
      },
      {
        heading: "✅ Why UCS is optimal",
        body: `UCS always expands the cheapest known path first. When it reaches the goal, every other path in the queue costs at least as much (since costs are non-negative). So the first time the goal is popped, it must be via the cheapest possible route.`
      },
      {
        heading: "⏱ Complexity",
        body: `<b>Time:</b> O((V + E) log V) — due to priority queue operations.<br>
               <b>Space:</b> O(V)<br>
               <b>Optimal:</b> ✅ Yes (for non-negative edge weights)<br>
               <b>Complete:</b> ✅ Yes`
      },
      {
        heading: "📌 When to use UCS",
        body: `Use when edges have <b>different costs</b> — road networks with varying distances, flight routes with different prices, game maps with terrain costs, network routing with varying latency.`
      },
      {
        heading: "⚠️ Limitations",
        body: `UCS can be slow if edge costs are very small (many iterations) or if the goal is far. It has no sense of direction toward the goal — it expands outward uniformly by cost, which can waste effort exploring away from the goal. A* fixes this by adding a heuristic.`
      }
    ]
  },
  iddfs: {
    title: "Iterative Deepening DFS (IDDFS)",
    color: "#fb923c",
    sections: [
      {
        heading: "🔁 What is IDDFS?",
        body: `IDDFS runs DFS repeatedly with an increasing <b>depth limit</b>: first limit=0, then limit=1, then limit=2, and so on — until the goal is found. This gives it the <b>memory efficiency of DFS</b> (only stores the current path) with the <b>optimal shortest-path guarantee of BFS</b>.`
      },
      {
        heading: "📦 Data Structure: Call Stack (recursion)",
        body: `IDDFS uses <b>recursive DFS</b>, so it only stores the <b>current path from start to the node being explored</b>. At depth limit d, it uses O(d) space. This is far more memory-efficient than BFS which stores the entire frontier.`
      },
      {
        heading: "🔢 Step-by-Step",
        body: `<ol style="padding-left:18px;line-height:2">
          <li>Set depth_limit = 0.</li>
          <li>Run DLS (Depth-Limited Search) from start with this limit.</li>
          <li>&nbsp;&nbsp;&nbsp;DLS = DFS but stops going deeper once depth_limit is reached.</li>
          <li>If goal found — done! Path length = depth_limit.</li>
          <li>Otherwise — increment depth_limit by 1 and repeat.</li>
        </ol>`
      },
      {
        heading: "🤔 Isn't re-exploring nodes wasteful?",
        body: `It seems wasteful to re-explore the same nodes each round, but the maths works out. In a tree with branching factor b, the last level has b^d nodes. All previous levels combined have roughly b^d/(b-1) nodes. So the overhead is a constant factor — typically less than <b>2× the work of a single DFS</b>.`
      },
      {
        heading: "⏱ Complexity",
        body: `<b>Time:</b> O(b^d) where b = branching factor, d = depth of shallowest solution.<br>
               <b>Space:</b> O(d) — only the current path stack is stored.<br>
               <b>Optimal:</b> ✅ Yes (finds shallowest solution first)<br>
               <b>Complete:</b> ✅ Yes`
      },
      {
        heading: "📌 When to use IDDFS",
        body: `Use when you need <b>optimal path + very low memory</b> — large graphs where BFS would run out of RAM, embedded systems, game tree search (chess engines use iterative deepening with heuristics), or any situation where space is more constrained than time.`
      },
      {
        heading: "⚠️ Limitations",
        body: `IDDFS can be very slow on large dense grids because it re-visits many nodes. It also doesn't handle weighted edges — for those, use UCS. On this visualiser, IDDFS is capped at a step limit to avoid freezing on large grids — try 5×5 for best results.`
      }
    ]
  }
};

// ── Build the expanded fullscreen content for each section ──
function buildExpandContent(sectionId) {
  if (sectionId === 'ps-algo') {
    // Get current algorithm from the global `algo` variable
    const detail = ALGO_DETAIL[algo] || ALGO_DETAIL['bfs'];
    let html = `
      <div style="max-width:780px;margin:0 auto;padding:20px 4px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px">
          <div style="width:14px;height:14px;border-radius:50%;background:${detail.color};
               box-shadow:0 0 14px ${detail.color};flex-shrink:0"></div>
          <h1 style="font-size:clamp(20px,4vw,32px);font-weight:800;color:${detail.color}">
            ${detail.title}
          </h1>
        </div>`;
    detail.sections.forEach(sec => {
      html += `
        <div style="margin-bottom:24px;background:rgba(255,255,255,0.03);
             border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px 20px;
             border-left:3px solid ${detail.color}">
          <h3 style="font-size:14px;font-weight:700;color:${detail.color};margin-bottom:10px">
            ${sec.heading}
          </h3>
          <div style="font-size:13px;color:#94a3b8;line-height:1.85">${sec.body}</div>
        </div>`;
    });
    html += `</div>`;
    return html;
  }

  if (sectionId === 'ps-thinking') {
    // Clone the current log content
    const logEl = document.getElementById('log');
    return `
      <div style="max-width:780px;margin:0 auto;padding:20px 4px">
        <h2 style="font-size:20px;font-weight:700;color:var(--cyan);margin-bottom:16px">🧠 Thinking Panel</h2>
        <div style="font-family:var(--fm);font-size:13px;color:var(--text2);line-height:2;
             background:rgba(0,0,0,0.2);border-radius:10px;padding:16px 18px;
             min-height:200px;border:1px solid var(--border)">
          ${logEl ? logEl.innerHTML || '<span style="color:var(--text3)">No log yet — run an algorithm first.</span>' : ''}
        </div>
        <p style="font-size:11px;color:var(--text3);margin-top:10px">Live log is still updating in the background.</p>
      </div>`;
  }

  if (sectionId === 'ps-queue') {
    const qEl = document.getElementById('qdisplay');
    const lbl = document.getElementById('qlabel')?.textContent || 'Queue';
    return `
      <div style="max-width:780px;margin:0 auto;padding:20px 4px">
        <h2 style="font-size:20px;font-weight:700;color:var(--cyan);margin-bottom:16px">${lbl}</h2>
        <div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:16px 18px;
             border:1px solid var(--border);min-height:80px">
          ${qEl ? qEl.innerHTML : ''}
        </div>
        <p style="font-size:11px;color:var(--text3);margin-top:10px">Snapshot of queue at last step. Run the algorithm to see it update.</p>
      </div>`;
  }

  if (sectionId === 'ps-code') {
    const codeEl = document.getElementById('codePanel');
    const exEl = document.getElementById('codeEx');
    const langEl = document.getElementById('langSel');
    const langLabel = langEl ? langEl.options[langEl.selectedIndex]?.text : '';
    return `
      <div style="max-width:780px;margin:0 auto;padding:20px 4px">
        <h2 style="font-size:20px;font-weight:700;color:var(--cyan);margin-bottom:4px">💻 Code Trace</h2>
        <p style="font-size:11px;color:var(--text3);margin-bottom:16px">Language: ${langLabel} &nbsp;|&nbsp; Run the algorithm to see line highlighting</p>
        <div style="background:#060b17;border-radius:10px;padding:16px 18px;
             border:1px solid var(--border);font-family:var(--fm);font-size:13px;
             color:#7dd3fc;line-height:2;overflow-x:auto">
          ${codeEl ? codeEl.innerHTML : ''}
        </div>
        ${exEl && exEl.textContent ? `
          <div style="margin-top:12px;padding:10px 14px;background:rgba(250,204,21,0.06);
               border-radius:8px;border:1px solid rgba(250,204,21,0.2);
               font-size:13px;color:#fde68a;font-style:italic">
            ${exEl.textContent}
          </div>` : ''}
      </div>`;
  }

  if (sectionId === 'ggPanel') {
    // We'll draw the ggCanvas into an image for the fullscreen view
    const ggcv = document.getElementById('ggCanvas');
    let imgSrc = '';
    try { imgSrc = ggcv ? ggcv.toDataURL() : ''; } catch(e) {}
    return `
      <div style="max-width:900px;margin:0 auto;padding:20px 4px">
        <h2 style="font-size:20px;font-weight:700;color:var(--cyan);margin-bottom:4px">🕸️ Grid → Graph View</h2>
        <p style="font-size:11px;color:var(--text3);margin-bottom:16px">Each dot = one grid cell. Lines = connections between adjacent non-wall cells.</p>
        ${imgSrc
          ? `<img src="${imgSrc}" style="width:100%;border-radius:10px;
               border:1px solid var(--border);background:#060b17" alt="Grid graph view">`
          : `<div style="padding:40px;text-align:center;color:var(--text3);
               background:rgba(0,0,0,0.2);border-radius:10px;border:1px solid var(--border)">
               Set up a grid and run an algorithm to see the graph view here.
             </div>`}
      </div>`;
  }

  return '<p style="color:var(--text3)">Nothing to show.</p>';
}

// ── Main expand overlay ──
function expandPanel(sectionId) {
  // Remove any existing overlay
  const old = document.getElementById('ps-expand-overlay');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'ps-expand-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:800;
    background:rgba(6,11,23,0.97);
    display:flex;flex-direction:column;
    backdrop-filter:blur(8px);
    animation:psExpandIn .22s cubic-bezier(.4,0,.2,1);
  `;

  // inject animation keyframe once
  if (!document.getElementById('ps-expand-style')) {
    const st = document.createElement('style');
    st.id = 'ps-expand-style';
    st.textContent = `
      @keyframes psExpandIn {
        from { opacity:0; transform:scale(.96); }
        to   { opacity:1; transform:scale(1); }
      }
      @keyframes psExpandOut {
        from { opacity:1; transform:scale(1); }
        to   { opacity:0; transform:scale(.96); }
      }
    `;
    document.head.appendChild(st);
  }

  // header bar
  const header = document.createElement('div');
  header.style.cssText = `
    display:flex;align-items:center;justify-content:space-between;
    padding:12px 20px;border-bottom:1px solid rgba(0,247,255,0.15);
    flex-shrink:0;background:rgba(10,16,32,0.9);
  `;
  const title = document.createElement('span');
  title.style.cssText = 'font-size:13px;font-weight:700;color:var(--cyan);';
  const titleMap = {
    'ps-algo':     '📖 Algorithm Info',
    'ps-thinking': '🧠 Thinking Panel',
    'ps-queue':    '📦 Queue / Stack',
    'ps-code':     '💻 Code Trace',
    'ggPanel':     '🕸️ Grid → Graph View'
  };
  title.textContent = titleMap[sectionId] || 'Panel';

  const hint = document.createElement('span');
  hint.style.cssText = 'font-size:11px;color:var(--text3);margin-left:10px;';
  hint.textContent = 'Press Esc to close';

  const left = document.createElement('div');
  left.style.cssText = 'display:flex;align-items:center;gap:8px;';
  left.appendChild(title);
  left.appendChild(hint);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    background:transparent;border:1px solid rgba(255,255,255,0.15);
    color:var(--text2);border-radius:7px;padding:5px 12px;
    font-size:14px;cursor:pointer;font-family:var(--fh);
    transition:all .15s;
  `;
  closeBtn.onmouseenter = () => { closeBtn.style.borderColor='var(--cyan)';closeBtn.style.color='var(--cyan)'; };
  closeBtn.onmouseleave = () => { closeBtn.style.borderColor='rgba(255,255,255,0.15)';closeBtn.style.color='var(--text2)'; };
  closeBtn.onclick = () => collapsePanel(overlay);

  header.appendChild(left);
  header.appendChild(closeBtn);

  // scrollable content area
  const body = document.createElement('div');
  body.style.cssText = `
    flex:1;overflow-y:auto;overflow-x:hidden;
    padding:24px 20px;
    scrollbar-width:thin;
    scrollbar-color:rgba(0,247,255,0.2) transparent;
  `;
  body.innerHTML = buildExpandContent(sectionId);

  overlay.appendChild(header);
  overlay.appendChild(body);
  document.body.appendChild(overlay);

  // Escape key closes it
  overlay._escHandler = (e) => {
    if (e.key === 'Escape') collapsePanel(overlay);
  };
  document.addEventListener('keydown', overlay._escHandler);

  // store which section this belongs to (for ⛶ toggle)
  overlay.dataset.sectionId = sectionId;

  // update the ⛶ button to show ⊠ (compressed icon) while open
  const btn = document.querySelector(`[data-expand-id="${sectionId}"]`);
  if (btn) { btn.textContent = '⊠'; btn.title = 'Collapse (Esc)'; }
}

function collapsePanel(overlay) {
  if (!overlay) overlay = document.getElementById('ps-expand-overlay');
  if (!overlay) return;

  // restore ⛶ button
  const sectionId = overlay.dataset.sectionId;
  const btn = document.querySelector(`[data-expand-id="${sectionId}"]`);
  if (btn) { btn.textContent = '⛶'; btn.title = 'Expand to fullscreen'; }

  document.removeEventListener('keydown', overlay._escHandler);
  overlay.style.animation = 'psExpandOut .18s cubic-bezier(.4,0,.2,1) forwards';
  setTimeout(() => overlay.remove(), 180);
}

// ── Inject ⛶ buttons into each panel section header on load ──
document.addEventListener('DOMContentLoaded', () => {
  const sections = [
    { id: 'ps-algo',     selector: '#ps-algo .ph' },
    { id: 'ps-thinking', selector: '#ps-thinking .ph' },
    { id: 'ps-queue',    selector: '#ps-queue .ph' },
    { id: 'ps-code',     selector: '#ps-code .ph' },
    { id: 'ggPanel',     selector: '#ggPanel .ph' },
  ];

  sections.forEach(({ id, selector }) => {
    const ph = document.querySelector(selector);
    if (!ph) return;

    const btn = document.createElement('button');
    btn.textContent = '⛶';
    btn.title = 'Expand to fullscreen';
    btn.setAttribute('data-expand-id', id);
    btn.style.cssText = `
      background:transparent;
      border:1px solid rgba(0,247,255,0.2);
      color:var(--text3);
      border-radius:5px;
      padding:2px 6px;
      font-size:13px;
      cursor:pointer;
      margin-left:auto;
      flex-shrink:0;
      transition:all .15s;
      line-height:1;
    `;
    btn.onmouseenter = () => { btn.style.borderColor='var(--cyan)'; btn.style.color='var(--cyan)'; };
    btn.onmouseleave = () => { btn.style.borderColor='rgba(0,247,255,0.2)'; btn.style.color='var(--text3)'; };

    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // don't trigger togglePs
      const existing = document.getElementById('ps-expand-overlay');
      if (existing && existing.dataset.sectionId === id) {
        collapsePanel(existing);
      } else {
        expandPanel(id);
      }
    });

    // Make sure .ph is flex so the button sits on the right
    ph.style.display = 'flex';
    ph.style.alignItems = 'center';
    ph.style.gap = '6px';

    ph.appendChild(btn);
  });
});