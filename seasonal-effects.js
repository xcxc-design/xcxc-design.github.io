(() => {
  "use strict";

  const layer = document.getElementById("seasonEffectLayer");
  const select = document.getElementById("seasonSelect");

  if (!layer || !select) {
    return;
  }

  const seasonConfig = {
    spring: { className: "season-spring", count: 26 },
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

  function saveSeason(season) {
    try {
      localStorage.setItem("selectedSeason", season);
    } catch (error) {}
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle(season, index) {
    const particle = document.createElement("span");
    particle.className = "season-particle";
    particle.setAttribute("aria-hidden", "true");

    const size =
      season === "winter"
        ? random(7, 17)
        : season === "summer"
          ? random(7, 13)
          : random(9, 18);

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

    return particle;
  }

  function renderParticles(season) {
    const config = seasonConfig[season];
    layer.className = `season-effect-layer ${config.className}`;
    layer.replaceChildren();

    const fragment = document.createDocumentFragment();
    for (let index = 0; index < config.count; index += 1) {
      fragment.appendChild(createParticle(season, index));
    }
    layer.appendChild(fragment);
  }

  function applySeason(season) {
    if (!seasonConfig[season]) return;
    select.value = season;
    renderParticles(season);
    saveSeason(season);
  }

  const initialSeason = readSavedSeason();
  applySeason(initialSeason);
  select.addEventListener("change", () => applySeason(select.value));
  document.addEventListener("visibilitychange", () => {
    layer.classList.toggle("page-hidden", document.hidden);
  });
})();
