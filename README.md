# 🔍 AlgoViz — Search Algorithm Visualizer

An interactive visualizer for classic search algorithms, built with vanilla HTML, CSS and JavaScript. No frameworks, no build steps — just open and run.

🌐 **Live Demo:** [https://deekshitha2006.github.io/Algoviz/](https://deekshitha2006.github.io/Algoviz/)

---

## ✨ Features

- **5 Algorithms** visualized step by step:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Best-First Search (Greedy)
  - Uniform Cost Search (UCS)
  - Iterative Deepening DFS (IDDFS)

- **Two modes:**
  - 🔲 **Grid Mode** — draw walls, set start & goal, watch the algorithm explore
  - ⬡ **Custom Graph Mode** — build your own graph with nodes and edges

- **Code panel** — live code highlighting in Python, C, and C++ as the algorithm runs
- **Queue / Stack display** — see the frontier update in real time
- **Step-by-step control** — Pause, Resume, and manual Step buttons
- **Export grid → graph** — converts your grid layout into a custom graph
- **Mobile friendly** — long-press nodes to set Start / Goal / Delete on touch devices
- **Keyboard shortcuts** — power-user controls (press `?` to see all)

---

## 🚀 Getting Started

No installation needed. Just clone and open:

```bash
git clone https://github.com/deekshitha2006/Algoviz.git
cd Algoviz
# Open index.html in your browser
```

Or visit the live site: [https://deekshitha2006.github.io/Algoviz/](https://deekshitha2006.github.io/Algoviz/)

---

## 🕹️ How to Use

### Grid Mode
1. Click a cell → sets **Start** (green)
2. Click another cell → sets **Goal** (red)
3. Click more cells → toggle **Walls**
4. Press **▶ Run**

### Custom Graph Mode
1. **Add Node** tool → tap / click canvas to place nodes
2. **Add Edge** tool → click node A then node B to connect
3. **Right-click** (desktop) or **long-press 0.5s** (mobile/tablet) a node → Set Start / Goal / Delete
4. Press **▶ Run**

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `1–5` | Switch algorithm |
| `Space` | Run / Pause / Resume |
| `→` | Step once |
| `G` | Grid mode |
| `C` | Custom Graph mode |
| `P` | Cycle language (Python → C → C++) |
| `N` | New grid |
| `E` | Export grid to graph |
| `A` | Node tool (graph mode) |
| `D` | Edge tool (graph mode) |
| `X` | Clear graph |
| `L` | Clear log |
| `Tab` | Toggle code panel |
| `?` | Show all shortcuts |

---

## 📁 Project Structure

```
Algoviz/
├── index.html        # Main HTML structure
├── style.css         # All styles
├── script.js         # All logic — algorithms, canvas, UI
└── README.md
```

---

## 🐛 Found a Bug?

Please [open an Issue](https://github.com/deekshitha2006/Algoviz/issues) and include:
- What you were doing
- What you expected to happen
- What actually happened
- Your device and browser

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a Pull Request.

---

## 👩‍💻 Author

**Deekshitha** — [@deekshitha2006](https://github.com/deekshitha2006)

---

## 📄 License

This project is open source. Feel free to use, share, and build on it.