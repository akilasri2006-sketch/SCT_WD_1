⏱️ 🔷 Chronoline — Stopwatch Web Application

🔹A clean, interactive stopwatch built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.
Built for **SkillCraft Technology** Web Development Internship — **Task **

---
🔷Features 

- **Start / Pause / Resume** — toggle timing with one button that clearly reflects state
- **Lap tracking** — record splits mid-run; each lap shows both split time and cumulative total
- **Fastest / slowest lap highlighting** — once you have 2+ laps, the quickest is marked in teal and the slowest in red
- **Reset** — clears the timer and lap history back to zero
- **Animated dial** — a circular progress ring sweeps once per 60 seconds like a physical stopwatch bezel
- **Keyboard shortcuts** — `Space` start/pause, `L` lap, `R` reset
- **Accurate timing** — uses `performance.now()` and `requestAnimationFrame` rather than `setInterval`, so the display doesn't drift under tab-throttling
- **Responsive & accessible** — scales down to mobile, visible focus states for keyboard users, respects `prefers-reduced-motion`

🔷 Tech Stack

| Layer | Choice |
|---|---|
| Structure | Semantic HTML5 |
| Styling | Plain CSS (custom properties, no framework) |
| Logic | Vanilla JavaScript (ES6, no libraries) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) (UI) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (tabular time display) |

🔷 Project Structure

```
stopwatch-web-app/
├── index.html      # Markup
├── style.css       # Styling
├── script.js       # Timer logic
└── README.md
```

🔷 Getting Started

No build step required.

```bash
git clone https://github.com/akilasri>/stopwatch-web-app.git
cd stopwatch-web-app
open index.html     # or just double-click the file
```

🔷 How It Works

The timer stores an `elapsedBeforePause` value plus a `startTimestamp` from `performance.now()`. While running, current elapsed time is calculated on every animation frame rather than incremented by a fixed interval — this keeps the display accurate even if the browser throttles background timers. Laps are stored as `{ splitMs, totalMs }` objects so both the individual segment and the cumulative time can be shown without re-deriving them.

🔷Acknowledgements

Task brief provided by **SkillCraft Technology**.

---

*Part of my SkillCraft Technology internship submissions.*
