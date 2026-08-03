const countdownEl = document.getElementById("countdown");
const codeBoxEl = document.getElementById("codeBox");
const secretCodeEl = document.getElementById("secretCode");
const topSandEl = document.getElementById("topSand");
const bottomSandEl = document.getElementById("bottomSand");
const sandStreamEl = document.getElementById("sandStream");

const params = new URLSearchParams(window.location.search);
const secretCode = params.get("code") || "149";
const HOURGLASS_DURATION_MS = 2 * 60 * 60 * 1000;

function parseTargetDate() {
  const target = new Date();
  target.setHours(22, 20, 0, 0);
  return target;
}

const target = parseTargetDate();

secretCodeEl.textContent = secretCode;

function formatDuration(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateSand(remainingMs) {
  const normalizedRemaining = Math.min(HOURGLASS_DURATION_MS, Math.max(0, remainingMs));
  const ratioRemaining = normalizedRemaining / HOURGLASS_DURATION_MS;
  const topHeight = ratioRemaining * 100;
  const bottomHeight = (1 - ratioRemaining) * 100;
  const streamVisible = remainingMs > 0 && remainingMs <= HOURGLASS_DURATION_MS;

  topSandEl.style.height = `${topHeight}%`;
  bottomSandEl.style.height = `${bottomHeight}%`;
  sandStreamEl.style.opacity = streamVisible ? "1" : "0";
}

function revealCode() {
  codeBoxEl.classList.remove("hidden");
  document.body.classList.add("code-revealed");
  countdownEl.textContent = "00:00:00";
}

function tick() {
  const now = new Date();
  const remainingMs = target.getTime() - now.getTime();

  if (remainingMs <= 0) {
    updateSand(0);
    revealCode();
    return true;
  }

  const remainingSeconds = Math.floor(remainingMs / 1000);
  countdownEl.textContent = formatDuration(remainingSeconds);
  updateSand(remainingMs);
  return false;
}

const done = tick();
if (!done) {
  const interval = setInterval(() => {
    const finished = tick();
    if (finished) {
      clearInterval(interval);
    }
  }, 1000);
}
