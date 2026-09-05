export function createUI() {
  const toastEl = document.getElementById("toast");
  const hintEl = document.getElementById("hint-bar");
  const bagEl = document.getElementById("bag");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("modal-close");

  let toastTimer = 0;

  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.remove("hidden");
    toastTimer = 220;
  }

  function tickToast(dt) {
    if (toastTimer <= 0) return;
    toastTimer -= dt;
    if (toastTimer <= 0) toastEl.classList.add("hidden");
  }

  function isModalOpen() {
    return !modal.classList.contains("hidden");
  }

  function openModal(title, html) {
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modalBody.innerHTML = "";
  }

  closeBtn.onclick = closeModal;

  function setHint(text) {
    hintEl.textContent = text;
  }

  function setBag(text) {
    bagEl.textContent = text;
  }

  function refreshHud({ sceneName, dayLabel, gold, health, energy, happy, bag }) {
    document.getElementById("scene-name").textContent = sceneName;
    document.getElementById("day-label").textContent = dayLabel;
    document.getElementById("stat-gold").textContent = gold;
    document.getElementById("stat-health").textContent = health;
    document.getElementById("stat-energy").textContent = energy;
    document.getElementById("stat-happy").textContent = happy;
    setBag(bag);
  }

  function showGame() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-root").classList.remove("hidden");
  }

  return {
    toast,
    tickToast,
    isModalOpen,
    openModal,
    closeModal,
    modalBody,
    setHint,
    refreshHud,
    showGame,
  };
}
