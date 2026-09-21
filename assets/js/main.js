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

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    // On touch/narrow layouts the first tap opens the submenu instead of navigating.
    root.querySelectorAll(".nav-group").forEach(function (group) {
      var link = group.querySelector(".nav-link");
      if (!link) return;
      link.addEventListener("click", function (event) {
        if (window.matchMedia("(max-width: 1023px)").matches && !group.classList.contains("is-open")) {
          event.preventDefault();
          group.classList.add("is-open");
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
    });
  });
})();
