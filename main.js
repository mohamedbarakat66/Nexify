
/* =====================================================
   1) Open & Close Menu
   ==> Conditions + Control CSS using JS
   ===================================================== */

const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {

    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("open");

        const isOpen = nav.classList.contains("open");

        menuBtn.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

        menuBtn.setAttribute("aria-expanded", isOpen);

    });

    nav.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            menuBtn.innerHTML =
                '<i class="fa-solid fa-bars"></i>';

            menuBtn.setAttribute("aria-expanded", "false");

        });

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 700) {

            nav.classList.remove("open");

            menuBtn.innerHTML =
                '<i class="fa-solid fa-bars"></i>';

            menuBtn.setAttribute("aria-expanded", "false");

        }

    });

}


/* =====================================================
   2) Light / Dark Mode
   ==> Control HTML Attributes
   ===================================================== */

const themeBtn = document.getElementById("theme-btn");
const root = document.documentElement;

function applyTheme(theme) {

    root.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);

    if (themeBtn) {

        themeBtn.innerHTML = theme === "dark"
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

    }

}


/* Get saved theme */

const savedTheme = localStorage.getItem("theme") || "light";

applyTheme(savedTheme);


/* Change theme */

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        const currentTheme =
            root.getAttribute("data-theme");

        applyTheme(
            currentTheme === "dark" ? "light" : "dark"
        );

    });

}


/* =====================================================
   3) API Courses Read
   ==> API Methods (fetch)
   ===================================================== */

const API_URL =
    "https://sphinx-public-api.vercel.app/get-data";

const coursesGrid =
    document.getElementById("courses-grid");

const coursesStatus =
    document.getElementById("courses-status");

const testimonialsGrid =
    document.getElementById("testimonials-grid");

let courses = [];


async function getData() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Request failed: " + response.status);
        }

        const data = await response.json();

        courses = Array.isArray(data.cards)
            ? data.cards
            : [];

        const testimonials = Array.isArray(data.testimonials)
            ? data.testimonials
            : [];

        renderCourses(courses);
        renderTestimonials(testimonials);

        if (coursesStatus) {
            coursesStatus.style.display = "none";
        }

    } catch (error) {

        if (coursesStatus) {
            coursesStatus.textContent =
                "Could not load courses. Please try again later.";
        }

        console.error("API Error:", error);

    }

}


/* =====================================================
   Display Courses
   ===================================================== */

function renderCourses(cards) {

    if (!coursesGrid) return;

    coursesGrid.innerHTML = cards.map((card, index) => {

        return `
            <div class="card">

                <i class="${card.icon || ""} card-icon"></i>

                <h3>${card.title || "Untitled Course"}</h3>

                <p>
                    ${card.description || ""}
                </p>

                <button
                    class="details-btn"
                    data-index="${index}"
                >
                    View Details
                </button>

            </div>
        `;

    }).join("");

}


/* =====================================================
   Display Testimonials
   ===================================================== */

function renderTestimonials(list) {

    if (!testimonialsGrid) return;

    testimonialsGrid.innerHTML = list.map((testimonial) => {

        return `
            <div class="card testimonial">

                <i class="${testimonial.icon || ""} quote-icon"></i>

                <p>
                    ${testimonial.text || ""}
                </p>

                <div class="user">

                    <i class="${testimonial.userIcon || ""}"></i>

                    <div>

                        <strong>
                            ${testimonial.name || ""}
                        </strong>

                        <br>

                        <span>
                            ${testimonial.role || ""}
                        </span>

                    </div>

                </div>

            </div>
        `;

    }).join("");

}


getData();


/* =====================================================
   4) API Specific Course Read
   ==> API Methods + find()
   ===================================================== */

const modal = document.getElementById("modal");

const modalContent =
    document.getElementById("modal-content");

const modalClose =
    document.getElementById("modal-close");


/* Event Delegation */

if (coursesGrid) {

    coursesGrid.addEventListener("click", (e) => {

        const btn = e.target.closest(".details-btn");

        if (!btn) return;

        const index = Number(btn.dataset.index);

        const course = courses.find((course, i) => i === index);

        if (course) {
            openModal(course);
        }

    });

}


/* Open Modal */

function openModal(course) {

    if (!modal || !modalContent) return;

    modalContent.innerHTML = `

        <i class="${course.icon || ""} big-icon"></i>

        <h2>
            ${course.title || "Untitled Course"}
        </h2>

        <p>
            ${course.description || ""}
        </p>

        <a
            href="register.html?course=${encodeURIComponent(course.title || "")}"
            class="btn"
        >
            Register In This Course
        </a>

    `;

    modal.classList.add("open");

}


/* Close Modal */

function closeModal() {

    if (modal) {
        modal.classList.remove("open");
    }

}


if (modalClose) {
    modalClose.addEventListener("click", closeModal);
}


/* Close when clicking outside */

if (modal) {

    modal.addEventListener("click", (e) => {

        if (e.target === modal) {
            closeModal();
        }

    });

}


/* Close with Escape */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        closeModal();
    }

});


/* =====================================================
   5) Counters
   ==> setTimeout + setInterval
   ===================================================== */

const counters = document.querySelectorAll(".counter");


function startCounter(element) {

    const target = Number(element.dataset.target);

    if (!Number.isFinite(target) || target <= 0) {
        element.textContent = "0";
        return;
    }

    const duration = 2000;

    const step = Math.max(
        1,
        Math.ceil(target / (duration / 20))
    );

    let current = 0;

    const timer = setInterval(() => {

        current += step;

        if (current >= target) {

            current = target;

            clearInterval(timer);

        }

        element.textContent = current;

    }, 20);

}


/* Start counters after 500ms */

setTimeout(() => {

    counters.forEach(startCounter);

}, 500);


/* =====================================================
   6) Scroll Button
   ==> Conditions + Window Scrolling + Events
   ===================================================== */

const scrollBtn = document.getElementById("scroll-btn");


if (scrollBtn) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            scrollBtn.classList.add("show");

        } else {

            scrollBtn.classList.remove("show");

        }

    });


    scrollBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}
