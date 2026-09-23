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

  function initProjectFilter(root) {
    var filterPanel = root.getElementById("prj-filters");
    var grid = root.getElementById("prj-grid");
    var empty = root.getElementById("prj-empty");
    if (!filterPanel || !grid) return;

    var catBoxes = Array.prototype.slice.call(filterPanel.querySelectorAll('input[name="cat"]'));
    var allBox = filterPanel.querySelector('input[name="cat"][value="all"]');
    var citySelect = root.getElementById("f-city");
    var yearSelect = root.getElementById("f-year");
    var submitBtn = filterPanel.querySelector("button");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".prj"));

    function apply() {
      var checked = catBoxes.filter(function (box) {
        return box.checked && box.value !== "all";
      }).map(function (box) { return box.value; });

      var city = citySelect && citySelect.value !== "Tất cả" ? citySelect.value : "";
      var year = yearSelect && yearSelect.value !== "Tất cả" ? yearSelect.value : "";

      var visibleCount = 0;
      cards.forEach(function (card) {
        var matchCat = checked.length === 0 || checked.indexOf(card.getAttribute("data-category")) !== -1;
        var matchCity = !city || card.getAttribute("data-city") === city;
        var matchYear = !year || card.getAttribute("data-year") === year;
        var show = matchCat && matchCity && matchYear;
        card.hidden = !show;
        if (show) visibleCount++;
      });

      if (empty) empty.hidden = visibleCount !== 0;
    }

    catBoxes.forEach(function (box) {
      box.addEventListener("change", function () {
        if (box.value === "all") {
          if (box.checked) {
            catBoxes.forEach(function (other) {
              if (other !== box) other.checked = false;
            });
          }
        } else if (box.checked && allBox) {
          allBox.checked = false;
        }
        var anyChecked = catBoxes.some(function (b) { return b.checked; });
        if (!anyChecked && allBox) allBox.checked = true;
        apply();
      });
    });

    if (citySelect) citySelect.addEventListener("change", apply);
    if (yearSelect) yearSelect.addEventListener("change", apply);
    if (submitBtn) {
      submitBtn.addEventListener("click", function (event) {
        event.preventDefault();
        apply();
      });
    }
  }

  function initContactForm(root) {
    var form = root.querySelector(".form-grid");
    if (!form) return;
    var button = form.querySelector('button[type="submit"]');
    var status = root.getElementById("form-status");

    // Form chưa nối backend/email thật (action="#") — đây chỉ là UX mô phỏng
    // phía client. Cần nối API/email thật (vd Formspree hoặc backend riêng)
    // trước khi release chính thức.
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        if (typeof form.reportValidity === "function") form.reportValidity();
        return;
      }
      if (button) {
        button.disabled = true;
        button.classList.add("is-loading");
      }
      window.setTimeout(function () {
        if (button) {
          button.disabled = false;
          button.classList.remove("is-loading");
        }
        if (status) {
          status.hidden = false;
          status.textContent = "Cảm ơn bạn đã gửi yêu cầu! Đội ngũ Cameramienbac sẽ liên hệ lại trong thời gian sớm nhất.";
        }
        form.reset();
      }, 900);
    });
  }

  function initChatWidget(root) {
    var chatbox = root.getElementById("chatbox");
    var toggle = root.getElementById("chatbtn-toggle");
    var closeBtn = root.getElementById("chatbox-close");
    var messages = root.getElementById("chatbox-messages");
    var form = root.getElementById("chatbox-form");
    var input = root.getElementById("chatbox-input");
    var heroForm = root.getElementById("hero-agent-form");
    var heroField = root.getElementById("hero-agent-field");
    if (!chatbox || !toggle || !messages || !form || !input) return;

    var REPLIES = [
      { match: "tòa nhà", text: "Với tòa nhà văn phòng/chung cư, chúng tôi thường triển khai camera AI nhận diện khuôn mặt kiểm soát ra vào, phát hiện đám đông và cảnh báo hành vi bất thường. Bạn cho mình xin quy mô toà nhà (số tầng/căn hộ) để tư vấn cấu hình phù hợp nhé?" },
      { match: "trường học", text: "Giải pháp trường học AI của chúng tôi hỗ trợ điểm danh tự động bằng khuôn mặt, chống gian lận thi cử và giám sát an ninh khuôn viên. Bạn đang quan tâm ở cấp học nào và quy mô bao nhiêu học sinh?" },
      { match: "nâng cấp", text: "Camera hiện hữu của anh/chị có thể nâng cấp lên AI mà không cần thay mới toàn bộ — chỉ cần đầu ghi hỗ trợ AI hoặc box AI gắn thêm. Bạn cho mình biết đang dùng loại camera/đầu ghi gì để kiểm tra khả năng nâng cấp nhé?" },
      { match: "aiot", text: "AIoT Platform của chúng tôi tích hợp camera, cảm biến IoT và dashboard vận hành tập trung cho Smart City/Smart Building. Bạn muốn triển khai ở quy mô nào (toà nhà đơn lẻ, khu đô thị hay thành phố)?" }
    ];
    var DEFAULT_REPLY = "Cảm ơn câu hỏi của bạn! Đội ngũ kỹ thuật Cameramienbac sẽ liên hệ tư vấn chi tiết sớm nhất. Trong lúc chờ, bạn có thể để lại số điện thoại hoặc xem thêm tại trang Liên hệ.";

    function pickReply(text) {
      var lower = text.toLowerCase();
      for (var i = 0; i < REPLIES.length; i++) {
        if (lower.indexOf(REPLIES[i].match) !== -1) return REPLIES[i].text;
      }
      return DEFAULT_REPLY;
    }

    function scrollToBottom() {
      messages.scrollTop = messages.scrollHeight;
    }

    function appendMessage(text, from) {
      var bubble = document.createElement("div");
      bubble.className = "chatbox__msg chatbox__msg--" + from;
      bubble.textContent = text;
      messages.appendChild(bubble);
      scrollToBottom();
    }

    function sendMessage(text) {
      text = (text || "").trim();
      if (!text) return;
      appendMessage(text, "user");

      var typing = document.createElement("div");
      typing.className = "chatbox__msg chatbox__msg--bot chatbox__msg--typing";
      typing.innerHTML = "<i></i><i></i><i></i>";
      messages.appendChild(typing);
      scrollToBottom();

      window.setTimeout(function () {
        typing.remove();
        appendMessage(pickReply(text), "bot");
      }, 800);
    }

    function openChat(prefillText) {
      chatbox.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      if (prefillText) {
        sendMessage(prefillText);
      } else {
        input.focus();
      }
    }

    function closeChat() {
      chatbox.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      if (chatbox.hidden) {
        openChat();
      } else {
        closeChat();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeChat();
      });
    }

    document.addEventListener("keydown", function (event) {
      if ((event.key === "Escape" || event.key === "Esc") && !chatbox.hidden) {
        closeChat();
      }
    });

    document.addEventListener("click", function (event) {
      if (chatbox.hidden) return;
      if (event.target.closest("#chatbox, #chatbtn-toggle, [data-chat-open], [data-chat-ask], #hero-agent-form")) return;
      closeChat();
    });

    root.querySelectorAll("[data-chat-open]").forEach(function (el) {
      el.addEventListener("click", function (event) {
        event.preventDefault();
        openChat();
      });
    });

    root.querySelectorAll("[data-chat-ask]").forEach(function (el) {
      el.addEventListener("click", function (event) {
        event.preventDefault();
        openChat(el.getAttribute("data-chat-ask"));
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = input.value;
      input.value = "";
      if (chatbox.hidden) chatbox.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      sendMessage(text);
    });

    if (heroForm && heroField) {
      heroForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var text = heroField.value;
        heroField.value = "";
        openChat(text);
      });
    }
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
      initProjectFilter(document);
      initContactForm(document);
      initChatWidget(document);
      var yearEl = document.getElementById("footer-year");
      if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    });
  });
})();
