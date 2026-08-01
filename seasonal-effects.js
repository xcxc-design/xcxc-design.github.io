(() => {
  "use strict";

  const layer =
    document.getElementById(
      "seasonEffectLayer"
    );

  const toggle =
    document.getElementById(
      "seasonToggle"
    );

  const label =
    document.getElementById(
      "seasonToggleLabel"
    );

  if (!layer || !toggle || !label) {
    return;
  }

  const seasonConfig = {
    spring: {
      label: "春日花瓣",
      className: "season-spring",
      count: 26
    },
    summer: {
      label: "夏日蒲公英",
      className: "season-summer",
      count: 20
    },
    autumn: {
      label: "秋日落叶",
      className: "season-autumn",
      count: 22
    },
    winter: {
      label: "冬日雪花",
      className: "season-winter",
      count: 34
    }
  };

  function getCurrentSeason() {
    const month =
      new Date().getMonth() + 1;

    if (month >= 3 && month <= 5) {
      return "spring";
    }

    if (month >= 6 && month <= 8) {
      return "summer";
    }

    if (month >= 9 && month <= 11) {
      return "autumn";
    }

    return "winter";
  }

  function random(min, max) {
    return (
      Math.random() * (max - min) + min
    );
  }

  function createParticle(
    season,
    index
  ) {
    const particle =
      document.createElement("span");

    particle.className =
      "season-particle";

    particle.setAttribute(
      "aria-hidden",
      "true"
    );

    const size =
      season === "winter"
        ? random(7, 17)
        : season === "summer"
          ? random(7, 13)
          : random(9, 18);

    const duration =
      season === "summer"
        ? random(13, 22)
        : random(9, 17);

    const drift =
      random(-150, 150);

    const sway =
      random(24, 82);

    const opacity =
      season === "summer"
        ? random(0.34, 0.72)
        : random(0.48, 0.88);

    particle.style.setProperty(
      "--particle-left",
      `${random(-3, 100)}vw`
    );

    particle.style.setProperty(
      "--particle-size",
      `${size}px`
    );

    particle.style.setProperty(
      "--particle-duration",
      `${duration}s`
    );

    particle.style.setProperty(
      "--particle-delay",
      `${random(-duration, 0)}s`
    );

    particle.style.setProperty(
      "--particle-drift",
      `${drift}px`
    );

    particle.style.setProperty(
      "--particle-sway",
      `${sway}px`
    );

    particle.style.setProperty(
      "--particle-opacity",
      opacity.toFixed(2)
    );

    const rotate =
      random(160, 520);

    particle.style.setProperty(
      "--particle-rotate",
      `${rotate}deg`
    );

    particle.style.setProperty(
      "--particle-rotate-mid-one",
      `${rotate * 0.42}deg`
    );

    particle.style.setProperty(
      "--particle-rotate-mid-two",
      `${rotate * 0.76}deg`
    );

    particle.style.setProperty(
      "--particle-blur",
      index % 7 === 0
        ? "0.6px"
        : "0px"
    );

    if (season === "winter") {
      particle.textContent =
        index % 4 === 0
          ? "❄"
          : "•";
    }

    return particle;
  }

  function renderParticles(season) {
    const config =
      seasonConfig[season];

    layer.className =
      `season-effect-layer ${config.className}`;

    layer.replaceChildren();

    const fragment =
      document.createDocumentFragment();

    for (
      let index = 0;
      index < config.count;
      index += 1
    ) {
      fragment.appendChild(
        createParticle(
          season,
          index
        )
      );
    }

    layer.appendChild(fragment);
    label.textContent = config.label;
  }

  function readSavedState() {
    try {
      const saved =
        localStorage.getItem(
          "seasonEffectsEnabled"
        );

      if (saved === null) {
        return true;
      }

      return saved === "true";
    } catch {
      return true;
    }
  }

  function saveState(enabled) {
    try {
      localStorage.setItem(
        "seasonEffectsEnabled",
        String(enabled)
      );
    } catch {
      // 本地存储不可用时不影响动效运行。
    }
  }

  function setEnabled(
    enabled,
    shouldSave = true
  ) {
    layer.classList.toggle(
      "is-paused",
      !enabled
    );

    toggle.classList.toggle(
      "is-off",
      !enabled
    );

    toggle.setAttribute(
      "aria-checked",
      String(enabled)
    );

    toggle.setAttribute(
      "aria-label",
      enabled
        ? "关闭季节动效"
        : "开启季节动效"
    );

    if (shouldSave) {
      saveState(enabled);
    }
  }

  const currentSeason =
    getCurrentSeason();

  renderParticles(currentSeason);

  const reducedMotion =
    window.matchMedia &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const initialEnabled =
    reducedMotion
      ? false
      : readSavedState();

  setEnabled(
    initialEnabled,
    false
  );

  toggle.addEventListener(
    "click",
    () => {
      const enabled =
        toggle.getAttribute(
          "aria-checked"
        ) !== "true";

      setEnabled(enabled);
    }
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      layer.classList.toggle(
        "page-hidden",
        document.hidden
      );
    }
  );
})();
