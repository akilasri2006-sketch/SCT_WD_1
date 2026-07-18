(function(){
  // ---------- State ----------
  let startTimestamp = 0;
  let elapsedBeforePause = 0;
  let running = false;
  let rafId = null;
  let laps = []; // { splitMs, totalMs }

  // ---------- Elements ----------
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const millisEl = document.getElementById('millis');
  const statusEl = document.getElementById('status');
  const statusTextEl = document.getElementById('statusText');
  const startBtn = document.getElementById('startBtn');
  const lapBtn = document.getElementById('lapBtn');
  const resetBtn = document.getElementById('resetBtn');
  const lapsList = document.getElementById('lapsList');
  const lapsEmpty = document.getElementById('lapsEmpty');
  const dialProgress = document.getElementById('dialProgress');
  const ticksGroup = document.getElementById('ticks');

  // ---------- Build tick marks on the dial ----------
  const RADIUS = 90, CENTER = 100;
  for(let i = 0; i < 60; i++){
    const angle = (i / 60) * Math.PI * 2;
    const isMajor = i % 5 === 0;
    const outer = RADIUS + 4;
    const inner = isMajor ? RADIUS - 6 : RADIUS - 2;
    const x1 = CENTER + Math.cos(angle) * outer;
    const y1 = CENTER + Math.sin(angle) * outer;
    const x2 = CENTER + Math.cos(angle) * inner;
    const y2 = CENTER + Math.sin(angle) * inner;
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', x1.toFixed(2));
    line.setAttribute('y1', y1.toFixed(2));
    line.setAttribute('x2', x2.toFixed(2));
    line.setAttribute('y2', y2.toFixed(2));
    line.setAttribute('class', isMajor ? 'tick major' : 'tick');
    line.setAttribute('transform', 'rotate(90 100 100)'); // counter the parent -90 rotation for ticks so they read upright-ish
    ticksGroup.appendChild(line);
  }

  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  dialProgress.style.strokeDasharray = CIRCUMFERENCE.toFixed(2);
  dialProgress.style.strokeDashoffset = CIRCUMFERENCE.toFixed(2);

  // ---------- Helpers ----------
  function pad(num, len){
    return String(Math.floor(num)).padStart(len, '0');
  }

  function formatTime(ms){
    const totalMs = Math.max(0, ms);
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const hundredths = Math.floor((totalMs % 1000) / 10);
    return {
      minutes: pad(minutes, 2),
      seconds: pad(seconds, 2),
      hundredths: pad(hundredths, 2)
    };
  }

  function render(elapsedMs){
    const t = formatTime(elapsedMs);
    minutesEl.textContent = t.minutes;
    secondsEl.textContent = t.seconds;
    millisEl.textContent = '.' + t.hundredths;

    // dial sweeps once per 60 seconds
    const secondFraction = (elapsedMs % 60000) / 60000;
    const offset = CIRCUMFERENCE * (1 - secondFraction);
    dialProgress.style.strokeDashoffset = offset.toFixed(2);
  }

  function currentElapsed(){
    if(running){
      return elapsedBeforePause + (performance.now() - startTimestamp);
    }
    return elapsedBeforePause;
  }

  function tick(){
    render(currentElapsed());
    rafId = requestAnimationFrame(tick);
  }

  // ---------- Controls ----------
  function start(){
    running = true;
    startTimestamp = performance.now();
    startBtn.textContent = 'Pause';
    startBtn.classList.add('is-running');
    lapBtn.disabled = false;
    resetBtn.disabled = false;
    statusEl.classList.add('running');
    statusTextEl.textContent = 'Running';
    rafId = requestAnimationFrame(tick);
  }

  function pause(){
    running = false;
    elapsedBeforePause = currentElapsed();
    cancelAnimationFrame(rafId);
    startBtn.textContent = 'Resume';
    startBtn.classList.remove('is-running');
    lapBtn.disabled = true;
    statusEl.classList.remove('running');
    statusTextEl.textContent = 'Paused';
    render(elapsedBeforePause);
  }

  function reset(){
    running = false;
    cancelAnimationFrame(rafId);
    elapsedBeforePause = 0;
    laps = [];
    startBtn.textContent = 'Start';
    startBtn.classList.remove('is-running');
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    statusEl.classList.remove('running');
    statusTextEl.textContent = 'Ready';
    render(0);
    renderLaps();
  }

  function recordLap(){
    const total = currentElapsed();
    const previousTotal = laps.length ? laps[laps.length - 1].totalMs : 0;
    const split = total - previousTotal;
    laps.push({ splitMs: split, totalMs: total });
    renderLaps();
  }

  function renderLaps(){
    lapsList.innerHTML = '';
    if(laps.length === 0){
      lapsList.appendChild(lapsEmpty);
      return;
    }

    const splits = laps.map(l => l.splitMs);
    const fastest = Math.min(...splits);
    const slowest = Math.max(...splits);
    const hasVariance = laps.length > 1 && fastest !== slowest;

    // newest lap first
    for(let i = laps.length - 1; i >= 0; i--){
      const lap = laps[i];
      const li = document.createElement('li');
      li.className = 'lap-row';
      if(hasVariance){
        if(lap.splitMs === fastest) li.classList.add('fastest');
        else if(lap.splitMs === slowest) li.classList.add('slowest');
      }
      const st = formatTime(lap.splitMs);
      const tt = formatTime(lap.totalMs);
      li.innerHTML =
        '<span class="lap-num">#' + (i + 1) + '</span>' +
        '<span class="lap-split">' + st.minutes + ':' + st.seconds + '.' + st.hundredths + '</span>' +
        '<span class="lap-total">' + tt.minutes + ':' + tt.seconds + '.' + tt.hundredths + '</span>';
      lapsList.appendChild(li);
    }
  }

  // ---------- Wire up ----------
  startBtn.addEventListener('click', () => {
    if(running) pause();
    else start();
  });
  lapBtn.addEventListener('click', recordLap);
  resetBtn.addEventListener('click', reset);

  // keyboard shortcuts: space = start/pause, L = lap, R = reset
  document.addEventListener('keydown', (e) => {
    if(e.code === 'Space'){ e.preventDefault(); startBtn.click(); }
    if(e.key === 'l' || e.key === 'L'){ if(!lapBtn.disabled) lapBtn.click(); }
    if(e.key === 'r' || e.key === 'R'){ if(!resetBtn.disabled) resetBtn.click(); }
  });

  render(0);
})();
