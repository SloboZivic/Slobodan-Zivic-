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

// the landing splash randomly shows one of two background photos each
// time the page loads — CSS can't do randomness, so this sets it as an
// inline style, which always wins over the (removed) CSS background-image
function setupLandingBackground() {
  const landing = document.getElementById("landing-screen");
  if (!landing) return;

  const images = ["img/un_named.webp", "img/landin.webp"];
  const chosen = images[Math.floor(Math.random() * images.length)];

  landing.style.backgroundImage = `url("${chosen}")`;
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

// click any artwork photo (in a gallery or curatorial entry) to see it
// larger over a dark overlay. Close with the × button, clicking outside
// the image, or pressing Escape.
function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeButton = document.getElementById("lightbox-close");
  if (!lightbox || !lightboxImage || !closeButton) return;

  const clickableImages = document.querySelectorAll(
    ".exhibit-gallery img, .exhibit-side img"
  );

  function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt || "";
    lightbox.classList.add("open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxImage.src = "";
  }

  clickableImages.forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  });

  closeButton.addEventListener("click", closeLightbox);

  // clicking the dark background (not the image itself) also closes it
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

startClock();
setupMarquee();
setupExhibitAccordion();
setupLandingBackground();
setupLandingScreen();
setupLightbox();
