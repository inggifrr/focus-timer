// =======================
// STATE TIMER
// =======================
let duration = 25 * 60; // default (dipakai kalau input batal)
let timerInterval = null;
let isRunning = false;
let alarmTimeout = null;

// =======================
// AUDIO
// =======================
const alarmSound = new Audio("assets/sounds/alrm.wav");
alarmSound.volume = 1;
alarmSound.loop = false;

// =======================
// DOM READY
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const timeEl = document.getElementById("time");
  const toggleBtn = document.getElementById("toggleBtn");

  if (!timeEl || !toggleBtn) return;

  // 🔓 unlock audio (WAJIB di browser)
  toggleBtn.addEventListener("click", unlockAudio, { once: true });

  // INPUT WAKTU (BEBAS)
  const input = prompt(
    "Masukkan waktu (menit, contoh: 25 / 60 / 90 / 1.5):",
    "60"
  );

  const minutes = Number(input);
  if (!isNaN(minutes) && minutes > 0) {
    duration = Math.floor(minutes * 60);
  }

  updateDisplay();
  toggleBtn.addEventListener("click", toggleTimer);
});

// =======================
// UNLOCK AUDIO
// =======================
function unlockAudio() {
  alarmSound.play().then(() => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }).catch(() => {});
}

// =======================
// TOGGLE TIMER
// =======================
function toggleTimer() {
  const btn = document.getElementById("toggleBtn");

  if (!isRunning) {
    startTimer();
    btn.innerText = "PAUSE";
  } else {
    pauseTimer();
    btn.innerText = "START";
  }

  isRunning = !isRunning;
}

// =======================
// START TIMER
// =======================
function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    duration--;
    updateDisplay();

    if (duration <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;

      playAlarm15Seconds();
    }
  }, 1000);
}

// =======================
// PAUSE TIMER
// =======================
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
}

// =======================
// DISPLAY TIME
// =======================
function updateDisplay() {
  const timeEl = document.getElementById("time");
  if (!timeEl) return;

  const min = Math.floor(duration / 60);
  const sec = duration % 60;

  timeEl.innerText =
    String(min).padStart(2, "0") + ":" +
    String(sec).padStart(2, "0");
}

// =======================
// ALARM 15 DETIK
// =======================
function playAlarm15Seconds() {
  if (navigator.vibrate) {
    navigator.vibrate([300, 200, 300, 200, 300]);
  }

  alarmSound.currentTime = 0;
  alarmSound.play();

  alarmTimeout = setTimeout(() => {
    stopAlarm();
    window.location.href = "timer-end.html";
  }, 15000);
}

// =======================
// STOP ALARM MANUAL
// =======================
function stopAlarm() {
  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
    alarmTimeout = null;
  }

  alarmSound.pause();
  alarmSound.currentTime = 0;
}