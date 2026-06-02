import { ConvexClient } from "https://esm.sh/convex@1.17.0/browser";

const clockEl = document.getElementById("clock");
const alarmInput = document.getElementById("alarm-time");
const setBtn = document.getElementById("set-btn");
const clearBtn = document.getElementById("clear-btn");
const stopBtn = document.getElementById("stop-btn");
const statusEl = document.getElementById("status");
const syncEl = document.getElementById("sync-status");
const sound = document.getElementById("alarm-sound");

let alarmTime = null;
let ringing = false;
let convex = null;

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

function applyAlarm(alarm) {
  if (alarm && alarm.enabled) {
    alarmTime = alarm.time;
    alarmInput.value = alarm.time;
    statusEl.textContent = `${alarm.time} にアラームをセット中`;
    clearBtn.disabled = false;
  } else {
    alarmTime = null;
    statusEl.textContent = "アラーム未設定";
    clearBtn.disabled = true;
  }
}

async function saveAlarm(time, enabled) {
  if (!convex) return;
  try {
    await convex.mutation("alarms:set", { time, enabled });
  } catch (e) {
    console.error("Convex save failed", e);
  }
}

async function clearAlarm() {
  if (!convex) return;
  try {
    await convex.mutation("alarms:clear", {});
  } catch (e) {
    console.error("Convex clear failed", e);
  }
}

setBtn.addEventListener("click", () => {
  if (!alarmInput.value) return;
  alarmTime = alarmInput.value;
  statusEl.textContent = `${alarmTime} にアラームをセットしました`;
  clearBtn.disabled = false;
  saveAlarm(alarmTime, true);
});

clearBtn.addEventListener("click", () => {
  alarmTime = null;
  statusEl.textContent = "アラーム未設定";
  clearBtn.disabled = true;
  clearAlarm();
});

stopBtn.addEventListener("click", () => {
  sound.pause();
  sound.currentTime = 0;
  ringing = false;
  alarmTime = null;
  stopBtn.disabled = true;
  clearBtn.disabled = true;
  statusEl.textContent = "アラームを停止しました";
  clearAlarm();
});

setInterval(tick, 1000);
tick();

if (window.CONVEX_URL && window.CONVEX_URL.length > 0) {
  try {
    convex = new ConvexClient(window.CONVEX_URL);
    syncEl.textContent = "同期: 接続中";
    convex.onUpdate("alarms:get", {}, (alarm) => {
      syncEl.textContent = "同期: 接続済み";
      if (!ringing) applyAlarm(alarm);
    });
  } catch (e) {
    console.error("Convex init failed", e);
    syncEl.textContent = "同期: エラー";
  }
} else {
  syncEl.textContent = "同期: 未設定 (config.js に CONVEX_URL を設定)";
}
