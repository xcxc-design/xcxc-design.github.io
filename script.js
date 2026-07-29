const menuButton = document.getElementById("menuButton");
const siteNav = document.getElementById("siteNav");

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    siteNav.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  siteNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

const yearNode = document.getElementById("currentYear");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
