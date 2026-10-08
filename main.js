/* =====================================================
   1) Open & Close Menu
   ==> Conditions + Control CSS using JS
   ===================================================== */

const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {

    if (nav.style.maxHeight && nav.style.maxHeight !== "0px") {

        nav.style.maxHeight = "0px";

        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

    } else {

        nav.style.maxHeight = nav.scrollHeight + "px";

        menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    }

});


/* Close menu when clicking a link */

nav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

        if (window.innerWidth <= 800) {

            nav.style.maxHeight = "0px";

            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }

    });

});


/* Reset menu when screen becomes large */

window.addEventListener("resize", () => {

    if (window.innerWidth > 800) {

        nav.style.maxHeight = "";

        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

});


/* =====================================================
   2) Light / Dark Mode
   ==> Control HTML Attributes
   ===================================================== */

const themeBtn = document.getElementById("theme-btn");
const root = document.documentElement;


function applyTheme(theme) {

    root.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);

    if (theme === "dark") {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    }

}


/* Get saved theme */

const savedTheme = localStorage.getItem("theme") || "light";

applyTheme(savedTheme);


/* Change theme */

themeBtn.addEventListener("click", () => {

    const currentTheme = root.getAttribute("data-theme");

    if (currentTheme === "dark") {

        applyTheme("light");

    } else {

        applyTheme("dark");
    }

});


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

            throw new Error(
                "Request failed: " + response.status
            );
        }

        const data = await response.json();

        /* Store courses */

        courses = data.cards;

        /* Display courses */

        renderCourses(data.cards);

        /* Display testimonials */

        renderTestimonials(data.testimonials);

        /* Hide loading message */

        coursesStatus.style.display = "none";

    } catch (error) {

        coursesStatus.textContent =
            "Could not load courses. Please try again later.";

        console.error(error);
    }

}


/* =====================================================
   Display Courses
   ===================================================== */

function renderCourses(cards) {

    coursesGrid.innerHTML = cards
        .map((card, index) => {

            return `
                <div class="card">

                    <i class="${card.icon} card-icon"></i>

                    <h3>${card.title}</h3>

                    <p>
                        ${card.description}
                    </p>

                    <button
                        class="details-btn"
                        data-index="${index}"
                    >
                        View Details
                    </button>

                </div>
            `;

        })
        .join("");

}


/* =====================================================
   Display Testimonials
   ===================================================== */

function renderTestimonials(list) {

    testimonialsGrid.innerHTML = list
        .map((testimonial) => {

            return `
                <div class="card testimonial">

                    <i class="${testimonial.icon} quote-icon"></i>

                    <p>
                        ${testimonial.text}
                    </p>

                    <div class="user">

                        <i class="${testimonial.userIcon}"></i>

                        <div>

                            <strong>
                                ${testimonial.name}
                            </strong>

                            <br>

                            <span>
                                ${testimonial.role}
                            </span>

                        </div>

                    </div>

                </div>
            `;

        })
        .join("");

}


getData();


/* =====================================================
   4) API Specific Course Read
   ==> API Methods + find()
   ===================================================== */

const modal =
    document.getElementById("modal");

const modalContent =
    document.getElementById("modal-content");

const modalClose =
    document.getElementById("modal-close");


/* Event Delegation */

coursesGrid.addEventListener("click", (e) => {

    const btn =
        e.target.closest(".details-btn");

    if (!btn) return;


    const index =
        Number(btn.dataset.index);


    const course =
        courses.find((course, i) => i === index);


    if (course) {

        openModal(course);
    }

});


/* Open Modal */

function openModal(course) {

    modalContent.innerHTML = `

        <i class="${course.icon} big-icon"></i>

        <h2>
            ${course.title}
        </h2>

        <p>
            ${course.description}
        </p>

        <a
            href="register.html?course=${encodeURIComponent(course.title)}"
            class="btn"
        >
            Register In This Course
        </a>

    `;


    modal.classList.add("open");
}


/* Close Modal */

function closeModal() {

    modal.classList.remove("open");

}


modalClose.addEventListener("click", closeModal);


/* Close when clicking outside */

modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        closeModal();
    }

});


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

const counters =
    document.querySelectorAll(".counter");


function startCounter(element) {

    const target =
        Number(element.dataset.target);

    const duration = 2000;

    const step =
        Math.max(
            1,
            Math.floor(target / (duration / 20))
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

const scrollBtn =
    document.getElementById("scroll-btn");


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