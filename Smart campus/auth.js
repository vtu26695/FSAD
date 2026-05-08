// Simple Authentication System - ES6 with Backend API

class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
        this.init();
    }

    init() {
        const pageName = window.location.pathname.split("/").pop() || "index.html";
        
        if (pageName === "login.html" || pageName === "") {
            this.setupLoginPage();
        } else if (pageName === "register.html") {
            this.setupRegisterPage();
        }
    }

    setupLoginPage() {
        const form = document.getElementById("loginForm");
        if (form) {
            form.addEventListener("submit", (e) => this.login(e));
        }
    }

    setupRegisterPage() {
        const form = document.getElementById("registerForm");
        if (form) {
            form.addEventListener("submit", (e) => this.register(e));
        }
    }

    async login(e) {
        e.preventDefault();
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            this.showToast("Please fill all fields", "error");
            return;
        }

        try {
            const response = await fetch("../api/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.currentUser = result.user;
                localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
                this.showToast("Login successful!", "success");

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 500);
            } else {
                this.showToast(result.error || "Invalid email or password", "error");
            }
        } catch (error) {
            this.showToast("Connection error. Please try again.", "error");
            console.error("Login error:", error);
        }
    }

    async register(e) {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!firstName || !lastName || !email || !studentId || !password || !confirmPassword) {
            this.showToast("Please fill all fields", "error");
            return;
        }

        if (password.length < 4) {
            this.showToast("Password must be at least 4 characters", "error");
            return;
        }

        if (password !== confirmPassword) {
            this.showToast("Passwords do not match", "error");
            return;
        }

        try {
            const response = await fetch("../api/register.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ firstName, lastName, email, studentId, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showToast("Account created! Redirecting to login...", "success");

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            } else {
                this.showToast(result.error || "Registration failed", "error");
            }
        } catch (error) {
            this.showToast("Connection error. Please try again.", "error");
            console.error("Registration error:", error);
        }
    }

    logout() {
        localStorage.removeItem("currentUser");
        this.currentUser = null;
        window.location.href = "login.html";
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    showToast(message, type) {
        const toast = document.getElementById("toast");
        if (!toast) return;

        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.authManager = new AuthManager();
});
