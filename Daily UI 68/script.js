const cityData = {
  Manila: { code: "MNL", timeZone: "Asia/Manila" },
  Tokyo: { code: "NRT", timeZone: "Asia/Tokyo" },
  "San Francisco": { code: "SFO", timeZone: "America/Los_Angeles" },
  Dubai: { code: "DXB", timeZone: "Asia/Dubai" },
  London: { code: "LHR", timeZone: "Europe/London" },
  Sydney: { code: "SYD", timeZone: "Australia/Sydney" },
  Seoul: { code: "ICN", timeZone: "Asia/Seoul" },
};

const airlines = ["AeroNova", "SkyUnion", "CloudNine", "VelocityJet"];

const state = {
  origin: "Manila",
  destination: "Tokyo",
  date: "",
  roundtrip: true,
  minFare: 120,
  maxFare: 1320,
  maxStops: 1,
  airlineFilter: new Set(airlines),
  results: [],
  filtered: [],
  controller: null,
  loading: false,
  totalFare: 0,
};

const queryInput = document.getElementById("queryInput");
const runSearchBtn = document.getElementById("runSearch");
const structuredOutput = document.getElementById("structuredOutput");
const matrixGrid = document.getElementById("matrixGrid");
const resultsMeta = document.getElementById("resultsMeta");
const resultsList = document.getElementById("resultsList");
const virtualItems = document.getElementById("virtualItems");
const virtualSpacer = document.getElementById("virtualSpacer");
const minFareRange = document.getElementById("minFare");
const maxFareRange = document.getElementById("maxFare");
const minFareLabel = document.getElementById("minFareLabel");
const maxFareLabel = document.getElementById("maxFareLabel");
const stopsRange = document.getElementById("stopsRange");
const stopsLabel = document.getElementById("stopsLabel");
const requestState = document.getElementById("requestState");
const resetFilters = document.getElementById("resetFilters");
const shareLink = document.getElementById("shareLink");
const totalFare = document.getElementById("totalFare");
const cardTemplate = document.getElementById("cardTemplate");
const skeletonTemplate = document.getElementById("skeletonTemplate");

const normalizeFares = (fares) => {
  const minFare = Math.min(...fares);
  const maxFare = Math.max(...fares);
  const range = Math.max(maxFare - minFare, 1);

  return fares.map((fare) => ({
    price: fare,
    heightPercent: ((fare - minFare) / range) * 80 + 20,
  }));
};

const getTimeZoneOffset = (date, timeZone) => {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const utc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );
  return utc - date.getTime();
};

const zonedTimeToUtc = (dateStr, timeStr, timeZone) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offset = getTimeZoneOffset(utcDate, timeZone);
  return new Date(utcDate.getTime() - offset);
};

const formatTime = (dateStr, timeStr, timeZone) => {
  const dt = zonedTimeToUtc(dateStr, timeStr, timeZone);
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(dt);
};

const calcDuration = (departDate, departTime, departZone, arriveDate, arriveTime, arriveZone) => {
  const departUtc = zonedTimeToUtc(departDate, departTime, departZone);
  const arriveUtc = zonedTimeToUtc(arriveDate, arriveTime, arriveZone);
  const diffMinutes = Math.max(Math.round((arriveUtc - departUtc) / 60000), 0);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
};

const buildTimeline = (flight) => {
  const stops = flight.stops;
  const layoverLabel = stops > 0 ? `${flight.layover} · ${flight.layoverTime}` : "";
  const layoverX = 50;
  return `
    <svg viewBox="0 0 100 24" role="presentation">
      <defs>
        <linearGradient id="pathGrad" x1="0" x2="1">
          <stop offset="0%" stop-color="#3f6fff"/>
          <stop offset="100%" stop-color="#ff7a59"/>
        </linearGradient>
      </defs>
      <line x1="6" y1="12" x2="94" y2="12" stroke="url(#pathGrad)" stroke-width="2" stroke-dasharray="4 4" />
      <circle cx="6" cy="12" r="4" fill="#3f6fff" />
      <circle cx="94" cy="12" r="4" fill="#ff7a59" />
      ${stops > 0 ? `<circle class="layover-dot" cx="${layoverX}" cy="12" r="4" />` : ""}
      ${stops > 0 ? `<text class="layover-label" x="${layoverX + 6}" y="6">${layoverLabel}</text>` : ""}
    </svg>
  `;
};

const createMatrix = () => {
  const base = 320;
  const fares = Array.from({ length: 7 }, () => base + Math.round(Math.random() * 600));
  const normalized = normalizeFares(fares);
  const today = new Date();
  const dayFormat = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

  matrixGrid.innerHTML = "";
  normalized.forEach((fare, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const cell = document.createElement("div");
    cell.className = "matrix-cell";
    cell.innerHTML = `
      <div>
        <h5>${dayFormat.format(date)}</h5>
        <span>${dateFormat.format(date)}</span>
      </div>
      <strong>$ ${fare.price}</strong>
      <div class="matrix-bar"><span style="height:${fare.heightPercent}%"></span></div>
    `;
    matrixGrid.appendChild(cell);
  });
};

const parseQuery = (text) => {
  const lower = text.toLowerCase();
  const cityNames = Object.keys(cityData);
  let origin = state.origin;
  let destination = state.destination;

  cityNames.forEach((city) => {
    if (lower.includes(`from ${city.toLowerCase()}`)) {
      origin = city;
    }
  });

  const toMatch = lower.match(/to ([a-z\s]+)/);
  if (toMatch) {
    const matchCity = cityNames.find((city) =>
      toMatch[1].includes(city.toLowerCase())
    );
    if (matchCity) destination = matchCity;
  } else {
    const pathMatch = lower.match(/([a-z\s]+) to ([a-z\s]+)/);
    if (pathMatch) {
      const originMatch = cityNames.find((city) =>
        pathMatch[1].includes(city.toLowerCase())
      );
      const destMatch = cityNames.find((city) =>
        pathMatch[2].includes(city.toLowerCase())
      );
      if (originMatch) origin = originMatch;
      if (destMatch) destination = destMatch;
    }
  }

  const nextDay = getNextWeekday(lower);
  if (nextDay) {
    state.date = nextDay;
  }

  state.origin = origin;
  state.destination = destination;
  updatePills();
  updateStructuredOutput();
  syncUrl();
};

const getNextWeekday = (text) => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const match = days.find((day) => text.includes(day));
  if (!match) return "";
  const today = new Date();
  const target = days.indexOf(match);
  const diff = (target + 7 - today.getDay()) % 7 || 7;
  const date = new Date(today);
  date.setDate(today.getDate() + diff);
  return date.toISOString().slice(0, 10);
};

const updatePills = () => {
  document.querySelector('[data-field="origin"] span').textContent = state.origin;
  document.querySelector('[data-field="destination"] span').textContent = state.destination;
  document.querySelector('[data-field="date"] span').textContent = state.date
    ? new Date(state.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Flexible";
  document.querySelector('[data-field="roundtrip"] span').textContent = state.roundtrip
    ? "Round-trip"
    : "One-way";
};

const updateStructuredOutput = () => {
  structuredOutput.textContent = JSON.stringify(
    {
      origin: state.origin,
      destination: state.destination,
      date: state.date || "flexible",
      trip: state.roundtrip ? "roundtrip" : "one-way",
    },
    null,
    2
  );
};

const generateFlights = (count) => {
  const originData = cityData[state.origin];
  const destData = cityData[state.destination];
  const baseDate = state.date || new Date().toISOString().slice(0, 10);
  return Array.from({ length: count }, (_, index) => {
    const departHour = 6 + (index % 12);
    const departTime = `${String(departHour).padStart(2, "0")}:${index % 2 ? "40" : "15"}`;
    const durationHours = 4 + (index % 7);
    const arriveHour = (departHour + durationHours) % 24;
    const arriveTime = `${String(arriveHour).padStart(2, "0")}:${index % 2 ? "10" : "45"}`;
    const arriveDate = baseDate;
    return {
      id: `FL-${index + 1000}`,
      airline: airlines[index % airlines.length],
      origin: state.origin,
      destination: state.destination,
      originCode: originData.code,
      destinationCode: destData.code,
      originZone: originData.timeZone,
      destinationZone: destData.timeZone,
      departDate: baseDate,
      departTime,
      arriveDate,
      arriveTime,
      stops: index % 3,
      layover: index % 3 ? ["ICN", "DXB", "HKG"][index % 3] : "",
      layoverTime: `${1 + (index % 3)}h ${15 + (index % 3) * 10}m`,
      price: 240 + (index % 12) * 38 + Math.round(Math.random() * 180),
    };
  });
};

const applyFilters = () => {
  state.filtered = state.results.filter((flight) => {
    if (flight.price < state.minFare || flight.price > state.maxFare) return false;
    if (flight.stops > state.maxStops) return false;
    if (!state.airlineFilter.has(flight.airline)) return false;
    return true;
  });
};

const renderSkeletons = () => {
  resultsList.classList.add("results-updating");
  virtualItems.innerHTML = "";
  virtualSpacer.style.height = "0px";
  for (let i = 0; i < 6; i += 1) {
    const node = skeletonTemplate.content.cloneNode(true);
    virtualItems.appendChild(node);
  }
};

const renderResultsMeta = () => {
  resultsMeta.textContent = `${state.filtered.length} flights · ${state.origin} to ${state.destination}`;
};

const renderVirtualList = () => {
  resultsList.classList.remove("results-updating");
  const rowHeight = 168;
  const containerHeight = resultsList.clientHeight;
  const total = state.filtered.length;
  const visibleCount = Math.ceil(containerHeight / rowHeight) + 3;
  const scrollTop = resultsList.scrollTop;
  const start = Math.max(Math.floor(scrollTop / rowHeight) - 1, 0);
  const end = Math.min(start + visibleCount, total);
  const offset = start * rowHeight;

  virtualSpacer.style.height = `${total * rowHeight}px`;
  virtualItems.style.transform = `translateY(${offset}px)`;
  virtualItems.innerHTML = "";

  for (let i = start; i < end; i += 1) {
    const flight = state.filtered[i];
    const node = cardTemplate.content.cloneNode(true);
    const card = node.querySelector(".flight-card");
    card.dataset.id = flight.id;
    card.querySelector(".flight-route").textContent = `${flight.origin} → ${flight.destination}`;
    card.querySelector(".flight-meta").textContent = `${flight.airline} · ${flight.stops} stop${flight.stops === 1 ? "" : "s"}`;
    card.querySelector(".price").textContent = `$ ${flight.price}`;

    card.querySelector(".depart-time").textContent = formatTime(
      flight.departDate,
      flight.departTime,
      flight.originZone
    );
    card.querySelector(".depart-code").textContent = flight.originCode;
    card.querySelector(".arrive-time").textContent = formatTime(
      flight.arriveDate,
      flight.arriveTime,
      flight.destinationZone
    );
    card.querySelector(".arrive-code").textContent = flight.destinationCode;
    card.querySelector(".duration-text").textContent = calcDuration(
      flight.departDate,
      flight.departTime,
      flight.originZone,
      flight.arriveDate,
      flight.arriveTime,
      flight.destinationZone
    );
    card.querySelector(".timezone-text").textContent = `Local: ${
      Intl.DateTimeFormat().resolvedOptions().timeZone
    }`;
    card.querySelector(".timeline").innerHTML = buildTimeline(flight);

    card.querySelector(".select-btn").addEventListener("click", () => {
      state.totalFare += flight.price;
      totalFare.textContent = `$ ${state.totalFare}`;
      requestState.textContent = `Optimistic add: ${flight.id}`;
      setTimeout(() => {
        requestState.textContent = `Selection confirmed for ${flight.id}`;
      }, 700);
    });

    card.querySelector(".compare-btn").addEventListener("click", (event) => {
      const spark = document.createElement("span");
      spark.className = "spark";
      const rect = card.getBoundingClientRect();
      spark.style.left = `${event.clientX - rect.left - 8}px`;
      spark.style.top = `${event.clientY - rect.top - 8}px`;
      card.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    });

    virtualItems.appendChild(node);
  }
};

const scheduleRender = () => {
  requestAnimationFrame(renderVirtualList);
};

const fetchFlights = () => {
  if (state.controller) state.controller.abort();
  state.controller = new AbortController();
  state.loading = true;
  requestState.textContent = "Fetching updated flights...";
  renderSkeletons();

  return new Promise((resolve, reject) => {
    const delay = 600 + Math.random() * 900;
    const timeout = setTimeout(() => {
      if (state.controller.signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      resolve(generateFlights(320));
    }, delay);

    state.controller.signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
};

const updateResults = () => {
  fetchFlights()
    .then((flights) => {
      state.results = flights;
      applyFilters();
      renderResultsMeta();
      scheduleRender();
      requestState.textContent = "Latest request rendered.";
      state.loading = false;
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        requestState.textContent = "Superseded by newer request.";
        return;
      }
      requestState.textContent = "Request failed.";
    });
};

const syncUrl = () => {
  const params = new URLSearchParams();
  params.set("origin", state.origin);
  params.set("destination", state.destination);
  if (state.date) params.set("date", state.date);
  params.set("roundtrip", state.roundtrip ? "1" : "0");
  params.set("minFare", String(state.minFare));
  params.set("maxFare", String(state.maxFare));
  params.set("stops", String(state.maxStops));
  params.set("airlines", Array.from(state.airlineFilter).join(","));
  history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
};

const readUrlState = () => {
  const params = new URLSearchParams(location.search);
  if (params.get("origin")) state.origin = params.get("origin");
  if (params.get("destination")) state.destination = params.get("destination");
  if (params.get("date")) state.date = params.get("date");
  if (params.get("roundtrip")) state.roundtrip = params.get("roundtrip") === "1";
  if (params.get("minFare")) state.minFare = Number(params.get("minFare"));
  if (params.get("maxFare")) state.maxFare = Number(params.get("maxFare"));
  if (params.get("stops")) state.maxStops = Number(params.get("stops"));
  if (params.get("airlines")) {
    state.airlineFilter = new Set(params.get("airlines").split(","));
  }
};

const updateFilterLabels = () => {
  minFareLabel.textContent = `USD ${state.minFare}`;
  maxFareLabel.textContent = `USD ${state.maxFare}`;
  stopsLabel.textContent = `${state.maxStops} stop${state.maxStops === 1 ? "" : "s"}`;
};

const applyFilterInputs = () => {
  minFareRange.value = state.minFare;
  maxFareRange.value = state.maxFare;
  stopsRange.value = state.maxStops;
  updateFilterLabels();
  document.querySelectorAll(".filters input[type='checkbox']").forEach((input) => {
    input.checked = state.airlineFilter.has(input.value);
  });
};

const updateFiltersFromInputs = () => {
  const min = Number(minFareRange.value);
  const max = Number(maxFareRange.value);
  state.minFare = Math.min(min, max - 10);
  state.maxFare = Math.max(max, min + 10);
  state.maxStops = Number(stopsRange.value);
  state.airlineFilter = new Set(
    Array.from(document.querySelectorAll(".filters input[type='checkbox']:checked")).map(
      (input) => input.value
    )
  );
  updateFilterLabels();
  syncUrl();
  updateResults();
};

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    shareLink.textContent = "Copied!";
    setTimeout(() => (shareLink.textContent = "Copy share link"), 1200);
  } catch (error) {
    shareLink.textContent = "Copy failed";
  }
};

queryInput.addEventListener("input", (event) => {
  parseQuery(event.target.value);
});

runSearchBtn.addEventListener("click", () => {
  parseQuery(queryInput.value);
  updateResults();
});

document.querySelectorAll(".pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    const field = pill.dataset.field;
    if (field === "roundtrip") {
      state.roundtrip = !state.roundtrip;
    }
    if (field === "date") {
      state.date = "";
    }
    updatePills();
    updateStructuredOutput();
    syncUrl();
  });
});

minFareRange.addEventListener("input", updateFiltersFromInputs);
maxFareRange.addEventListener("input", updateFiltersFromInputs);
stopsRange.addEventListener("input", updateFiltersFromInputs);
document.querySelectorAll(".filters input[type='checkbox']").forEach((input) => {
  input.addEventListener("change", updateFiltersFromInputs);
});

resetFilters.addEventListener("click", () => {
  state.minFare = 120;
  state.maxFare = 1320;
  state.maxStops = 1;
  state.airlineFilter = new Set(airlines);
  applyFilterInputs();
  syncUrl();
  updateResults();
});

shareLink.addEventListener("click", copyShareLink);
resultsList.addEventListener("scroll", scheduleRender);
window.addEventListener("resize", scheduleRender);

readUrlState();
applyFilterInputs();
updatePills();
updateStructuredOutput();
createMatrix();
updateResults();
