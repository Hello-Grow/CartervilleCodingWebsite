(function () {
  const resourceLinks = document.querySelector(".resource-links");
  const resourceCards = document.querySelectorAll(".resource-link-card");

  if (resourceLinks && resourceCards.length) {
    const search = document.createElement("label");
    search.className = "resource-search";
    search.innerHTML = '<span>Search resources</span><input type="search" placeholder="Search links..." autocomplete="off" />';
    resourceLinks.prepend(search);
    const input = search.querySelector("input");

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      resourceCards.forEach((card) => {
        card.hidden = query.length > 0 && !card.textContent.toLowerCase().includes(query);
      });
    });
  }

  document.querySelectorAll(".subpage-footer-layout > div:first-child").forEach((intro) => {
    if (intro.querySelector(".footer-social-links")) return;
    const socials = document.createElement("div");
    socials.className = "footer-social-links";
    socials.setAttribute("aria-label", "Social links");
    socials.innerHTML = '<a href="https://www.instagram.com/carterville_coding?igsi=bXc5dHk1bXNzMXQ0&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram"><span aria-hidden="true">◎</span></a><a href="https://discord.gg/URH8xkVuzP" target="_blank" rel="noreferrer" aria-label="Discord"><span class="discord-mark" aria-hidden="true"></span></a><a href="https://github.com/Hello-Grow/CartervilleCodingClub" target="_blank" rel="noreferrer" aria-label="GitHub"><span aria-hidden="true">◉</span></a>';
    intro.append(socials);
  });

  document.querySelectorAll(".footer-layout, .subpage-footer-layout").forEach((layout) => {
    const columns = layout.querySelectorAll(":scope > nav, :scope > .footer-column");
    if (columns.length < 2) return;
    columns[0].innerHTML = '<h2>Club</h2><a href="index.html">Home</a><a href="about.html">About</a><a href="projects.html">Projects</a><a href="resources.html">Resources</a>';
    columns[1].innerHTML = '<h2>Get involved</h2><a href="index.html#join-us">Join us</a><a href="https://hcb.hackclub.com/donations/start/carterville-coding-club" target="_blank" rel="noreferrer">Donate</a><a href="index.html#leaders">Meet the leaders</a>';
  });

  const stage = document.getElementById("figmaStage");
  const viewport = document.getElementById("scaleViewport");

  function fitStage() {
    if (!stage || !viewport) return;
    if (window.matchMedia("(max-width: 900px)").matches) {
      viewport.style.setProperty("--stage-scale", "1");
      viewport.style.setProperty("--stage-bleed", "0px");
      viewport.style.height = "auto";
      return;
    }
    const viewportWidth = document.documentElement.clientWidth;
    const fitScale = viewportWidth / 1440;
    const scale = fitScale <= 1 ? fitScale : Math.min(1 + (fitScale - 1) * 0.28, 1.12);
    const bleed = Math.max(0, (viewportWidth / scale - 1440) / 2);
    viewport.style.setProperty("--stage-scale", scale);
    viewport.style.setProperty("--stage-bleed", `${bleed}px`);
    viewport.style.height = `${stage.offsetHeight * scale}px`;
  }

  window.addEventListener("resize", fitStage);
  window.addEventListener("load", fitStage);
  fitStage();

  let circuitFlowFrame;

  function updateHeroCircuitFlow() {
    if (!viewport) return;
    circuitFlowFrame = undefined;
    const revealDistance = Math.max(window.innerHeight * 1.05, 1);
    const progress = Math.min(Math.max(window.scrollY / revealDistance, 0), 1);
    const maskY = 760 - progress * 930;
    viewport.style.setProperty("--hero-circuit-mask-y", `${maskY.toFixed(1)}px`);
  }

  function requestHeroCircuitFlowUpdate() {
    if (!circuitFlowFrame) {
      circuitFlowFrame = window.requestAnimationFrame(updateHeroCircuitFlow);
    }
  }

  window.addEventListener("scroll", requestHeroCircuitFlowUpdate, { passive: true });
  window.addEventListener("resize", requestHeroCircuitFlowUpdate);
  updateHeroCircuitFlow();

  document.querySelectorAll(".site-nav").forEach((nav) => {
    const links = nav.querySelector(".nav-right");
    if (!links) return;

    const button = document.createElement("button");
    button.className = "nav-toggle";
    button.type = "button";
    button.setAttribute("aria-label", "Open navigation menu");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<span></span><span></span><span></span>';
    nav.append(button);

    const closeMenu = () => {
      nav.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
    };

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("menu-open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    links.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 900px)").matches) closeMenu();
    });
  });

  const calendarTitle = document.getElementById("calendar-title");
  const calendarGrid = document.querySelector(".calendar-grid");
  const calendarNext = document.getElementById("calendar-next");
  const calendarButtons = document.querySelectorAll("[data-calendar-action]");

  if (calendarTitle && calendarGrid && calendarNext && calendarButtons.length) {
    const today = new Date();
    let displayedMonth = new Date(2026, 7, 1);
    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
    const dateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

    function isSameDay(first, second) {
      return first.getFullYear() === second.getFullYear()
        && first.getMonth() === second.getMonth()
        && first.getDate() === second.getDate();
    }

    function renderCalendar() {
      const year = displayedMonth.getFullYear();
      const month = displayedMonth.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const cells = [];

      calendarTitle.textContent = monthFormatter.format(displayedMonth);

      for (let index = 0; index < firstDay; index += 1) {
        cells.push("<span aria-hidden=\"true\"></span>");
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        const isMeeting = date.getDay() === 5;
        const classes = [isMeeting ? "has-event" : "", isSameDay(date, today) ? "is-today" : ""].filter(Boolean).join(" ");
        const detail = isMeeting ? ", weekly meeting from 3 to 4 PM" : "";
        const datetime = date.toISOString().slice(0, 10);
        cells.push(`<time class="${classes}" datetime="${datetime}" aria-label="${dateFormatter.format(date)}${detail}">${day}</time>`);
      }

      while (cells.length < 42) {
        cells.push("<span aria-hidden=\"true\"></span>");
      }

      calendarGrid.innerHTML = cells.join("");
    }

    calendarButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.dataset.calendarAction === "next" ? 1 : -1;
        displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + direction, 1);
        renderCalendar();
      });
    });

    renderCalendar();
  }

  document.querySelectorAll("[data-classroom-code]").forEach((button) => {
    const originalLabel = button.querySelector("small").textContent;

    button.addEventListener("click", async () => {
      button.querySelector("small").textContent = "Copied!";

      try {
        await navigator.clipboard.writeText(button.dataset.classroomCode);
      } catch (error) {
        button.querySelector("small").textContent = "Copy code: " + button.dataset.classroomCode;
      }

      window.setTimeout(() => {
        button.querySelector("small").textContent = originalLabel;
      }, 1600);
    });
  });

})();
