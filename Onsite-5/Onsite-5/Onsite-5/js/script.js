(function () {
  "use strict";

  function initAOS() {
    if (typeof AOS !== "undefined" && !window.aosInitialized) {
      AOS.init({
        duration: 1200,
        once: false,
        mirror: true,
        easing: "cubic-bezier(0.25, 0.1, 0.15, 1.2)",
      });
      window.aosInitialized = true;
    }
  }

  function initTestimonialSlider() {
    var sliderEl = document.querySelector(".testimonial-slider");
    if (!sliderEl) return;

    function initFallbackTestimonial() {
      var items = sliderEl.querySelectorAll(".item");
      if (!items.length) return;

      var current = 0;
      var prevBtn = document.querySelector("#testimonial-nav .prev");
      var nextBtn = document.querySelector("#testimonial-nav .next");

      function render(index) {
        for (var i = 0; i < items.length; i++) {
          items[i].style.display = i === index ? "block" : "none";
        }
      }

      function move(step) {
        current = (current + step + items.length) % items.length;
        render(current);
      }

      render(current);

      if (prevBtn) {
        prevBtn.addEventListener("click", function (e) {
          e.preventDefault();
          move(-1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function (e) {
          e.preventDefault();
          move(1);
        });
      }

      setInterval(function () {
        move(1);
      }, 4500);
    }

    if (typeof tns === "undefined") {
      console.warn("Tiny Slider library is not loaded. Using fallback slider.");
      initFallbackTestimonial();
      return;
    }

    try {
      tns({
        container: ".testimonial-slider",
        items: 1,
        axis: "horizontal",
        controlsContainer: "#testimonial-nav",
        controls: true,
        nav: true,
        navPosition: "bottom",
        speed: 600,
        swipeAngle: false,
        autoplay: true,
        autoplayTimeout: 4500,
        autoplayHoverPause: true,
        autoplayButtonOutput: false,
        mouseDrag: true,
        loop: true,
      });
    } catch (error) {
      console.error("Failed to initialize testimonial slider:", error);
      initFallbackTestimonial();
    }
  }

  function initQuantityButtons() {
    var containers = document.getElementsByClassName("quantity-container");

    function parseMoney(text) {
      var value = parseFloat(String(text).replace(/[^0-9.]/g, ""));
      return isNaN(value) ? 0 : value;
    }

    function formatMoney(value) {
      return "$" + value.toFixed(2);
    }

    function recalculateCartTotals() {
      var cartRows = document.querySelectorAll(".site-blocks-table tbody tr");
      if (!cartRows.length) return;

      var subtotal = 0;

      cartRows.forEach(function (row) {
        var unitPriceEl = row.querySelector(".unit-price");
        var qtyInput = row.querySelector(".quantity-amount");
        var lineTotalEl = row.querySelector(".line-total");
        if (!unitPriceEl || !qtyInput || !lineTotalEl) return;

        var unitPrice = parseMoney(unitPriceEl.textContent);
        var qty = parseInt(qtyInput.value, 10);
        qty = isNaN(qty) || qty < 0 ? 0 : qty;
        qtyInput.value = qty;

        var lineTotal = unitPrice * qty;
        lineTotalEl.textContent = formatMoney(lineTotal);
        subtotal += lineTotal;
      });

      var subtotalEl = document.getElementById("cart-subtotal");
      var totalEl = document.getElementById("cart-total");
      if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
      if (totalEl) totalEl.textContent = formatMoney(subtotal);
    }

    function animateInput(input) {
      input.style.transform = "scale(1.08)";
      input.style.transition = "transform 0.2s";
      setTimeout(function () {
        input.style.transform = "";
      }, 200);
    }

    function increaseValue(input) {
      var value = parseInt(input.value, 10);
      value = isNaN(value) ? 0 : value;
      input.value = value + 1;
      animateInput(input);
      recalculateCartTotals();
    }

    function decreaseValue(input) {
      var value = parseInt(input.value, 10);
      value = isNaN(value) ? 0 : value;
      input.value = value > 0 ? value - 1 : 0;
      animateInput(input);
      recalculateCartTotals();
    }

    for (var i = 0; i < containers.length; i++) {
      var input = containers[i].getElementsByClassName("quantity-amount")[0];
      var plus = containers[i].getElementsByClassName("increase")[0];
      var minus = containers[i].getElementsByClassName("decrease")[0];

      if (!input || !plus || !minus) continue;

      input.addEventListener("input", function () {
        recalculateCartTotals();
      });

      plus.addEventListener("click", function (e) {
        e.preventDefault();
        var wrap = this.closest(".quantity-container");
        if (!wrap) return;
        var targetInput = wrap.querySelector(".quantity-amount");
        if (!targetInput) return;
        increaseValue(targetInput);
      });

      minus.addEventListener("click", function (e) {
        e.preventDefault();
        var wrap = this.closest(".quantity-container");
        if (!wrap) return;
        var targetInput = wrap.querySelector(".quantity-amount");
        if (!targetInput) return;
        decreaseValue(targetInput);
      });
    }

    recalculateCartTotals();
  }

  function initOurTeamAnimations() {
    var cards = document.querySelectorAll(".our-team-section .team-member-card");
    if (!cards.length) return;

    cards.forEach(function (card, index) {
      card.style.transitionDelay = Math.min(index, 7) * 90 + "ms";
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries, observerRef) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observerRef.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -20px 0px" }
      );

      cards.forEach(function (card) {
        observer.observe(card);
      });
    } else {
      cards.forEach(function (card) {
        card.classList.add("is-visible");
      });
    }
  }

  function init() {
    initAOS();
    initTestimonialSlider();
    initQuantityButtons();
    initOurTeamAnimations();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
