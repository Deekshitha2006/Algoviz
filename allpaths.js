// ══════════════════════════════════════
// ALL PATHS — finds every simple path
// from Start → Goal using backtracking DFS.
// Works independently of the selected algorithm.
// Add this block anywhere after the existing code.
// ══════════════════════════════════════

function findAllPaths() {
  if (mode === "grid") {
    findAllPathsGrid();
  } else {
    findAllPathsGraph();
  }
}

// ─────────────────────────────────────
// GRID — all simple paths
// ─────────────────────────────────────
function findAllPathsGrid() {
  if (!startP || !goalP) {
    log("⚠️ Set <b>Start</b> and <b>Goal</b> first!");
    return;
  }

  clearLog();
  log("🔀 <b>Finding all paths...</b> (Start → Goal, no revisits)");

  const K = (r, c) => `${r},${c}`;
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  const GR = goalP[0], GC = goalP[1];
  const SR = startP[0], SC = startP[1];

  // neighbours — same rule as the algorithms (no walls)
  const nbrs = (r, c) =>
    dirs
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nr, nc]) =>
        nr >= 0 && nc >= 0 && nr < ROWS && nc < COLS && !gridArr[nr][nc]
      );

  const allPaths = [];
  const visited = new Set();

  function dfs(r, c, path) {
    if (allPaths.length >= 500) return; // safety cap
    if (r === GR && c === GC) {
      allPaths.push([...path]);
      return;
    }
    for (const [nr, nc] of nbrs(r, c)) {
      const nk = K(nr, nc);
      if (!visited.has(nk)) {
        visited.add(nk);
        path.push(K(nr, nc));
        dfs(nr, nc, path);
        path.pop();
        visited.delete(nk);
      }
    }
  }

  const startKey = K(SR, SC);
  visited.add(startKey);
  dfs(SR, SC, [startKey]);

  if (allPaths.length === 0) {
    log("❌ <b>No path found</b> from Start to Goal.");
    return;
  }

  // sort shortest first
  allPaths.sort((a, b) => a.length - b.length);

  log(`✅ <b>${allPaths.length} path${allPaths.length > 1 ? "s" : ""} found</b>${allPaths.length >= 500 ? " (capped at 500)" : ""}:`);
  log("─────────────────────────────");

  allPaths.forEach((path, i) => {
    const steps = path.length - 1;
    // show as coordinate list, abbreviated if long
    const display =
      path.length <= 8
        ? path.join(" → ")
        : path.slice(0, 4).join(" → ") +
          ` → … (${path.length - 5} more) → ` +
          path[path.length - 1];
    const color = i === 0 ? "color:var(--cyan)" : "color:var(--text2)";
    log(
      `<span style="${color}">` +
        `<b>#${i + 1}</b> &nbsp;` +
        `<span style="color:var(--green)">[${steps} step${steps !== 1 ? "s" : ""}]</span>` +
        ` &nbsp;${display}` +
      `</span>`
    );
  });

  log("─────────────────────────────");
  const shortest = allPaths[0].length - 1;
  const shortest_count = allPaths.filter(p => p.length - 1 === shortest).length;
  log(
    `📊 Shortest: <b>${shortest} step${shortest !== 1 ? "s" : ""}</b>` +
    (shortest_count > 1 ? ` (${shortest_count} paths tied)` : "") +
    ` &nbsp;|&nbsp; Longest: <b>${allPaths[allPaths.length - 1].length - 1} steps</b>`
  );
}

// ─────────────────────────────────────
// CUSTOM GRAPH — all simple paths
// ─────────────────────────────────────
function findAllPathsGraph() {
  if (cgNodes.length < 2) {
    log("⚠️ Need at least 2 nodes!");
    return;
  }
  if (!cgStart) {
    log("⚠️ Right-click / long-press a node → Set as Start");
    return;
  }
  if (!cgGoal) {
    log("⚠️ Right-click / long-press a node → Set as Goal");
    return;
  }

  clearLog();
  const NL = id => cgNodes.find(n => n.id === id)?.label || "?";
  log(
    `🔀 <b>Finding all paths...</b> ` +
    `<b>${NL(cgStart)}</b> → <b>${NL(cgGoal)}</b> (no revisits)`
  );

  // build adjacency
  const adj = {};
  for (const n of cgNodes) adj[n.id] = [];
  for (const e of cgEdges) {
    if (adj[e.from]) adj[e.from].push({ id: e.to, w: e.weight || 1 });
  }

  const allPaths = [];
  const visited = new Set();

  function dfs(cur, path, cost) {
    if (allPaths.length >= 500) return; // safety cap
    if (cur === cgGoal) {
      allPaths.push({ path: [...path], cost });
      return;
    }
    for (const nb of (adj[cur] || [])) {
      if (!visited.has(nb.id)) {
        visited.add(nb.id);
        path.push(nb.id);
        dfs(nb.id, path, cost + nb.w);
        path.pop();
        visited.delete(nb.id);
      }
    }
  }

  visited.add(cgStart);
  dfs(cgStart, [cgStart], 0);

  if (allPaths.length === 0) {
    log("❌ <b>No path found</b> from Start to Goal.");
    return;
  }

  // sort by number of hops first, then by cost
  allPaths.sort((a, b) =>
    a.path.length !== b.path.length
      ? a.path.length - b.path.length
      : a.cost - b.cost
  );

  // check if any edges have non-default weights (for UCS relevance)
  const hasWeights = cgEdges.some(e => e.weight !== 1);

  log(
    `✅ <b>${allPaths.length} path${allPaths.length > 1 ? "s" : ""} found</b>` +
    `${allPaths.length >= 500 ? " (capped at 500)" : ""}:`
  );
  log("─────────────────────────────");

  allPaths.forEach(({ path, cost }, i) => {
    const hops = path.length - 1;
    const labels = path.map(NL);
    const display =
      labels.length <= 7
        ? labels.join(" → ")
        : labels.slice(0, 3).join(" → ") +
          ` → … → ` +
          labels[labels.length - 1];

    const weightInfo = hasWeights
      ? ` &nbsp;<span style="color:var(--yellow)">(cost=${cost})</span>`
      : "";

    const color = i === 0 ? "color:var(--cyan)" : "color:var(--text2)";
    log(
      `<span style="${color}">` +
        `<b>#${i + 1}</b> &nbsp;` +
        `<span style="color:var(--green)">[${hops} hop${hops !== 1 ? "s" : ""}]</span>` +
        weightInfo +
        ` &nbsp;${display}` +
      `</span>`
    );
  });

  log("─────────────────────────────");
  const fewestHops = allPaths[0].path.length - 1;
  const fewest_count = allPaths.filter(p => p.path.length - 1 === fewestHops).length;
  const minCost = Math.min(...allPaths.map(p => p.cost));
  const maxCost = Math.max(...allPaths.map(p => p.cost));

  log(
    `📊 Fewest hops: <b>${fewestHops}</b>` +
    (fewest_count > 1 ? ` (${fewest_count} paths tied)` : "") +
    (hasWeights
      ? ` &nbsp;|&nbsp; Min cost: <b>${minCost}</b> &nbsp;|&nbsp; Max cost: <b>${maxCost}</b>`
      : ` &nbsp;|&nbsp; Most hops: <b>${allPaths[allPaths.length - 1].path.length - 1}</b>`)
  );
}