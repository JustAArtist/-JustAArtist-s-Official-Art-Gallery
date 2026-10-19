
/* ==========================================
   JUSTAARTIST — CRIMSON PAGE TRANSITIONS
   ========================================== */

(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const transitionDuration = 650;
  const storageKey = "jaa-page-transition";

  // Build the transition overlay.
  let overlay = document.getElementById("page-transition");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "page-transition";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
  }

  // Animate the incoming page only after a transition.
  try {
    if (sessionStorage.getItem(storageKey) === "1") {
      sessionStorage.removeItem(storageKey);

      if (!reducedMotion) {
        document.body.classList.add("page-entering");

        window.addEventListener("pageshow", () => {
          window.setTimeout(() => {
            document.body.classList.remove("page-entering");
          }, 900);
        }, { once: true });
      }
    }
  } catch {
    // Transitions still work if session storage is unavailable.
  }

  if (reducedMotion) return;

  // Intercept ordinary links to other pages on this website.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");

    if (!link) return;
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    let destination;

    try {
      destination = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    if (destination.origin !== window.location.origin) return;
    if (!/\.(html?|php)$/i.test(destination.pathname)) return;

    // Don't animate links that only jump to a section on this page.
    if (
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search &&
      destination.hash
    ) {
      return;
    }

    // Ignore a click that points to the exact current URL.
    if (destination.href === window.location.href) return;

    event.preventDefault();

    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // Continue navigation if storage is unavailable.
    }

    overlay.classList.add("active");

    window.setTimeout(() => {
      window.location.href = destination.href;
    }, transitionDuration);
  });
})();
