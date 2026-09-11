const CLIENT_ID = '22030850960-vmlb3dsnl63shfv17dou9mnfg6ga26d2.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBCgePt_sZl68vxgitcUruI6kcvPAimGRc';
let tokenClient;
/* ============================================================
   T.O.L.U. — Tracker of Objectives, Legacy & Understanding
   Main JavaScript
   ============================================================ */

/* ============================================================
   1. INTERACTIVE PARTICLE BACKGROUND WITH SYNAPSES
   ============================================================ */
(function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse tracking
  const mouse = { x: null, y: null, radius: 180 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const PARTICLE_COUNT = 120;         // Balance density / performance
  const CONNECT_DISTANCE = 110;       // Distance for particle-to-particle synapses
  const MOUSE_LINK_DISTANCE = 180;    // Distance for particle-to-mouse synapses
  const MAX_SPEED = 2.5;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.size = Math.random() * 1.4 + 0.6;
      this.baseVx = this.vx;
      this.baseVy = this.vy;
      this.color = '#DC143C';
    }

    update() {
      // Flow field — creates the sweeping curved motion
      const time = Date.now() * 0.0004;
      const flowX = Math.cos(this.y * 0.004 + time) * 0.35;
      const flowY = Math.sin(this.x * 0.004 + time) * 0.35;
      this.vx += flowX;
      this.vy += flowY;

      // Mouse interaction — swirling vortex
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0.1) {
          const nx = dx / dist;
          const ny = dy / dist;
          const force = (mouse.radius - dist) / mouse.radius;
          // Attract
          this.vx += nx * force * 0.2;
          this.vy += ny * force * 0.2;
          // Swirl (perpendicular vector)
          this.vx += -ny * force * 1.4;
          this.vy += nx * force * 1.4;
        }
      }

      // Speed limit
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > MAX_SPEED) {
        this.vx = (this.vx / speed) * MAX_SPEED;
        this.vy = (this.vy / speed) * MAX_SPEED;
      }

      // Friction + return to base drift
      this.vx *= 0.97;
      this.vy *= 0.97;
      this.vx += (this.baseVx - this.vx) * 0.01;
      this.vy += (this.baseVy - this.vy) * 0.01;

      this.x += this.vx;
      this.y += this.vy;

      // Screen wrap
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawSynapses() {
    // Particle-to-particle connections
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < CONNECT_DISTANCE * CONNECT_DISTANCE) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / CONNECT_DISTANCE) * 0.35;
          ctx.strokeStyle = `rgba(220, 20, 60, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Particle-to-mouse connections
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_LINK_DISTANCE * MOUSE_LINK_DISTANCE) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / MOUSE_LINK_DISTANCE) * 0.55;
          ctx.strokeStyle = `rgba(220, 20, 60, ${opacity})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    // Motion blur fade
    ctx.fillStyle = 'rgba(10, 10, 10, 0.12)';
    ctx.fillRect(0, 0, width, height);

    // Update positions
    particles.forEach(p => p.update());

    // Draw synapses FIRST (under particles)
    drawSynapses();

    // Draw particles on top
    particles.forEach(p => p.draw());

    requestAnimationFrame(animate);
  }

  animate();
})();


/* ============================================================
   2. LIVE UTC CLOCK (HEADER)
   ============================================================ */
function updateHeaderClock() {
  const now = new Date();
  const el = document.getElementById('live-clock');
  if (el) el.innerText = now.toUTCString().split(' ')[4] + " UTC";
}
setInterval(updateHeaderClock, 1000);
updateHeaderClock();


/* ============================================================
   3. INTERACTIVE HERO CLOCK
   ============================================================ */
function updateInteractiveClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  const timeString =
    String(displayHours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0');

  const timeEl = document.getElementById('clock-time');
  if (timeEl) timeEl.textContent = timeString;

  const ampmEl = document.getElementById('clock-ampm');
  if (ampmEl) ampmEl.textContent = ampm;

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const date = now.getDate();
  let suffix = 'TH';
  if (date === 1 || date === 21 || date === 31) suffix = 'ST';
  else if (date === 2 || date === 22) suffix = 'ND';
  else if (date === 3 || date === 23) suffix = 'RD';

  const dayEl = document.getElementById('clock-day');
  const dateEl = document.getElementById('clock-date');
  if (dayEl) dayEl.textContent = days[now.getDay()];
  if (dateEl) dateEl.textContent = `${date}${suffix}`;

  const ring = document.getElementById('clock-ring-progress');
  if (ring) {
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (seconds / 60) * circumference;
    ring.style.strokeDashoffset = offset;
  }

  // Live step count from habit tracker
  const stepsEl = document.getElementById('clock-steps');
  if (stepsEl) {
    const stepsData = JSON.parse(localStorage.getItem('habit_steps') || '{}');
    stepsEl.textContent = stepsData.doneToday ? '10,000' : '0';
  }
}
setInterval(updateInteractiveClock, 1000);
updateInteractiveClock();


/* ============================================================
   4. TIMELINE INSPECTOR
   ============================================================ */
function updateInfo(title, time, desc) {
  document.getElementById('info-title').innerText = title;
  document.getElementById('info-time').innerText = time;
  document.getElementById('info-desc').innerText = desc;
}


/* ============================================================
   5. TOGGLE DOT
   ============================================================ */
function toggleDot(element) {
  if (element.classList.contains('bg-[#DC143C]')) {
    element.classList.remove('bg-[#DC143C]', 'shadow-[0_0_8px_#DC143C]');
    element.classList.add('bg-[#1A1A1A]', 'border', 'border-[#DC143C]/50');
  } else {
    element.classList.remove('bg-[#1A1A1A]', 'border', 'border-[#DC143C]/50');
    element.classList.add('bg-[#DC143C]', 'shadow-[0_0_8px_#DC143C]');
  }
}


/* ============================================================
   6. COOKED MODE
   ============================================================ */
let cookedActive = false;
function toggleCookedMode() {
  cookedActive = !cookedActive;
  const btn = document.getElementById('cooked-toggle-btn');
  const card = document.getElementById('cooked-card');
  if (cookedActive) {
    btn.innerHTML = "🚨 Cooked Mode: <span class='text-emerald-400'>ACTIVE (REST PRIORITIZED)</span>";
    card.style.borderColor = "#10B981";
    card.style.boxShadow = "0 0 25px rgba(16, 185, 129, 0.4)";
  } else {
    btn.innerHTML = "🚨 Cooked Mode: OFF";
    card.style.borderColor = "rgba(220, 20, 60, 0.3)";
    card.style.boxShadow = "";
  }
}


/* ============================================================
   7. HABIT TRACKER
   ============================================================ */
const HABITS = ['sleep', 'water', 'steps', 'nosnus', 'hygiene', 'exercise'];
const today = new Date().toDateString();

function loadHabits() {
  HABITS.forEach(habit => {
    const data = JSON.parse(localStorage.getItem('habit_' + habit) ||
      '{"lastDate":"","streak":0,"doneToday":false}');
    if (data.lastDate !== today) {
      data.doneToday = false;
      const lastDate = data.lastDate ? new Date(data.lastDate) : null;
      const daysSince = lastDate ? Math.floor((new Date() - lastDate) / 86400000) : 999;
      if (daysSince > 1) data.streak = 0;
      localStorage.setItem('habit_' + habit, JSON.stringify(data));
    }
    updateHabitUI(habit, data);
  });
}

function toggleHabit(habit) {
  const data = JSON.parse(localStorage.getItem('habit_' + habit) ||
    '{"lastDate":"","streak":0,"doneToday":false}');
  if (!data.doneToday) {
    data.doneToday = true;
    data.streak = (data.streak || 0) + 1;
    data.lastDate = today;
  } else {
    data.doneToday = false;
    data.streak = Math.max(0, (data.streak || 0) - 1);
  }
  localStorage.setItem('habit_' + habit, JSON.stringify(data));
  updateHabitUI(habit, data);

  const btn = document.getElementById('habit-' + habit + '-btn');
  btn.classList.add('habit-checked');
  setTimeout(() => btn.classList.remove('habit-checked'), 300);
}

function updateHabitUI(habit, data) {
  const btn = document.getElementById('habit-' + habit + '-btn');
  const streakEl = document.getElementById('habit-' + habit + '-streak');
  if (!btn || !streakEl) return;
  if (data.doneToday) {
    btn.textContent = '✓ DONE';
    btn.classList.add('bg-[#DC143C]', 'text-white', 'border-[#DC143C]');
    btn.classList.remove('border-[#DC143C]/50');
  } else {
    btn.textContent = 'LOG';
    btn.classList.remove('bg-[#DC143C]', 'text-white', 'border-[#DC143C]');
    btn.classList.add('border-[#DC143C]/50');
  }
  streakEl.textContent = data.streak || 0;
}


/* ============================================================
   8. JOB APPLICATION TRACKER
   ============================================================ */
function loadJobs() {
  const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
  const list = document.getElementById('job-list');
  list.innerHTML = '';
  let applications = 0;
  let interviews = 0;

  jobs.forEach((job, i) => {
    if (job.status !== 'rejected') applications++;
    if (job.status === 'interview' || job.status === 'offer') interviews++;

    const statusColors = {
      'applied': 'text-blue-400',
      'interview': 'text-yellow-400',
      'rejected': 'text-red-400',
      'offer': 'text-emerald-400'
    };

    list.innerHTML += `
      <div class="flex items-center justify-between bg-[#0A0A0A]/60 p-2 rounded border border-[#D3D3D3]/10">
        <div class="flex-1 min-w-0">
          <div class="font-bold text-white truncate">${escapeHtml(job.role)}</div>
          <div class="text-[10px] text-[#D3D3D3]/60 truncate">${escapeHtml(job.company)}</div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] uppercase font-tech ${statusColors[job.status] || 'text-[#D3D3D3]'}">${job.status}</span>
          <button onclick="deleteJob(${i})" class="text-[#DC143C] hover:text-white text-xs">✕</button>
        </div>
      </div>`;
  });

  document.getElementById('stat-applications').textContent = applications;
  document.getElementById('stat-interviews').textContent = interviews;
  document.getElementById('stat-conversion').textContent =
    applications > 0 ? Math.round((interviews / applications) * 100) + '%' : '0%';
  document.getElementById('job-count').textContent = jobs.length + ' TOTAL';
}

function addJob() {
  const company = document.getElementById('job-company').value.trim();
  const role = document.getElementById('job-role').value.trim();
  const status = document.getElementById('job-status').value;
  if (!company || !role) return;

  const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
  jobs.unshift({ company, role, status, date: new Date().toISOString() });
  localStorage.setItem('jobs', JSON.stringify(jobs));
  document.getElementById('job-company').value = '';
  document.getElementById('job-role').value = '';
  loadJobs();
}

function deleteJob(index) {
  const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
  jobs.splice(index, 1);
  localStorage.setItem('jobs', JSON.stringify(jobs));
  loadJobs();
}


/* ============================================================
   9. DEBT TRACKER (with edit toggle)
   ============================================================ */
const TOTAL_DEBT = 3029;

function loadDebt() {
  const paid = parseFloat(localStorage.getItem('debt_paid') || '0');
  const remaining = Math.max(0, TOTAL_DEBT - paid);
  const progress = (paid / TOTAL_DEBT) * 100;

  document.getElementById('debt-remaining').textContent = remaining.toLocaleString();
  document.getElementById('debt-paid-display').textContent = paid.toLocaleString();
  document.getElementById('debt-progress-bar').style.width = progress + '%';

  updateNetWorth();
}

function toggleDebtEdit() {
  const display = document.getElementById('debt-paid-display');
  const edit = document.getElementById('debt-paid-edit');
  if (!display || !edit) return;

  if (edit.classList.contains('hidden')) {
    edit.value = localStorage.getItem('debt_paid') || '0';
    display.classList.add('hidden');
    edit.classList.remove('hidden');
    edit.focus();
    edit.select();
  }
}

function commitDebtEdit() {
  const display = document.getElementById('debt-paid-display');
  const edit = document.getElementById('debt-paid-edit');
  if (!display || !edit) return;
  if (edit.classList.contains('hidden')) return; // Already committed

  const val = Math.max(0, parseFloat(edit.value) || 0);
  localStorage.setItem('debt_paid', val.toString());
  display.classList.remove('hidden');
  edit.classList.add('hidden');
  loadDebt();
}

function addDebtPayment() {
  const input = document.getElementById('debt-payment-input');
  const amount = parseFloat(input.value);
  if (!amount || amount <= 0) return;
  const paid = parseFloat(localStorage.getItem('debt_paid') || '0') + amount;
  localStorage.setItem('debt_paid', paid.toString());
  input.value = '';
  loadDebt();
}


/* ============================================================
   10. NET WORTH TRACKER
   ============================================================ */
function loadAssets() {
  const assets = JSON.parse(localStorage.getItem('assets') || '[]');
  const list = document.getElementById('asset-list');
  list.innerHTML = '';

  assets.forEach((asset, i) => {
    list.innerHTML += `
      <div class="flex items-center justify-between bg-[#0A0A0A]/60 p-2 rounded border border-[#D3D3D3]/10">
        <span class="text-[#D3D3D3] truncate">${escapeHtml(asset.name)}</span>
        <div class="flex items-center gap-2">
          <span class="text-emerald-400 font-bold">£${parseFloat(asset.amount).toLocaleString()}</span>
          <button onclick="deleteAsset(${i})" class="text-[#DC143C] hover:text-white text-xs">✕</button>
        </div>
      </div>`;
  });

  updateNetWorth();
}

function addAsset() {
  const name = document.getElementById('asset-name').value.trim();
  const amount = parseFloat(document.getElementById('asset-amount').value);
  if (!name || isNaN(amount) || amount <= 0) return;

  const assets = JSON.parse(localStorage.getItem('assets') || '[]');
  assets.push({ name, amount });
  localStorage.setItem('assets', JSON.stringify(assets));

  document.getElementById('asset-name').value = '';
  document.getElementById('asset-amount').value = '';
  loadAssets();
}

function deleteAsset(index) {
  const assets = JSON.parse(localStorage.getItem('assets') || '[]');
  assets.splice(index, 1);
  localStorage.setItem('assets', JSON.stringify(assets));
  loadAssets();
}

function updateNetWorth() {
  const assets = JSON.parse(localStorage.getItem('assets') || '[]');
  const totalAssets = assets.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);

  const paid = parseFloat(localStorage.getItem('debt_paid') || '0');
  const remainingDebt = Math.max(0, TOTAL_DEBT - paid);
  const netWorth = totalAssets - remainingDebt;

  document.getElementById('total-assets').textContent = totalAssets.toLocaleString();
  document.getElementById('total-liabilities').textContent = remainingDebt.toLocaleString();

  const el = document.getElementById('net-worth-total');
  el.textContent = netWorth.toLocaleString();
  el.className = netWorth >= 0
    ? 'text-3xl font-tech font-bold text-emerald-400 stat-value'
    : 'text-3xl font-tech font-bold text-[#DC143C] stat-value';
}


/* ============================================================
   11. POMODORO TIMER
   ============================================================ */
let pomoSeconds = 25 * 60;
let pomoInterval = null;
let pomoRunning = false;
let pomoMode = 'work';

function updatePomodoroDisplay() {
  const mins = Math.floor(pomoSeconds / 60);
  const secs = pomoSeconds % 60;
  document.getElementById('pomodoro-display').textContent =
    String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  document.getElementById('pomodoro-mode').textContent =
    pomoMode === 'work' ? 'WORK SESSION' : 'BREAK TIME';
}

function startPomodoro() {
  if (pomoRunning) return;
  pomoRunning = true;
  pomoInterval = setInterval(() => {
    pomoSeconds--;
    if (pomoSeconds <= 0) {
      clearInterval(pomoInterval);
      pomoRunning = false;
      if (pomoMode === 'work') {
        const count = parseInt(localStorage.getItem('pomo_count') || '0') + 1;
        localStorage.setItem('pomo_count', count);
        document.getElementById('pomo-count').textContent = count;
        pomoMode = 'break';
        pomoSeconds = 5 * 60;
      } else {
        pomoMode = 'work';
        pomoSeconds = 25 * 60;
      }
      updatePomodoroDisplay();
    } else {
      updatePomodoroDisplay();
    }
  }, 1000);
}

function pausePomodoro() {
  clearInterval(pomoInterval);
  pomoRunning = false;
}

function resetPomodoro() {
  clearInterval(pomoInterval);
  pomoRunning = false;
  pomoMode = 'work';
  pomoSeconds = 25 * 60;
  updatePomodoroDisplay();
}

function loadPomodoroCount() {
  document.getElementById('pomo-count').textContent =
    localStorage.getItem('pomo_count') || '0';
}


/* ============================================================
   12. MILESTONES
   ============================================================ */
function saveMilestone(id) {
  const checked = document.getElementById('milestone-' + id).checked;
  localStorage.setItem('milestone_' + id, checked);
}

function loadMilestones() {
  ['cscs-course', 'cscs-test', 'cscs-card', 'labourer',
   'gp-booked', 'asrs', 'rtc', 'assessment', 'diagnosis',
   'article1', 'volunteer', 'ga4', 'digitaljob'].forEach(id => {
    const checked = localStorage.getItem('milestone_' + id) === 'true';
    const el = document.getElementById('milestone-' + id);
    if (el) el.checked = checked;
  });
}


/* ============================================================
   13. QUICK WINS
   ============================================================ */
function saveWins() {
  const wins = {
    win1: document.getElementById('win1').value,
    win2: document.getElementById('win2').value,
    win3: document.getElementById('win3').value,
    date: today
  };
  localStorage.setItem('wins_' + today, JSON.stringify(wins));
  document.getElementById('wins-saved-time').textContent =
    new Date().toLocaleTimeString();
}

function loadWins() {
  const wins = JSON.parse(localStorage.getItem('wins_' + today) || 'null');
  if (wins) {
    document.getElementById('win1').value = wins.win1 || '';
    document.getElementById('win2').value = wins.win2 || '';
    document.getElementById('win3').value = wins.win3 || '';
    document.getElementById('wins-saved-time').textContent = 'Today';
  }
}


/* ============================================================
   14. SUPPLEMENTS
   ============================================================ */
function saveSupplements(id) {
  const checked = document.getElementById('supp-' + id).checked;
  localStorage.setItem('supp_' + id + '_' + today, checked);
}

function loadSupplements() {
  ['water', 'vitd', 'omega', 'mag', 'protein'].forEach(id => {
    const checked = localStorage.getItem('supp_' + id + '_' + today) === 'true';
    const el = document.getElementById('supp-' + id);
    if (el) el.checked = checked;
  });
}


/* ============================================================
   15. DOCUMENT INGESTION ENGINE
   ============================================================ */
let pendingDoc = null;

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

function showProcessing(show, text, percent) {
  const status = document.getElementById('processing-status');
  const bar = document.getElementById('processing-bar');
  const progress = document.getElementById('processing-progress');
  const textEl = document.getElementById('processing-text');
  if (show) {
    status.classList.remove('hidden');
    if (text) textEl.textContent = text;
    if (typeof percent === 'number') {
      bar.style.width = percent + '%';
      progress.textContent = percent + '%';
    }
  } else {
    status.classList.add('hidden');
    bar.style.width = '0%';
    progress.textContent = '0%';
  }
}

async function handleFiles(files) {
  if (!files || !files.length) return;
  const file = files[0];
  try {
    showProcessing(true, 'READING FILE...', 5);
    let text = '';
    if (file.type.startsWith('image/')) {
      text = await ocrImage(file);
    } else if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
      text = await extractPdfText(file);
    } else {
      text = await file.text();
    }
    showProcessing(true, 'PARSING...', 95);
    const parsed = parseDocumentText(text, file.name);
    parsed.raw = text;
    parsed.fileName = file.name;
    showPreview(parsed);
  } catch (err) {
    console.error(err);
    alert('Failed to process file: ' + err.message);
  } finally {
    showProcessing(false);
  }
}

async function ocrImage(file) {
  if (!window.Tesseract) throw new Error('Tesseract.js not loaded');
  const result = await Tesseract.recognize(file, 'eng', {
    logger: m => {
      if (m.status === 'recognizing text') {
        showProcessing(true, 'OCR: RECOGNIZING TEXT...', Math.round(m.progress * 100));
      } else if (m.status) {
        showProcessing(true, 'OCR: ' + m.status.toUpperCase() + '...', 10);
      }
    }
  });
  return result.data.text || '';
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) throw new Error('PDF.js not loaded');
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    showProcessing(true, `PDF: PAGE ${i} / ${pdf.numPages}`, Math.round((i / pdf.numPages) * 90));
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(' ') + '\n';
  }
  return fullText;
}

function parseDocumentText(text, filename) {
  const doc = {
    docType: 'other',
    date: '',
    company: '',
    role: '',
    amount: '',
    url: '',
    raw: text,
    fileName: filename || ''
  };
  const lower = text.toLowerCase();

  if (lower.includes('interview')) doc.docType = 'interview_invite';
  else if (lower.includes('unfortunately') || lower.includes('not successful') || lower.includes('reject'))
    doc.docType = 'rejection';
  else if (lower.includes('pleased to offer') || lower.includes('job offer') || lower.includes('offer of employment'))
    doc.docType = 'offer';
  else if (lower.includes('received your application') || lower.includes('thank you for applying') || lower.includes('application confirmation'))
    doc.docType = 'application_confirmation';
  else if (lower.includes('certificate') || lower.includes('certification') || lower.includes('certified'))
    doc.docType = 'certification';
  else if (lower.includes('payslip') || lower.includes('payment') || /£\s?\d/.test(text))
    doc.docType = 'payment';

  const amountMatch = text.match(/£\s?([\d,]+(?:\.\d{2})?)/);
  if (amountMatch) doc.amount = amountMatch[1].replace(/,/g, '');

  const dateMatch = text.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
  if (dateMatch) doc.date = dateMatch[1];

  const urlMatch = text.match(/https?:\/\/[^\s<>")]+/);
  if (urlMatch) doc.url = urlMatch[0];

  const companyMatch = text.match(/(?:from|at|with)\s+([A-Z][A-Za-z0-9&'\.\- ]{2,40})/);
  if (companyMatch) doc.company = companyMatch[1].trim();

  return doc;
}

function showPreview(doc) {
  pendingDoc = doc;
  document.getElementById('ext-doc-type').value = doc.docType || 'other';
  document.getElementById('ext-date').value = doc.date || '';
  document.getElementById('ext-company').value = doc.company || '';
  document.getElementById('ext-role').value = doc.role || '';
  document.getElementById('ext-amount').value = doc.amount || '';
  document.getElementById('ext-url').value = doc.url || '';
  document.getElementById('ext-raw').value = doc.raw || '';
  document.getElementById('preview-modal').classList.remove('hidden');
}

function closePreview() {
  document.getElementById('preview-modal').classList.add('hidden');
  pendingDoc = null;
}

function saveIngestedDocument() {
  if (!pendingDoc) return;
  const doc = {
    docType: document.getElementById('ext-doc-type').value,
    date: document.getElementById('ext-date').value,
    company: document.getElementById('ext-company').value,
    role: document.getElementById('ext-role').value,
    amount: document.getElementById('ext-amount').value,
    url: document.getElementById('ext-url').value,
    raw: document.getElementById('ext-raw').value,
    fileName: pendingDoc.fileName || '',
    savedAt: new Date().toISOString()
  };

  const docs = JSON.parse(localStorage.getItem('ingested_docs') || '[]');
  docs.unshift(doc);
  localStorage.setItem('ingested_docs', JSON.stringify(docs));

  if (doc.docType === 'application_confirmation' && doc.company && doc.role) {
    pushJob(doc, 'applied');
  } else if (doc.docType === 'interview_invite' && doc.company && doc.role) {
    pushJob(doc, 'interview');
  } else if (doc.docType === 'offer' && doc.company && doc.role) {
    pushJob(doc, 'offer');
  } else if (doc.docType === 'rejection' && doc.company && doc.role) {
    pushJob(doc, 'rejected');
  } else if (doc.docType === 'payment' && doc.amount) {
    const paid = parseFloat(localStorage.getItem('debt_paid') || '0') + parseFloat(doc.amount);
    localStorage.setItem('debt_paid', paid.toString());
    loadDebt();
  }

  closePreview();
  loadIngestedDocs();
}

function pushJob(doc, status) {
  const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
  jobs.unshift({ company: doc.company, role: doc.role, status, date: doc.savedAt });
  localStorage.setItem('jobs', JSON.stringify(jobs));
  loadJobs();
}

function loadIngestedDocs() {
  const docs = JSON.parse(localStorage.getItem('ingested_docs') || '[]');
  const feed = document.getElementById('ingested-feed');
  const count = document.getElementById('ingested-count');
  feed.innerHTML = '';
  count.textContent = docs.length + ' DOCS';

  docs.forEach((doc, i) => {
    const dateStr = doc.savedAt ? new Date(doc.savedAt).toLocaleDateString() : '';
    feed.innerHTML += `
      <div class="flex items-start justify-between bg-[#0A0A0A]/60 p-3 rounded border border-[#D3D3D3]/10">
        <div class="flex-1 min-w-0">
          <div class="font-bold text-white text-[11px] uppercase font-tech tracking-wider">${doc.docType}</div>
          <div class="text-[10px] text-[#D3D3D3]/60 truncate">${escapeHtml(doc.company || doc.fileName || '(no company)')}${doc.amount ? ' — £' + doc.amount : ''}</div>
          <div class="text-[10px] text-[#D3D3D3]/40">${dateStr}</div>
        </div>
        <button onclick="deleteIngested(${i})" class="text-[#DC143C] hover:text-white text-xs ml-2">✕</button>
      </div>`;
  });
}

function deleteIngested(index) {
  const docs = JSON.parse(localStorage.getItem('ingested_docs') || '[]');
  docs.splice(index, 1);
  localStorage.setItem('ingested_docs', JSON.stringify(docs));
  loadIngestedDocs();
}


/* ============================================================
   16. UTILITIES
   ============================================================ */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


/* ============================================================
   17. INIT — RUN ON DOM READY
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {  // Initialize Google API
  const script = document.createElement('script');
  script.src = "https://accounts.google.com/gsi/client";
  script.onload = () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
          callback: handleAuthResponse,
      });
      initializeGapiClient();
  };
  document.head.appendChild(script);
  // Wire up drop zone
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-[#DC143C]', 'bg-[#DC143C]/5');
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-[#DC143C]', 'bg-[#DC143C]/5');
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-[#DC143C]', 'bg-[#DC143C]/5');
      handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
  }

  // Boot all modules
  loadHabits();
  loadJobs();
  loadDebt();
  loadAssets();
  loadPomodoroCount();
  loadMilestones();
  loadWins();
  loadSupplements();
  loadIngestedDocs();
  updatePomodoroDisplay();
});
/* ============================================================
   18. GOOGLE CALENDAR INTEGRATION
   ============================================================ */
function initializeGapiClient() {
    gapi.load('client', async () => {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
    });
}

function handleAuthClick() {
    tokenClient.requestAccessToken();
}

function handleAuthResponse(resp) {
    if (resp.error !== undefined) {
        console.error(resp);
        return;
    }
    fetchCalendarEvents();
}

async function fetchCalendarEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
        const response = await gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': today.toISOString(),
            'timeMax': tomorrow.toISOString(),
            'singleEvents': true,
            'orderBy': 'startTime'
        });

        const events = response.result.items;
        drawWheel(events);
    } catch (err) {
        console.error('Error fetching calendar:', err);
    }
}

function drawWheel(events) {
    const svg = document.getElementById('chrono-matrix-svg');
    if (!svg) return;
    svg.innerHTML = ''; 

    const radius = 80;
    const circumference = 2 * Math.PI * radius; 
    const totalMinutesInDay = 24 * 60; 

    const bgRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bgRing.setAttribute("cx", "100");
    bgRing.setAttribute("cy", "100");
    bgRing.setAttribute("r", radius);
    bgRing.setAttribute("fill", "transparent");
    bgRing.setAttribute("stroke", "#1A1A1A");
    bgRing.setAttribute("stroke-width", "28");
    svg.appendChild(bgRing);

    if (!events || events.length === 0) {
        return; 
    }

    events.forEach(event => {
        if (!event.start.dateTime) return; 

        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);

        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const endMinutes = end.getHours() * 60 + end.getMinutes();
        
        let durationMinutes = endMinutes - startMinutes;
        if (durationMinutes < 0) durationMinutes += totalMinutesInDay; 

        const minutesToStroke = circumference / totalMinutesInDay;
        const strokeLength = durationMinutes * minutesToStroke;
        const strokeOffset = circumference - (startMinutes * minutesToStroke);

        const arc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        arc.setAttribute("cx", "100");
        arc.setAttribute("cy", "100");
        arc.setAttribute("r", radius);
        arc.setAttribute("fill", "transparent");
        arc.setAttribute("stroke", "#DC143C"); 
        arc.setAttribute("stroke-width", "28");
        arc.setAttribute("stroke-dasharray", `${strokeLength} ${circumference - strokeLength}`);
        arc.setAttribute("stroke-dashoffset", strokeOffset);
        arc.setAttribute("class", "hover:brightness-125 transition-all cursor-pointer");
        
        arc.addEventListener('click', () => {
            const timeString = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')} - ${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
            updateInfo(event.summary || 'Untitled Event', timeString, event.description || 'No description');
        });

        svg.appendChild(arc);
    });
}
window.addEventListener('beforeunload', () => {
  try { saveWins(); } catch (e) { /* noop */ }
});
