const slider = document.querySelector(".lumina-deck");
const viewport = slider.querySelector(".slider-viewport");
const track = slider.querySelector(".slider-track");
const progressBar = slider.querySelector(".progress-bar");
const skeleton = document.getElementById("skeleton-loader");

let slideWidth = 360;
const autoplayDelay = 5200;
const parallaxFactor = 0.18;

let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let dragTranslate = 0;
let lastMoveTime = 0;
let lastMoveX = 0;
let velocityX = 0;
let currentIndex = 1;
let isAnimating = false;
let isVisible = false;
let autoplayTimer = null;
let lastSnapIndex = null;

const baseSlides = Array.from(track.children);

const firstClone = baseSlides[0].cloneNode(true);
firstClone.classList.add("clone");
const lastClone = baseSlides[baseSlides.length - 1].cloneNode(true);
lastClone.classList.add("clone");
track.appendChild(firstClone);
track.insertBefore(lastClone, track.firstChild);

let allSlides = Array.from(track.children);

const getRealIndex = (index) => {
    if (index === 0) return baseSlides.length - 1;
    if (index === allSlides.length - 1) return 0;
    return index - 1;
};

const setTrackPosition = (translate, withTransition = true) => {
    track.style.transition = withTransition
        ? "transform 640ms cubic-bezier(0.22, 0.88, 0.25, 1)"
        : "none";
    track.style.transform = `translate3d(${translate}px, 0, 0)`;
};

const updateParallax = (offset = 0) => {
    allSlides.forEach((slide, index) => {
        const distance = (index - currentIndex) * slideWidth + offset;
        const image = slide.querySelector("img");
        const rotation = Math.max(Math.min(distance / slideWidth, 1), -1) * -6;
        image.style.transform = `translate3d(${distance * -parallaxFactor}px, 0, 0) scale(1.08)`;
        slide.style.transform = `rotateY(${rotation}deg)`;
    });
};

const updateAria = () => {
    allSlides.forEach((slide, index) => {
        const isActive = index === currentIndex;
        slide.setAttribute("aria-hidden", String(!isActive));
        slide.setAttribute("aria-current", isActive ? "true" : "false");
    });
};

const updateAura = (index) => {
    const slide = allSlides[index];
    const start = slide.dataset.auraStart || "#2d1b50";
    const end = slide.dataset.auraEnd || "#10121f";
    document.documentElement.style.setProperty("--aura-start", start);
    document.documentElement.style.setProperty("--aura-end", end);
};

const vibrateSnap = (index) => {
    if (lastSnapIndex === index) return;
    lastSnapIndex = index;
    if (navigator.vibrate) {
        navigator.vibrate(5);
    }
};

const goToIndex = (index, withTransition = true) => {
    currentIndex = index;
    currentTranslate = -currentIndex * slideWidth;
    setTrackPosition(currentTranslate, withTransition);
    updateParallax();
    updateAria();
    updateAura(currentIndex);
    vibrateSnap(currentIndex);
    updateProgress();
};

const handleTransitionEnd = () => {
    if (currentIndex === 0) {
        currentIndex = baseSlides.length;
        goToIndex(currentIndex, false);
    }
    if (currentIndex === allSlides.length - 1) {
        currentIndex = 1;
        goToIndex(currentIndex, false);
    }
    isAnimating = false;
    if (isVisible) {
        scheduleAutoplay();
    }
};

const settleToIndex = (index) => {
    const clamped = Math.max(0, Math.min(index, allSlides.length - 1));
    isAnimating = true;
    goToIndex(clamped, true);
};

const handleRelease = () => {
    const momentumOffset = velocityX * 220;
    const target = Math.round((-currentTranslate + momentumOffset) / slideWidth);
    settleToIndex(target);
    dragTranslate = 0;
};

const handlePointerDown = (event) => {
    if (isAnimating) return;
    stopAutoplay();
    isDragging = true;
    startX = event.clientX;
    dragTranslate = 0;
    lastMoveTime = performance.now();
    lastMoveX = startX;
    velocityX = 0;
    track.style.transition = "none";
    viewport.setPointerCapture(event.pointerId);
};

const handlePointerMove = (event) => {
    if (!isDragging) return;
    const currentX = event.clientX;
    const now = performance.now();
    dragTranslate = currentX - startX;
    currentTranslate = -currentIndex * slideWidth + dragTranslate;
    setTrackPosition(currentTranslate, false);
    updateParallax(dragTranslate);

    const deltaX = currentX - lastMoveX;
    const deltaT = now - lastMoveTime || 1;
    velocityX = deltaX / deltaT;
    lastMoveX = currentX;
    lastMoveTime = now;
};

const handlePointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    handleRelease();
};

const resetProgressFill = () => {
    const segments = Array.from(progressBar.children);
    segments.forEach((segment) => segment.classList.remove("active"));
};

const updateProgress = () => {
    const realIndex = getRealIndex(currentIndex);
    const segments = Array.from(progressBar.children);
    segments.forEach((segment, index) => {
        segment.classList.toggle("active", index === realIndex);
        segment.setAttribute("aria-selected", index === realIndex ? "true" : "false");
        segment.tabIndex = index === realIndex ? 0 : -1;
        segment.style.setProperty("--fill-duration", `${autoplayDelay}ms`);
    });
};

const scheduleAutoplay = () => {
    if (!isVisible) return;
    clearTimeout(autoplayTimer);
    autoplayTimer = setTimeout(() => {
        settleToIndex(currentIndex + 1);
    }, autoplayDelay);
};

const stopAutoplay = () => {
    clearTimeout(autoplayTimer);
};

const startAutoplay = () => {
    updateProgress();
    scheduleAutoplay();
};

const handleSegmentClick = (index) => {
    stopAutoplay();
    settleToIndex(index + 1);
    if (isVisible) {
        scheduleAutoplay();
    }
};

const handleSegmentScrub = (event) => {
    const rect = progressBar.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const index = Math.min(Math.floor(ratio * baseSlides.length), baseSlides.length - 1);
    handleSegmentClick(index);
};

const setupProgressBar = () => {
    progressBar.innerHTML = "";
    baseSlides.forEach((slide, index) => {
        const button = document.createElement("button");
        button.className = "progress-segment";
        button.type = "button";
        button.setAttribute("role", "tab");
        button.setAttribute("aria-label", slide.dataset.title || `Slide ${index + 1}`);
        const fill = document.createElement("span");
        fill.className = "segment-fill";
        button.appendChild(fill);
        button.addEventListener("click", () => handleSegmentClick(index));
        progressBar.appendChild(button);
    });

    let isScrubbing = false;
    progressBar.addEventListener("pointerdown", (event) => {
        isScrubbing = true;
        progressBar.setPointerCapture(event.pointerId);
        handleSegmentScrub(event);
    });
    progressBar.addEventListener("pointermove", (event) => {
        if (!isScrubbing) return;
        handleSegmentScrub(event);
    });
    progressBar.addEventListener("pointerup", () => {
        isScrubbing = false;
        if (isVisible) scheduleAutoplay();
    });
};

const sampleColor = (image) => {
    const canvas = document.createElement("canvas");
    const size = 24;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    try {
        ctx.drawImage(image, 0, 0, size, size);
    } catch (error) {
        return { r: 45, g: 27, b: 80 };
    }
    const { data } = ctx.getImageData(0, 0, size, size);
    let r = 0;
    let g = 0;
    let b = 0;
    const total = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }
    r = Math.round(r / total);
    g = Math.round(g / total);
    b = Math.round(b / total);
    return { r, g, b };
};

const shiftColor = (color, amount) => {
    const clamp = (value) => Math.max(0, Math.min(255, value));
    return `rgb(${clamp(color.r + amount)}, ${clamp(color.g + amount)}, ${clamp(color.b + amount)})`;
};

const updateSlideAura = (slide) => {
    const image = slide.querySelector("img");
    if (!image.complete || image.naturalWidth === 0) return;
    const avg = sampleColor(image);
    slide.dataset.auraStart = shiftColor(avg, 40);
    slide.dataset.auraEnd = shiftColor(avg, -40);
};

const preloadAuras = () => {
    let loaded = 0;
    const handleLoadComplete = () => {
        loaded += 1;
        if (loaded === baseSlides.length) {
            skeleton.classList.add("is-hidden");
        }
    };
    baseSlides.forEach((slide) => {
        const image = slide.querySelector("img");
        const onLoad = () => {
            updateSlideAura(slide);
            handleLoadComplete();
        };
        const onError = () => {
            handleLoadComplete();
        };
        if (image.complete) {
            onLoad();
        } else {
            image.addEventListener("load", onLoad, { once: true });
            image.addEventListener("error", onError, { once: true });
        }
    });
};

const onKeydown = (event) => {
    if (event.key === "ArrowRight") {
        event.preventDefault();
        stopAutoplay();
        settleToIndex(currentIndex + 1);
        if (isVisible) scheduleAutoplay();
    }
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        stopAutoplay();
        settleToIndex(currentIndex - 1);
        if (isVisible) scheduleAutoplay();
    }
};

const updateDimensions = () => {
    slideWidth = viewport.getBoundingClientRect().width || 360;
    currentTranslate = -currentIndex * slideWidth;
    setTrackPosition(currentTranslate, false);
    updateParallax();
};

const setupAria = () => {
    allSlides.forEach((slide, index) => {
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-label", slide.dataset.title || `Slide ${index + 1}`);
    });
};

const setupObserver = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.6;
                if (isVisible) {
                    startAutoplay();
                } else {
                    stopAutoplay();
                }
            });
        },
        { threshold: [0, 0.6, 1] }
    );
    observer.observe(slider);
};

viewport.addEventListener("pointerdown", handlePointerDown);
viewport.addEventListener("pointermove", handlePointerMove);
viewport.addEventListener("pointerup", handlePointerUp);
viewport.addEventListener("pointerleave", handlePointerUp);
track.addEventListener("transitionend", handleTransitionEnd);
slider.addEventListener("keydown", onKeydown);

setupProgressBar();
setupAria();
preloadAuras();
updateDimensions();
goToIndex(currentIndex, false);
setupObserver();
window.addEventListener("resize", updateDimensions);
