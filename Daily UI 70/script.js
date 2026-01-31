const filterBar = document.getElementById("filterBar");
const timeline = document.getElementById("timeline");
const skeletons = document.getElementById("skeletons");
const searchInput = document.getElementById("searchInput");
const eventCount = document.getElementById("eventCount");
const filterCount = document.getElementById("filterCount");
const distanceStatus = document.getElementById("distanceStatus");
const resetFilters = document.getElementById("resetFilters");
const syncCalendar = document.getElementById("syncCalendar");
const sentinel = document.getElementById("sentinel");
const template = document.getElementById("eventCardTemplate");

const categories = [
  "Concerts",
  "Tech",
  "Art",
  "Workshops",
  "Wellness",
  "Food",
  "Sports",
  "Theater",
];

const baseEvents = [
  { title: "Midnight Pulse", venue: "Nova Hall", city: "Berlin" },
  { title: "Aurora Summit", venue: "Cloud Forge", city: "Reykjavik" },
  { title: "Circuit Dreams", venue: "Pulse Arena", city: "Tokyo" },
  { title: "Analog Waves", venue: "Foundry Loft", city: "Chicago" },
  { title: "Orbit Exchange", venue: "Vector Lab", city: "Toronto" },
  { title: "Prism Gallery", venue: "Oculus Museum", city: "London" },
  { title: "Crescent Atelier", venue: "Studio 17", city: "Paris" },
  { title: "Meta Forge", venue: "Lumina Hub", city: "Singapore" },
];

const state = {
  filters: new Set(),
  query: "",
  page: 1,
  pageSize: 20,
  events: [],
  userPosition: null,
};

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

const updateCountdown = (eventStartTime, element) => {
  const now = new Date().getTime();
  const distance = new Date(eventStartTime).getTime() - now;

  if (distance < 0) {
    element.innerText = "Event Started";
    element.classList.remove("pulse-urgency");
    return;
  }

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  element.innerText = `${hours}h ${minutes}m left`;

  if (hours === 0 && minutes < 60) {
    element.classList.add("pulse-urgency");
  } else {
    element.classList.remove("pulse-urgency");
  }
};

const getImageUrl = (category, index) =>
  `https://source.unsplash.com/featured/900x700?${encodeURIComponent(
    category
  )},event,night&sig=${index}`;

const createEvents = () => {
  const events = [];
  for (let i = 0; i < 80; i += 1) {
    const base = baseEvents[i % baseEvents.length];
    const category = categories[i % categories.length];
    const start = new Date();
    start.setHours(start.getHours() + (i % 12) + 1);
    start.setDate(start.getDate() + Math.floor(i / 12));
    start.setMinutes((i * 7) % 60);
    const end = new Date(start.getTime() + 1000 * 60 * (90 + (i % 90)));
    const latitude = 40 + (i % 10) * 1.8;
    const longitude = -73 + (i % 12) * 1.4;
    events.push({
      id: `event-${i}`,
      title: `${base.title} ${i + 1}`,
      venue: base.venue,
      city: base.city,
      category,
      price: 35 + (i % 6) * 15,
      remaining: 18 + (i % 40),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      coords: { latitude, longitude },
      coupon: `HZN-${(i + 19) * 7}`,
      image: getImageUrl(category, i),
    });
  }
  return events;
};

const groupByDay = (events) =>
  events.reduce((groups, event) => {
    const key = dayFormatter.format(new Date(event.startTime));
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(event);
    return groups;
  }, {});

const applyFilters = () => {
  const filtered = state.events.filter((event) => {
    const matchesCategory =
      state.filters.size === 0 || state.filters.has(event.category);
    const query = state.query.trim().toLowerCase();
    const matchesQuery =
      query.length === 0 ||
      event.title.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
  return filtered;
};

const updateURLState = () => {
  const params = new URLSearchParams();
  if (state.filters.size) {
    params.set("filters", Array.from(state.filters).join(","));
  }
  if (state.query.trim()) {
    params.set("q", state.query.trim());
  }
  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState({}, "", url);
};

const restoreURLState = () => {
  const params = new URLSearchParams(window.location.search);
  const filters = params.get("filters");
  if (filters) {
    filters.split(",").forEach((filter) => state.filters.add(filter));
  }
  const query = params.get("q");
  if (query) {
    state.query = query;
    searchInput.value = query;
  }
};

const capturePositions = () => {
  const map = new Map();
  document.querySelectorAll(".event-card[data-id]").forEach((card) => {
    map.set(card.dataset.id, card.getBoundingClientRect());
  });
  return map;
};

const applyFlip = (prevPositions) => {
  document.querySelectorAll(".event-card[data-id]").forEach((card) => {
    const prev = prevPositions.get(card.dataset.id);
    if (!prev) return;
    const next = card.getBoundingClientRect();
    const deltaX = prev.left - next.left;
    const deltaY = prev.top - next.top;
    if (deltaX || deltaY) {
      card.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: "translate(0, 0)" },
        ],
        { duration: 320, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
      );
    }
  });
};

const renderFilters = () => {
  filterBar.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-chip";
    button.textContent = category;
    button.dataset.category = category;
    if (state.filters.has(category)) {
      button.classList.add("is-active");
    }
    button.addEventListener("click", () => {
      const prevPositions = capturePositions();
      if (state.filters.has(category)) {
        state.filters.delete(category);
      } else {
        state.filters.add(category);
      }
      button.classList.toggle("is-active", state.filters.has(category));
      state.page = 1;
      updateURLState();
      render();
      applyFlip(prevPositions);
    });
    filterBar.appendChild(button);
  });
};

const createCard = (event) => {
  const card = template.content.firstElementChild.cloneNode(true);
  card.dataset.id = event.id;
  card.style.setProperty("--bg", `url('${event.image}')`);
  card.querySelector(".category").textContent = event.category;
  card.querySelector(".event-title").textContent = event.title;
  card.querySelector(".event-meta").textContent = `${event.venue} · ${
    event.city
  } · ${timeFormatter.format(new Date(event.startTime))}`;
  card.querySelector(".price").textContent = `$${event.price}`;
  card.querySelector(".tickets").textContent = `${event.remaining} tickets left`;
  card.querySelector(".coupon-code").textContent = event.coupon;

  const countdown = card.querySelector(".countdown");
  updateCountdown(event.startTime, countdown);

  const distanceBadge = card.querySelector(".distance");
  distanceBadge.textContent = "Calculating";
  if (state.userPosition) {
    const distance = calculateDistanceKm(
      state.userPosition.latitude,
      state.userPosition.longitude,
      event.coords.latitude,
      event.coords.longitude
    );
    distanceBadge.textContent = `${distance.toFixed(1)}km away`;
  } else {
    distanceBadge.textContent = "Enable location";
  }

  card.querySelector(".expand").addEventListener("click", () => {
    card.classList.toggle("is-open");
  });

  card.querySelector(".bookmark").addEventListener("click", (eventButton) => {
    eventButton.currentTarget.classList.toggle("is-active");
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  });

  card.querySelector(".calendar").addEventListener("click", () => {
    const icsFile = buildICS(event);
    downloadFile(icsFile, `${event.title}.ics`);
  });

  card.querySelector(".copy-coupon").addEventListener("click", async (eventBtn) => {
    const text = event.coupon;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    eventBtn.currentTarget.textContent = "Copied!";
    setTimeout(() => {
      eventBtn.currentTarget.textContent = "Click to Copy";
    }, 1400);
  });

  return card;
};

const render = () => {
  const filtered = applyFilters();
  eventCount.textContent = filtered.length;
  filterCount.textContent = state.filters.size
    ? `${state.filters.size} selected`
    : "All";
  const visible = filtered.slice(0, state.page * state.pageSize);
  const groups = groupByDay(visible);
  timeline.innerHTML = "";

  Object.entries(groups).forEach(([day, events]) => {
    const section = document.createElement("section");
    section.className = "timeline-day";
    const header = document.createElement("div");
    header.className = "day-header";
    header.textContent = day;
    const grid = document.createElement("div");
    grid.className = "events-grid";
    events.forEach((event) => grid.appendChild(createCard(event)));
    section.appendChild(header);
    section.appendChild(grid);
    timeline.appendChild(section);
  });

  applyMasonryLayout();
  startCountdowns();
  observeCards();
};

const applyMasonryLayout = () => {
  document.querySelectorAll(".events-grid").forEach((grid) => {
    const rowGap = parseInt(getComputedStyle(grid).rowGap, 10);
    const rowHeight = parseInt(getComputedStyle(grid).gridAutoRows, 10);
    grid.querySelectorAll(".event-card").forEach((card) => {
      card.style.gridRowEnd = "auto";
      const height = card.getBoundingClientRect().height;
      const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
      card.style.gridRowEnd = `span ${span}`;
    });
  });
};

let countdownTimer = null;
const startCountdowns = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
  const countdowns = Array.from(document.querySelectorAll(".countdown"));
  const updateAll = () =>
    countdowns.forEach((element) => {
      const card = element.closest(".event-card");
      const eventId = card.dataset.id;
      const event = state.events.find((item) => item.id === eventId);
      if (event) {
        updateCountdown(event.startTime, element);
      }
    });
  updateAll();
  countdownTimer = setInterval(updateAll, 60000);
};

const buildICS = (event) => {
  const start = new Date(event.startTime)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const end = new Date(event.endTime)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Horizon Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@horizonevents`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.venue}, ${event.city}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
};

const downloadFile = (content, filename) => {
  const blob = new Blob([content], { type: "text/calendar" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

let cardObserver = null;
const observeCards = () => {
  const cards = document.querySelectorAll(".event-card");
  if (cardObserver) {
    cardObserver.disconnect();
  }
  cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-recycled", !entry.isIntersecting);
      });
    },
    { rootMargin: "300px 0px", threshold: 0.1 }
  );
  cards.forEach((card) => cardObserver.observe(card));
};

const observeSentinel = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const filtered = applyFilters();
        const maxPages = Math.ceil(filtered.length / state.pageSize);
        if (state.page < maxPages) {
          state.page += 1;
          render();
        }
      }
    });
  });
  observer.observe(sentinel);
};

const locateUser = () => {
  if (!navigator.geolocation) {
    distanceStatus.textContent = "Location unavailable";
    return;
  }
  navigator.geolocation.watchPosition(
    (pos) => {
      state.userPosition = pos.coords;
      distanceStatus.textContent = `${pos.coords.latitude.toFixed(
        2
      )}, ${pos.coords.longitude.toFixed(2)}`;
      render();
    },
    () => {
      distanceStatus.textContent = "Location denied";
    },
    { enableHighAccuracy: true }
  );
};

const init = () => {
  state.events = createEvents();
  restoreURLState();
  renderFilters();
  setTimeout(() => {
    skeletons.style.display = "none";
    render();
  }, 800);
  locateUser();
  observeSentinel();
};

searchInput.addEventListener("input", (event) => {
  const prevPositions = capturePositions();
  state.query = event.target.value;
  state.page = 1;
  updateURLState();
  render();
  applyFlip(prevPositions);
});

resetFilters.addEventListener("click", () => {
  state.filters.clear();
  state.query = "";
  searchInput.value = "";
  state.page = 1;
  updateURLState();
  renderFilters();
  render();
});

syncCalendar.addEventListener("click", () => {
  const filtered = applyFilters();
  if (filtered.length === 0) return;
  const nextEvent = filtered[0];
  const icsFile = buildICS(nextEvent);
  downloadFile(icsFile, `${nextEvent.title}.ics`);
});

window.addEventListener("resize", applyMasonryLayout);

init();
