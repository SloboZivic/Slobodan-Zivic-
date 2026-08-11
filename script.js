// updates the "12:03:50" clock in the header, in Stockholm time
function startClock() {
  const clockEl = document.getElementById("clock-time");
  if (!clockEl) return;

  function tick() {
    const now = new Date();
    const stockholmTime = now.toLocaleTimeString("sv-SE", {
      timeZone: "Europe/Stockholm",
      hour12: false,
    });
    clockEl.textContent = stockholmTime;
  }

  tick();
  setInterval(tick, 1000);
}

// the marquee only needs ONE link written in the HTML — this fills the
// track with just enough copies to overflow the screen, then duplicates
// that whole block once more, so the CSS animation (which slides exactly
// -50%) always loops with no gap, no matter how wide the screen is
function setupMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;

  const original = track.innerHTML;
  const screenWidth = window.innerWidth;

  while (track.scrollWidth < screenWidth) {
    track.innerHTML += original;
  }

  track.innerHTML += track.innerHTML;
}

// exhibition table: clicking a row opens its detail row (gallery + caption)
// right underneath it. Clicking that same row again closes it, and clicking
// a different row closes whichever one was open and opens the new one —
// only one entry is ever expanded at a time.
function setupExhibitAccordion() {
  const rows = document.querySelectorAll(".exhibit-row");
  let openDetail = null;
  let openRow = null;

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const detail = document.getElementById(row.dataset.target);
      if (!detail) return;

      const wasOpen = detail.classList.contains("open");

      if (openDetail && openDetail !== detail) {
        openDetail.classList.remove("open");
        openRow.classList.remove("active");
      }

      detail.classList.toggle("open", !wasOpen);
      row.classList.toggle("active", !wasOpen);

      openDetail = wasOpen ? null : detail;
      openRow = wasOpen ? null : row;

      // when opening (not closing), scroll so the clicked row settles
      // near the center of the screen — otherwise the page stays at
      // whatever scroll position the PREVIOUS open row left it at,
      // which can leave the newly opened content half off-screen if
      // it's shorter than what was open before
      if (!wasOpen) {
        row.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// the landing splash sits on top of the page as a fixed overlay — clicking
// ENTER fades it out (via CSS transition) and lets scroll/clicks reach the
// page underneath, instead of navigating to a separate file
function setupLandingScreen() {
  const landing = document.getElementById("landing-screen");
  const enterLink = document.getElementById("enter-link");
  if (!landing || !enterLink) return;

  enterLink.addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.setItem("slobodanEntered", "true");
    landing.classList.add("landing--hidden");
    document.body.classList.remove("landing-visible");
  });
}

startClock();
setupMarquee();
setupExhibitAccordion();
setupLandingScreen();
