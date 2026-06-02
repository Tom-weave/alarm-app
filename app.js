const clockEl = document.getElementById("clock");
const alarmInput = document.getElementById("alarm-time");
const setBtn = document.getElementById("set-btn");
const clearBtn = document.getElementById("clear-btn");
const stopBtn = document.getElementById("stop-btn");
const statusEl = document.getElementById("status");
const sound = document.getElementById("alarm-sound");

let alarmTime = null;
let ringing = false;

function pad(n) {
  return n.toString().padStart(2, "0");
}

function tick() {
  const now = new Date();
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  clockEl.textContent = `${hh}:${mm}:${ss}`;

  if (alarmTime && !ringing && `${hh}:${mm}` === alarmTime) {
    ring();
  }
}

function ring() {
  ringing = true;
  statusEl.textContent = "⏰ 時間です！";
  stopBtn.disabled = false;
  sound.play().catch(() => {
    statusEl.textContent = "⏰ 時間です！（音声再生不可）";
  });
}

setBtn.addEventListener("click", () => {
  if (!alarmInput.value) return;
  alarmTime = alarmInput.value;
  statusEl.textContent = `${alarmTime} にアラームをセットしました`;
  clearBtn.disabled = false;
});

clearBtn.addEventListener("click", () => {
  alarmTime = null;
  statusEl.textContent = "アラーム未設定";
  clearBtn.disabled = true;
});

stopBtn.addEventListener("click", () => {
  sound.pause();
  sound.currentTime = 0;
  ringing = false;
  alarmTime = null;
  stopBtn.disabled = true;
  clearBtn.disabled = true;
  statusEl.textContent = "アラームを停止しました";
});

setInterval(tick, 1000);
tick();
