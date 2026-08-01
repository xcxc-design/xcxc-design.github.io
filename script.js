const menuButton = document.getElementById("menuButton");
const siteNav = document.getElementById("siteNav");

if (menuButton && siteNav) {
  const openMenu = () => {
    siteNav.classList.add("open");
    document.body.classList.add("menu-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "关闭导航菜单");
  };

  const closeMenu = () => {
    siteNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "打开导航菜单");
  };

  menuButton.setAttribute("aria-expanded", "false");

  menuButton.addEventListener("click", event => {
    event.stopPropagation();
    if (siteNav.classList.contains("open")) closeMenu();
    else openMenu();
  });

  siteNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", event => {
    if (
      siteNav.classList.contains("open") &&
      !siteNav.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

const yearNode = document.getElementById("currentYear");
if (yearNode) yearNode.textContent = new Date().getFullYear();

(() => {
  const wrap = document.querySelector(".hero-photo-wrap");
  const bubble = document.getElementById("photoBubble");
  if (!wrap || !bubble) return;

  const messages = [
    "这是上海外滩的夜景，东方明珠塔在我的对面",
    "让我们成为幸福大王ᶻz ₍^_ ̫ _^₎",
    "我相信缓慢 平和 细水长流的力量"
  ];

  const desktopPositions = [
    { className: "bubble-right-top", side: "right" },
    { className: "bubble-right-middle", side: "right" },
    { className: "bubble-right-bottom", side: "right" },
    { className: "bubble-left-top", side: "left" },
    { className: "bubble-left-middle", side: "left" },
    { className: "bubble-left-bottom", side: "left" },
    { className: "bubble-inside-top", side: "inside" },
    { className: "bubble-inside-bottom", side: "inside" }
  ];

  const mobilePositions = [
    { className: "bubble-mobile-top" },
    { className: "bubble-mobile-bottom" },
    { className: "bubble-mobile-above" },
    { className: "bubble-mobile-below" }
  ];

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  let messageIndex = 0;
  let lastPositionClass = "";
  let hideTimer = null;

  function randomBetween(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function availableDesktopPositions() {
    const rect = wrap.getBoundingClientRect();
    const spaceLeft = rect.left;
    const spaceRight = window.innerWidth - rect.right;

    let choices = desktopPositions.filter(position => {
      if (position.side === "left") return spaceLeft >= 330;
      if (position.side === "right") return spaceRight >= 330;
      return true;
    });

    if (choices.length < 3) {
      choices = desktopPositions.filter(position => position.side === "inside");
    }

    return choices;
  }

  function choosePosition() {
    const choices = canHover.matches
      ? availableDesktopPositions()
      : mobilePositions;

    let available = choices.filter(item => item.className !== lastPositionClass);
    if (!available.length) available = choices;

    const selected = available[Math.floor(Math.random() * available.length)];
    lastPositionClass = selected.className;
    return selected.className;
  }

  function showBubble() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    const positionClass = choosePosition();
    bubble.hidden = false;
    bubble.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;

    bubble.className = `photo-bubble ${positionClass}`;
    bubble.style.setProperty("--bubble-jitter-x", `${randomBetween(-14, 14)}px`);
    bubble.style.setProperty("--bubble-jitter-y", `${randomBetween(-12, 12)}px`);

    requestAnimationFrame(() => {
      bubble.classList.add("show");
    });
  }

  function hideBubble() {
    bubble.classList.remove("show");
    hideTimer = window.setTimeout(() => {
      bubble.hidden = true;
    }, 190);
  }

  if (canHover.matches) {
    wrap.addEventListener("mouseenter", showBubble);
    wrap.addEventListener("mouseleave", hideBubble);
  } else {
    wrap.addEventListener("click", event => {
      event.stopPropagation();
      if (!bubble.hidden && bubble.classList.contains("show")) hideBubble();
      else showBubble();
    });

    document.addEventListener("click", event => {
      if (!wrap.contains(event.target) && !bubble.hidden) hideBubble();
    });
  }
})();
