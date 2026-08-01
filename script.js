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

    if (siteNav.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
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
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

const yearNode = document.getElementById("currentYear");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

(() => {
  const wrap = document.querySelector(".hero-photo-wrap");
  const bubble = document.getElementById("photoBubble");

  if (!wrap || !bubble || !window.matchMedia("(hover: hover)").matches) {
    return;
  }

  const items = [
    {
      position: "pos-a",
      text: "这是上海外滩的夜景，东方明珠塔在我的对面"
    },
    {
      position: "pos-b",
      text: "让我们成为幸福大王ᶻz ₍^_ ̫ _^₎"
    },
    {
      position: "pos-c",
      text: "我相信缓慢 平和 细水长流的力量"
    }
  ];

  let lastIndex = -1;
  let hideTimer = null;

  function pickItem() {
    let next = Math.floor(Math.random() * items.length);
    if (items.length > 1 && next === lastIndex) {
      next = (next + 1) % items.length;
    }
    lastIndex = next;
    return items[next];
  }

  function showBubble() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    const item = pickItem();
    bubble.hidden = false;
    bubble.textContent = item.text;
    bubble.className = `photo-bubble ${item.position}`;

    requestAnimationFrame(() => {
      bubble.classList.add("show");
    });
  }

  function hideBubble() {
    bubble.classList.remove("show");
    hideTimer = window.setTimeout(() => {
      bubble.hidden = true;
    }, 180);
  }

  wrap.addEventListener("mouseenter", showBubble);
  wrap.addEventListener("mouseleave", hideBubble);
})();
