class DragSlider {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.slider = this.container.querySelector(".slider");
        this.slides = this.container.querySelectorAll(".slide");
        this.currentIndex = this.slides.length - 1; 

        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = -1000;
        this.prevTranslate = this.currentTranslate;
        this.animationID = 0;

        this.initEvents();

        this.slider.style.transition = "none";
        this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
        setTimeout(() => {
            this.slider.style.transition = "transform 0.3s ease-out";
        }, 0);
    }

    initEvents() {
        this.slider.addEventListener("mousedown", this.startDrag.bind(this));
        this.slider.addEventListener("touchstart", this.startDrag.bind(this), { passive: true });

        window.addEventListener("mouseup", this.endDrag.bind(this));
        window.addEventListener("touchend", this.endDrag.bind(this));

        window.addEventListener("mousemove", this.drag.bind(this));
        window.addEventListener("touchmove", this.drag.bind(this), { passive: true });
    }

    startDrag(event) {
        this.isDragging = true;
        this.startX = this.getEventX(event);
        this.slider.style.transition = "none";
        this.animationID = requestAnimationFrame(this.animate.bind(this));
    }

    drag(event) {
        if (!this.isDragging) return;
        const currentX = this.getEventX(event);
        this.currentTranslate = this.prevTranslate + currentX - this.startX;
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);

        const moveBy = this.currentTranslate - this.prevTranslate;

        if (moveBy < -50 && this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
        } else if (moveBy > 50 && this.currentIndex > 0) {
            this.currentIndex--;
        }

        this.setPositionByIndex();
    }

    getEventX(event) {
        return event.type.includes("touch") ? event.touches[0].clientX : event.clientX;
    }

    animate() {
        this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
        if (this.isDragging) requestAnimationFrame(this.animate.bind(this));
    }

    setPositionByIndex() {
        this.currentTranslate = this.currentIndex * -this.container.offsetWidth;
        this.prevTranslate = this.currentTranslate;
        this.slider.style.transition = "transform 0.3s ease-out";
        this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
    }
}

const slider = document.querySelector(".slider");
const links = document.querySelectorAll("a");

let startX, startY;
let pointerTimer;

function disableLinks() {
    links.forEach(link => link.style.pointerEvents = "none");
}

function enableLinks() {
    setTimeout(() => {
        links.forEach(link => link.style.pointerEvents = "auto");
    }, 50);
}

document.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener("pointermove", (e) => {
    const deltaX = Math.abs(e.clientX - startX);
    const deltaY = Math.abs(e.clientY - startY);

    if (deltaX > 5 || deltaY > 5) {
        disableLinks();
    }

    clearTimeout(pointerTimer);
    pointerTimer = setTimeout(() => {
        enableLinks();
    }, 50);
});

document.addEventListener("pointerup", enableLinks);

document.querySelector(".openButton").addEventListener("click", (event) => {
    document.querySelector(".openTabs").style.display = "flex";
    document.querySelector(".overlay").style.display = "block";
    document.querySelector("#noteCreation").style.display = "none";
    event.stopPropagation();
});

document.addEventListener("click", (event) => {
    const openTabs = document.querySelector(".openTabs");
    const openButton = document.querySelector(".openButton");
    const appVisible = document.querySelector(".appVisible");
    const noteCreation = document.querySelector("#noteCreation");

    const noteCreationHidden = noteCreation ? noteCreation.style.display === "none" : true;
    const wasGrid = window.getComputedStyle(appVisible).display === "grid";

    if (!openTabs.contains(event.target) && !openButton.contains(event.target) && noteCreationHidden) {
        openTabs.style.display = "none";
        appVisible.style.display = wasGrid ? "grid" : "flex";
        document.querySelector(".overlay").style.display = "none";
    }
});

const mySlider = new DragSlider(".tabsContent");
