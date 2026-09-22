/* Cameramienbac — shared behaviour
   - loads the header/footer partials into their placeholders
   - wires up the mobile navigation
   Run the site through a local web server (e.g. `python3 -m http.server`)
   so that fetch() can read the partials. */

(function () {
  "use strict";

  function initNav(root) {
    var toggle = root.querySelector(".nav-toggle");
    var nav = root.querySelector(".main-nav");
    var header = root.querySelector(".site-header");

    function closeMenu() {
      if (!nav || !nav.classList.contains("is-open")) return;
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-locked");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      if (!nav) return;
      nav.classList.add("is-open");
      document.body.classList.add("nav-locked");
      if (toggle) toggle.setAttribute("aria-expanded", "true");
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" || event.key === "Esc") {
        closeMenu();
        root.querySelectorAll(".nav-group.is-open").forEach(function (group) {
          group.classList.remove("is-open");
        });
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav || !nav.classList.contains("is-open")) return;
      if (header && header.contains(event.target)) return;
      closeMenu();
    });

    // On touch/narrow layouts the first tap opens the submenu instead of navigating.
    root.querySelectorAll(".nav-group").forEach(function (group) {
      var link = group.querySelector(".nav-link");
      if (!link) return;
      link.addEventListener("click", function (event) {
        if (window.matchMedia("(max-width: 1023px)").matches && !group.classList.contains("is-open")) {
          event.preventDefault();
          group.classList.add("is-open");
          group.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function markCurrent(root) {
    var raw = location.pathname.split("/").pop() || "index.html";
    // Hỗ trợ cả URL sạch (/lien-he) và URL có .html (/lien-he.html) do cleanUrls
    var here = raw.split("?")[0].split("#")[0].replace(/\.html$/, "") || "index";
    if (here === "index") here = "index";
    root.querySelectorAll(".main-nav a").forEach(function (link) {
      var target = link.getAttribute("href");
      if (!target || target.charAt(0) === "#") return;
      var norm = target.split("/").pop().split("?")[0].split("#")[0].replace(/\.html$/, "") || "index";
      link.classList.toggle("is-active", norm === here && link.classList.contains("nav-link"));
    });
  }

  function include(el) {
    var url = el.getAttribute("data-include");
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error(url + " → " + res.status);
        return res.text();
      })
      .then(function (html) {
        el.outerHTML = html;
      })
      .catch(function (err) {
        console.error("[partials] " + err.message +
          " — serve the site over http:// so the partials can be fetched.");
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var slots = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));
    Promise.all(slots.map(include)).then(function () {
      initNav(document);
      markCurrent(document);
      var yearEl = document.getElementById("footer-year");
      if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    });
  });
})();
