async function loadComponent(id, file, params = {}) {
    const container = document.getElementById(id);
    if (!container) return;

    let html = await fetch(file).then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        return response.text();
    });

    Object.entries(params).forEach(([key, value]) => {
        html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    });

    container.innerHTML = html;
}

function initLoadingScreen(selector = ".loading") {
    const loadingScreen = document.querySelector(selector);
    if (!loadingScreen) return;

    window.addEventListener("load", () => {
        setTimeout(() => {
            loadingScreen.classList.add("opacity-0", "pointer-events-none");

            loadingScreen.addEventListener("transitionend", () => {
                loadingScreen.classList.add("hidden");
            }, { once: true });
        }, 500);
    });
}

function initLightbox(root = document) {
    const lightbox = root.querySelector(".lightbox");
    const lightboxImg = root.querySelector(".lightbox-img");
    const lightboxClose = root.querySelector(".lightbox-close");
    const thumbs = root.querySelectorAll(".photo-thumb");

    if (!lightbox || !lightboxImg || !lightboxClose) return;

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.remove("hidden");
        lightbox.classList.add("flex");
        requestAnimationFrame(() => {
            lightbox.classList.remove("opacity-0");
        });
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.add("opacity-0");
        lightbox.addEventListener("transitionend", () => {
            lightbox.classList.add("hidden");
            lightbox.classList.remove("flex");
            lightboxImg.src = "";
        }, { once: true });
        document.body.style.overflow = "";
    }

    thumbs.forEach((img) => {
        img.addEventListener("click", () => openLightbox(img.src));
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });
}
