
/* Menu */

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
}

/* Light / Dark Mode */

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

const savedTheme = localStorage.getItem("theme") || "light";

applyTheme(savedTheme);

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");

        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
}

/* Get Courses From API */

const API_URL = "https://sphinx-public-api.vercel.app/get-data";
const courseSelect = document.getElementById("course");

async function getCourses() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load courses");
        }

        const data = await response.json();

        data.cards.forEach((course) => {
            const option = document.createElement("option");

            option.value = course.title;
            option.textContent = course.title;

            courseSelect.appendChild(option);
        });

        /* Get selected course from URL */

        const params = new URLSearchParams(window.location.search);
        const selectedCourse = params.get("course");

        if (selectedCourse) {
            courseSelect.value = selectedCourse;
        }
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

getCourses();

/* Validation */

const form = document.getElementById("register-form");
const successMsg = document.getElementById("form-success");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

/* Set field state */

function setState(input, message) {
    const field = input.closest(".field");
    const error = field.querySelector(".error");

    if (message) {
        field.classList.add("invalid");
        field.classList.remove("valid");
        error.textContent = message;

        return false;
    }

    field.classList.remove("invalid");
    field.classList.add("valid");
    error.textContent = "";

    return true;
}

/* Name Validation */

function validateName() {
    const value = nameInput.value.trim();

    if (value.length < 3) {
        return setState(
            nameInput,
            "Name must be at least 3 characters"
        );
    }

    return setState(nameInput, "");
}

/* Email Validation */

function validateEmail() {
    const value = emailInput.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pattern.test(value)) {
        return setState(
            emailInput,
            "Enter a valid email"
        );
    }

    return setState(emailInput, "");
}

/* Phone Validation */

function validatePhone() {
    const value = phoneInput.value.trim();
    const pattern = /^01[0125][0-9]{8}$/;

    if (!pattern.test(value)) {
        return setState(
            phoneInput,
            "Enter a valid Egyptian phone number"
        );
    }

    return setState(phoneInput, "");
}

/* Course Validation */

function validateCourse() {
    if (courseSelect.value === "") {
        return setState(
            courseSelect,
            "Please choose a course"
        );
    }

    return setState(courseSelect, "");
}

/* Validate While Typing */

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
courseSelect.addEventListener("change", validateCourse);

/* Submit Event */

form.addEventListener("submit", (e) => {
    e.preventDefault();

    successMsg.textContent = "";

    const results = [
        validateName(),
        validateEmail(),
        validatePhone(),
        validateCourse()
    ];

    if (results.every(Boolean)) {
        successMsg.textContent =
            `Thanks ${nameInput.value.trim()}! You're registered in "${courseSelect.value}".`;

        form.reset();

        form.querySelectorAll(".field").forEach((field) => {
            field.classList.remove("valid", "invalid");

            const error = field.querySelector(".error");

            if (error) {
                error.textContent = "";
            }
        });

        setTimeout(() => {
            successMsg.textContent = "";
        }, 5000);
    }
});
