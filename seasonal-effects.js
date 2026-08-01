(() => {
  "use strict";

  const layer = document.getElementById("seasonEffectLayer");
  const switchButton = document.getElementById("seasonSwitch");
  const dropdown = document.getElementById("seasonDropdown");
  const dropdownTrigger = document.getElementById("seasonDropdownTrigger");
  const currentLabel = document.getElementById("seasonCurrentLabel");
  const options = Array.from(document.querySelectorAll(".season-option"));

  if (!layer || !switchButton || !dropdown || !dropdownTrigger || !currentLabel || options.length === 0) {
    return;
  }

  const seasonNames = { spring: "春", summer: "夏", autumn: "秋", winter: "冬" };
  const seasonConfig = {
    spring: { className: "season-spring", count: 28 },
    summer: { className: "season-summer", count: 20 },
    autumn: { className: "season-autumn", count: 22 },
    winter: { className: "season-winter", count: 34 }
  };

  function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "autumn";
    return "winter";
  }

  function readSavedSeason() {
    try {
      const saved = localStorage.getItem("selectedSeason");
      if (saved && seasonConfig[saved]) return saved;
    } catch (error) {}
    return getCurrentSeason();
  }

  function readEnabled() {
    try {
      const saved = localStorage.getItem("seasonEffectsEnabled");
      if (saved === "false") return false;
    } catch (error) {}
    return true;
  }

  function saveState(season, enabled) {
    try {
      localStorage.setItem("selectedSeason", season);
      localStorage.setItem("seasonEffectsEnabled", String(enabled));
    } catch (error) {}
  }

  function random(min, max) { return Math.random() * (max - min) + min; }

  function createParticle(season, index) {
    const particle = document.createElement("span");
    particle.className = "season-particle";
    particle.setAttribute("aria-hidden", "true");

    const size = season === "winter" ? random(7, 17) : season === "summer" ? random(7, 13) : random(10, 20);
    const duration = season === "summer" ? random(13, 22) : random(9, 17);
    const drift = random(-150, 150);
    const sway = random(24, 82);
    const opacity = season === "summer" ? random(0.34, 0.72) : random(0.48, 0.88);

    particle.style.setProperty("--particle-left", `${random(-3, 100)}vw`);
    particle.style.setProperty("--particle-size", `${size}px`);
    particle.style.setProperty("--particle-duration", `${duration}s`);
    particle.style.setProperty("--particle-delay", `${random(-duration, 0)}s`);
    particle.style.setProperty("--particle-drift", `${drift}px`);
    particle.style.setProperty("--particle-sway", `${sway}px`);
    particle.style.setProperty("--particle-opacity", opacity.toFixed(2));

    const rotate = random(160, 520);
    particle.style.setProperty("--particle-rotate", `${rotate}deg`);
    particle.style.setProperty("--particle-rotate-mid-one", `${rotate * 0.42}deg`);
    particle.style.setProperty("--particle-rotate-mid-two", `${rotate * 0.76}deg`);
    particle.style.setProperty("--particle-blur", index % 7 === 0 ? "0.6px" : "0px");

    if (season === "winter") {
      particle.textContent = index % 4 === 0 ? "❄" : "•";
    }

    if (season === "spring") {
      const shape = Math.random() < 0.32 ? "flower" : "petal";
      particle.dataset.shape = shape;
    }

    return particle;
  }

  let currentSeason = readSavedSeason();
  let enabled = readEnabled();

  function renderParticles() {
    if (!enabled) {
      layer.className = "season-effect-layer is-paused";
      layer.replaceChildren();
      return;
    }

    const config = seasonConfig[currentSeason];
    layer.className = `season-effect-layer ${config.className}`;
    layer.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < config.count; i += 1) fragment.appendChild(createParticle(currentSeason, i));
    layer.appendChild(fragment);
  }

  function updateControls() {
    currentLabel.textContent = seasonNames[currentSeason];
    switchButton.classList.toggle("is-off", !enabled);
    switchButton.setAttribute("aria-pressed", enabled ? "true" : "false");
    options.forEach(option => option.classList.toggle("active", option.dataset.season === currentSeason));
    dropdownTrigger.setAttribute("aria-expanded", dropdown.classList.contains("open") ? "true" : "false");
  }

  function applyState() {
    renderParticles();
    updateControls();
    saveState(currentSeason, enabled);
  }

  switchButton.addEventListener("click", () => {
    enabled = !enabled;
    applyState();
  });

  dropdownTrigger.addEventListener("click", event => {
    event.stopPropagation();
    dropdown.classList.toggle("open");
    updateControls();
  });

  dropdown.addEventListener("mouseenter", () => {
    if (window.matchMedia("(hover: hover)").matches) {
      dropdown.classList.add("open");
      updateControls();
    }
  });

  dropdown.addEventListener("mouseleave", () => {
    if (window.matchMedia("(hover: hover)").matches) {
      dropdown.classList.remove("open");
      updateControls();
    }
  });

  options.forEach(option => {
    option.addEventListener("click", event => {
      currentSeason = event.currentTarget.dataset.season;
      dropdown.classList.remove("open");
      applyState();
    });
  });

  document.addEventListener("click", event => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
      updateControls();
    }
  });

  document.addEventListener("visibilitychange", () => {
    layer.classList.toggle("page-hidden", document.hidden);
  });

  applyState();
})();
