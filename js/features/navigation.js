"use strict";

(() => {
  function initNavigation() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#site-nav");
    const mobileQuery = window.matchMedia("(max-width: 720px)");
    function closeMenu() {
      nav.dataset.open = "false";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.lastElementChild.textContent = "+";
    }
    function syncMenu() {
      menuToggle.hidden = !mobileQuery.matches;
      closeMenu();
    }
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      nav.dataset.open = String(isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.lastElementChild.textContent = isOpen ? "-" : "+";
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuToggle.focus();
      }
    });
    mobileQuery.addEventListener("change", syncMenu);
    syncMenu();
  }

  window.MiniU.initNavigation = initNavigation;
})();
