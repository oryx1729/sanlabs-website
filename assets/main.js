(function () {
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function activate(el) {
    el.classList.add("in");
  }

  if (reducedMotion) {
    revealEls.forEach(activate);
  } else {
    requestAnimationFrame(function () {
      revealEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < (window.innerHeight || 0) + 100) activate(el);
      });
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

      revealEls.forEach(function (el) {
        if (!el.classList.contains("in")) observer.observe(el);
      });
    }

    setTimeout(function () {
      revealEls.forEach(activate);
    }, 1200);
  }

  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[data-nav]"));
  var sections = links.map(function (link) {
    return { link: link, el: document.getElementById(link.getAttribute("data-nav")) };
  }).filter(function (item) {
    return item.el;
  });

  function updateCurrentSection() {
    var probe = window.scrollY + 120;
    var current = null;

    sections.forEach(function (section) {
      if (section.el.offsetTop <= probe) current = section;
    });

    if (window.scrollY < 80) current = null;

    links.forEach(function (link) {
      link.removeAttribute("aria-current");
    });

    if (current) current.link.setAttribute("aria-current", "true");
  }

  if (links.length) {
    var ticking = false;
    var scheduleUpdate = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateCurrentSection();
        ticking = false;
      });
    };

    updateCurrentSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
  }
})();

