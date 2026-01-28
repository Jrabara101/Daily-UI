const state = {
    checkIn: null,
    checkOut: null,
    minStay: 2,
    monthOffset: 0,
    activeAmenities: new Set(),
    mapCenter: { x: 50, y: 50 }
};

const hotelData = [
    {
        id: 1,
        name: "LuxeStay Ocean Suite",
        price: 320,
        rating: 4.9,
        amenities: ["spa", "pool", "chef", "city"],
        coords: { x: 58, y: 42 }
    },
    {
        id: 2,
        name: "Zen Garden Retreat",
        price: 260,
        rating: 4.7,
        amenities: ["spa", "pet", "workspace"],
        coords: { x: 46, y: 65 }
    },
    {
        id: 3,
        name: "Skyline Executive Loft",
        price: 390,
        rating: 4.8,
        amenities: ["city", "workspace"],
        coords: { x: 70, y: 55 }
    },
    {
        id: 4,
        name: "Forest Wellness Villa",
        price: 280,
        rating: 4.6,
        amenities: ["spa", "pool", "pet"],
        coords: { x: 32, y: 38 }
    },
    {
        id: 5,
        name: "Culinary Artist Residence",
        price: 360,
        rating: 4.9,
        amenities: ["chef", "workspace", "city"],
        coords: { x: 54, y: 26 }
    }
];

const calendarGrid = document.getElementById("calendarGrid");
const calendarMonth = document.getElementById("calendarMonth");
const calendarHint = document.getElementById("calendarHint");
const checkInInput = document.getElementById("checkInInput");
const checkOutInput = document.getElementById("checkOutInput");
const sideCheckIn = document.getElementById("sideCheckIn");
const sideCheckOut = document.getElementById("sideCheckOut");
const sideTotal = document.getElementById("sideTotal");
const barCheckIn = document.getElementById("barCheckIn");
const barCheckOut = document.getElementById("barCheckOut");
const barTotal = document.getElementById("barTotal");
const nightCountEl = document.getElementById("nightCount");
const subtotalAmount = document.getElementById("subtotalAmount");
const discountAmount = document.getElementById("discountAmount");
const taxAmount = document.getElementById("taxAmount");
const totalAmount = document.getElementById("totalAmount");
const resultList = document.getElementById("resultList");
const resultCount = document.getElementById("resultCount");
const mapCoords = document.getElementById("mapCoords");
const mapCanvas = document.getElementById("mapCanvas");

const formatDate = (date) => date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
});

const formatISO = (date) => date.toISOString().split("T")[0];

const getDateFromISO = (value) => value ? new Date(`${value}T00:00:00`) : null;

const calculateBookingTotal = (ratePerNight, checkIn, checkOut, taxRate = 0.12) => {
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const basePrice = totalNights * ratePerNight;
    const taxValue = basePrice * taxRate;

    return {
        nights: totalNights,
        subtotal: basePrice.toFixed(2),
        tax: taxValue.toFixed(2),
        total: (basePrice + taxValue).toFixed(2)
    };
};

const getNightlyRate = (date) => {
    const base = 260;
    const dayIndex = date.getDate();
    const weekendPremium = date.getDay() === 5 || date.getDay() === 6 ? 45 : 0;
    const fluctuation = (dayIndex % 5) * 8;
    return base + fluctuation + weekendPremium;
};

const getNightlyRates = (checkIn, checkOut) => {
    const rates = [];
    let cursor = new Date(checkIn);
    while (cursor < checkOut) {
        rates.push(getNightlyRate(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }
    return rates;
};

const calculateDynamicTotal = (checkIn, checkOut) => {
    const rates = getNightlyRates(checkIn, checkOut);
    const subtotal = rates.reduce((sum, rate) => sum + rate, 0);
    const tax = subtotal * 0.12;
    const earlyBird = isEarlyBird(checkIn) ? subtotal * 0.1 : 0;
    const total = subtotal - earlyBird + tax;

    return {
        nights: rates.length,
        subtotal,
        tax,
        earlyBird,
        total
    };
};

const isEarlyBird = (checkIn) => {
    const today = new Date();
    const diffDays = Math.floor((checkIn - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 21;
};

const updateTotals = () => {
    if (!state.checkIn || !state.checkOut) {
        nightCountEl.textContent = "0";
        subtotalAmount.textContent = "$0.00";
        taxAmount.textContent = "$0.00";
        totalAmount.textContent = "$0.00";
        discountAmount.textContent = "-$0.00";
        sideTotal.textContent = "$0";
        barTotal.textContent = "$0";
        return;
    }

    const totals = calculateDynamicTotal(state.checkIn, state.checkOut);
    nightCountEl.textContent = totals.nights;
    subtotalAmount.textContent = `$${totals.subtotal.toFixed(2)}`;
    taxAmount.textContent = `$${totals.tax.toFixed(2)}`;
    discountAmount.textContent = `-$${totals.earlyBird.toFixed(2)}`;
    totalAmount.textContent = `$${totals.total.toFixed(2)}`;
    sideTotal.textContent = `$${totals.total.toFixed(2)}`;
    barTotal.textContent = `$${totals.total.toFixed(0)}`;
};

const updateInputs = () => {
    checkInInput.value = state.checkIn ? formatDate(state.checkIn) : "";
    checkOutInput.value = state.checkOut ? formatDate(state.checkOut) : "";
    sideCheckIn.textContent = state.checkIn ? formatDate(state.checkIn) : "Select";
    sideCheckOut.textContent = state.checkOut ? formatDate(state.checkOut) : "Select";
    barCheckIn.textContent = state.checkIn ? formatDate(state.checkIn) : "Select";
    barCheckOut.textContent = state.checkOut ? formatDate(state.checkOut) : "Select";
};

const updateCalendar = () => {
    calendarGrid.innerHTML = "";
    const baseDate = new Date();
    const displayDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + state.monthOffset, 1);
    const month = displayDate.getMonth();
    const year = displayDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    const monthLabel = displayDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    calendarMonth.textContent = monthLabel;

    for (let i = 0; i < startDay; i += 1) {
        const emptyCell = document.createElement("div");
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        const tile = document.createElement("div");
        tile.className = "date-tile";
        const iso = formatISO(date);
        tile.dataset.date = iso;

        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
        if (isPast) tile.classList.add("disabled");

        if (state.checkIn && formatISO(state.checkIn) === iso) {
            tile.classList.add("selected");
        }
        if (state.checkOut && formatISO(state.checkOut) === iso) {
            tile.classList.add("selected");
        }

        const price = getNightlyRate(date);
        tile.innerHTML = `
            <span class="date-number">${day}</span>
            <span class="date-price">$${price}</span>
        `;

        tile.addEventListener("click", () => handleDateClick(date, isPast));
        calendarGrid.appendChild(tile);
    }
};

const handleDateClick = (date, isPast) => {
    if (isPast) return;

    if (!state.checkIn || (state.checkIn && state.checkOut)) {
        state.checkIn = new Date(date);
        state.checkOut = null;
        calendarHint.textContent = `Select a check-out date (min ${state.minStay} nights).`;
    } else if (state.checkIn && !state.checkOut) {
        const minCheckOut = new Date(state.checkIn);
        minCheckOut.setDate(minCheckOut.getDate() + state.minStay);
        if (date < minCheckOut) {
            calendarHint.textContent = `Minimum stay is ${state.minStay} nights.`;
            return;
        }
        state.checkOut = new Date(date);
        calendarHint.textContent = "Dates selected. Pricing locked.";
    }

    updateCalendar();
    updateInputs();
    updateTotals();
    syncSearchState();
};

const setFilters = () => {
    const pills = document.querySelectorAll("#amenityFilters .pill");
    pills.forEach((pill) => {
        pill.addEventListener("click", () => {
            const amenity = pill.dataset.amenity;
            if (state.activeAmenities.has(amenity)) {
                state.activeAmenities.delete(amenity);
                pill.classList.remove("active");
            } else {
                state.activeAmenities.add(amenity);
                pill.classList.add("active");
            }
            showSkeleton();
            setTimeout(renderResults, 450);
        });
    });
};

const getFilteredHotels = () => {
    const list = hotelData.filter((hotel) => {
        if (!state.activeAmenities.size) return true;
        return [...state.activeAmenities].every((item) => hotel.amenities.includes(item));
    });

    const center = state.mapCenter;
    return list.filter((hotel) => {
        const dx = hotel.coords.x - center.x;
        const dy = hotel.coords.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 30;
    });
};

const showSkeleton = () => {
    resultList.innerHTML = "";
    for (let i = 0; i < 3; i += 1) {
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton";
        resultList.appendChild(skeleton);
    }
};

const renderResults = () => {
    resultList.innerHTML = "";
    const filtered = getFilteredHotels();
    resultCount.textContent = filtered.length;

    filtered.forEach((hotel) => {
        const card = document.createElement("article");
        card.className = "hotel-card";
        card.innerHTML = `
            <div class="card-header">
                <h4>${hotel.name}</h4>
                <span class="price">$${hotel.price}</span>
            </div>
            <div class="meta">
                <span>Rating ${hotel.rating}</span>
                <span>${hotel.amenities.join(" · ")}</span>
            </div>
        `;
        resultList.appendChild(card);
    });

    renderMapMarkers(filtered);
};

const renderMapMarkers = (hotels) => {
    mapCanvas.querySelectorAll(".map-marker").forEach((marker) => marker.remove());
    hotels.forEach((hotel) => {
        const marker = document.createElement("div");
        marker.className = "map-marker";
        marker.style.left = `${hotel.coords.x}%`;
        marker.style.top = `${hotel.coords.y}%`;
        mapCanvas.appendChild(marker);
    });
    mapCoords.textContent = `${state.mapCenter.x.toFixed(0)}, ${state.mapCenter.y.toFixed(0)}`;
};

const panMap = (direction) => {
    const delta = 6;
    if (direction === "north") state.mapCenter.y -= delta;
    if (direction === "south") state.mapCenter.y += delta;
    if (direction === "east") state.mapCenter.x += delta;
    if (direction === "west") state.mapCenter.x -= delta;

    state.mapCenter.x = Math.max(10, Math.min(90, state.mapCenter.x));
    state.mapCenter.y = Math.max(10, Math.min(90, state.mapCenter.y));
    showSkeleton();
    setTimeout(renderResults, 350);
};

const bindMapControls = () => {
    document.querySelectorAll("[data-pan]").forEach((btn) => {
        btn.addEventListener("click", () => panMap(btn.dataset.pan));
    });
};

const syncSearchState = () => {
    const params = new URLSearchParams(window.location.search);
    if (state.checkIn) params.set("checkIn", formatISO(state.checkIn));
    if (state.checkOut) params.set("checkOut", formatISO(state.checkOut));
    const guests = document.getElementById("guests").value;
    const location = document.getElementById("location").value;
    params.set("guests", guests);
    params.set("location", location);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);

    sessionStorage.setItem("luxestay-search", JSON.stringify({
        checkIn: state.checkIn ? formatISO(state.checkIn) : null,
        checkOut: state.checkOut ? formatISO(state.checkOut) : null,
        guests,
        location
    }));
};

const hydrateSearch = () => {
    const params = new URLSearchParams(window.location.search);
    const stored = sessionStorage.getItem("luxestay-search");
    const source = stored ? JSON.parse(stored) : {};

    const checkIn = params.get("checkIn") || source.checkIn;
    const checkOut = params.get("checkOut") || source.checkOut;
    const guests = params.get("guests") || source.guests || "2";
    const location = params.get("location") || source.location || "Kyoto, Japan";

    if (checkIn) state.checkIn = getDateFromISO(checkIn);
    if (checkOut) state.checkOut = getDateFromISO(checkOut);
    document.getElementById("guests").value = guests;
    document.getElementById("location").value = location;
};

const initObservers = () => {
    const heroMeta = document.getElementById("heroMeta");
    const roomDescription = document.getElementById("roomDescription");
    const bookingCard = document.getElementById("bookingCard");

    const heroObserver = new IntersectionObserver(([entry]) => {
        document.body.classList.toggle("booking-bar-active", !entry.isIntersecting);
    }, { threshold: 0.1 });

    heroObserver.observe(heroMeta);

    const bookingObserver = new IntersectionObserver(([entry]) => {
        bookingCard.classList.toggle("is-stuck", !entry.isIntersecting);
    }, { threshold: 0.2 });

    bookingObserver.observe(roomDescription);
};

const initLazyImages = () => {
    const images = document.querySelectorAll("img[data-src]");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            img.src = img.dataset.src;
            img.onload = () => img.classList.add("is-loaded");
            observer.unobserve(img);
        });
    }, { threshold: 0.2 });

    images.forEach((img) => observer.observe(img));
};

const bindFormEvents = () => {
    const inputs = document.querySelectorAll("#searchForm input");
    inputs.forEach((input) => {
        input.addEventListener("change", syncSearchState);
        input.addEventListener("input", syncSearchState);
    });

    document.getElementById("scrollToAvailability").addEventListener("click", () => {
        document.getElementById("availability").scrollIntoView({ behavior: "smooth" });
    });
};

document.getElementById("prevMonth").addEventListener("click", () => {
    state.monthOffset -= 1;
    updateCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
    state.monthOffset += 1;
    updateCalendar();
});

document.getElementById("openSearch").addEventListener("click", () => {
    document.getElementById("search").scrollIntoView({ behavior: "smooth" });
});

hydrateSearch();
updateCalendar();
updateInputs();
updateTotals();
setFilters();
renderResults();
bindMapControls();
bindFormEvents();
initObservers();
initLazyImages();
