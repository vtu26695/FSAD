// Event Management System - ES6 Implementation with Authentication

class EventManager {
    constructor() {
        this.checkAuthentication();
        this.events = [];
        this.filteredEvents = [];
        this.currentFilter = "all";
        this.editingEventId = null;
        this.init();
    }

    checkAuthentication() {
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            window.location.href = "login.html";
            return;
        }
    }

    init() {
        this.cacheDOMElements();
        this.updateUserProfile();
        this.attachEventListeners();
        this.loadEvents();
    }

    async loadEvents() {
        try {
            const response = await fetch("../api/events.php");
            if (response.ok) {
                this.events = await response.json();
                this.render();
            } else {
                this.showToast("Failed to load events", "error");
            }
        } catch (error) {
            this.showToast("Connection error while loading events", "error");
            console.error("Load events error:", error);
        }
    }

    // Update user profile display
    updateUserProfile() {
        const user = window.authManager.getCurrentUser();
        if (!user) return;

        const userNameEl = document.getElementById("userName");
        const userEmailEl = document.getElementById("userEmail");
        const studentIdEl = document.getElementById("studentIdDisplay");
        const userAvatarEl = document.getElementById("userAvatar");
        const logoutBtn = document.getElementById("logoutBtn");

        if (userNameEl) userNameEl.textContent = `${user.firstName} ${user.lastName}`;
        if (userEmailEl) userEmailEl.textContent = user.email;
        if (studentIdEl) studentIdEl.textContent = user.studentId;
        if (userAvatarEl) userAvatarEl.textContent = this.getInitials(user.firstName, user.lastName);
        
        // Logout handler
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                if (confirm("Are you sure you want to logout?")) {
                    window.authManager.logout();
                }
            };
        }
        
        // Profile dropdown toggle
        const profileBtn = document.getElementById("profileBtn");
        if (profileBtn && !profileBtn.dataset.listenerAdded) {
            profileBtn.dataset.listenerAdded = 'true';
            profileBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const dropdown = document.getElementById("profileDropdown");
                if (dropdown) dropdown.classList.toggle("active");
            });
        }
    }

    // Get initials for avatar
    getInitials(firstName, lastName) {
        return (firstName?.charAt(0) || "U") + (lastName?.charAt(0) || "");
    }

    // Cache DOM elements
    cacheDOMElements() {
        this.modal = document.getElementById("eventModal");
        this.detailsModal = document.getElementById("detailsModal");
        this.form = document.getElementById("eventForm");
        this.eventsContainer = document.getElementById("eventsContainer");
        this.eventCountSpan = document.getElementById("eventCount");
        this.addEventBtn = document.getElementById("addEventBtn");
        this.cancelBtn = document.getElementById("cancelBtn");
        this.detailsCloseBtn = document.getElementById("detailsCloseBtn");
        this.searchInput = document.getElementById("searchInput");
        this.toast = document.getElementById("toast");
        this.navButtons = document.querySelectorAll(".nav-btn");
        this.modalTitle = document.getElementById("modalTitle");
        this.logoutBtn = document.getElementById("logoutBtn"); // Will be handled by profile click
        this.formInputs = {
            title: document.getElementById("eventTitle"),
            date: document.getElementById("eventDate"),
            time: document.getElementById("eventTime"),
            location: document.getElementById("eventLocation"),
            category: document.getElementById("eventCategory"),
            description: document.getElementById("eventDescription"),
            capacity: document.getElementById("eventCapacity"),
            organizer: document.getElementById("eventOrganizer")
        };
    }

    // Attach event listeners
    attachEventListeners() {
        this.addEventBtn.addEventListener("click", () => this.openAddModal());
        this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
        this.cancelBtn.addEventListener("click", () => this.closeModal());
        this.detailsCloseBtn.addEventListener("click", () => this.closeDetailsModal());
        
        // Logout handled by profile dropdown click event (in updateUserProfile)

        document.querySelectorAll(".close-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                if (e.target.closest("#eventModal")) this.closeModal();
                if (e.target.closest("#detailsModal")) this.closeDetailsModal();
            });
        });

        this.navButtons.forEach(btn => {
            btn.addEventListener("click", (e) => this.handleFilterChange(e));
        });

        this.searchInput.addEventListener("input", (e) => this.handleSearch(e));

        window.addEventListener("click", (e) => {
            if (e.target === this.modal) this.closeModal();
            if (e.target === this.detailsModal) this.closeDetailsModal();
        });
    }

    // Handle form submission
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const user = window.authManager.getCurrentUser();
        const defaultOrganizer = `${user.firstName} ${user.lastName}`;

        const eventData = {
            title: this.formInputs.title.value,
            date: this.formInputs.date.value,
            time: this.formInputs.time.value,
            location: this.formInputs.location.value,
            category: this.formInputs.category.value,
            description: this.formInputs.description.value,
            capacity: parseInt(this.formInputs.capacity.value) || 100,
            organizer: this.formInputs.organizer.value || defaultOrganizer,
            createdBy: user.id
        };

        try {
            if (this.editingEventId) {
                // Update event
                const response = await fetch("../api/events.php", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...eventData,
                        id: this.editingEventId
                    })
                });

                if (response.ok) {
                    this.showToast("Event updated successfully!", "success");
                } else {
                    this.showToast("Failed to update event", "error");
                    return;
                }
            } else {
                // Create new event
                const response = await fetch("../api/events.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(eventData)
                });

                if (response.ok) {
                    this.showToast("Event created successfully!", "success");
                } else {
                    this.showToast("Failed to create event", "error");
                    return;
                }
            }

            this.closeModal();
            await this.loadEvents();
        } catch (error) {
            this.showToast("Connection error. Please try again.", "error");
            console.error("Form submission error:", error);
        }
    }

    // Open add event modal
    openAddModal() {
        this.editingEventId = null;
        this.modalTitle.textContent = "Create New Event";
        this.form.reset();
        this.modal.classList.add("active");
    }

    // Open edit modal
    openEditModal(eventId) {
        this.editingEventId = eventId;
        const event = this.events.find(e => e.id === eventId);
        
        if (event) {
            this.modalTitle.textContent = "Edit Event";
            this.formInputs.title.value = event.title;
            this.formInputs.date.value = event.date;
            this.formInputs.time.value = event.time;
            this.formInputs.location.value = event.location;
            this.formInputs.category.value = event.category;
            this.formInputs.description.value = event.description;
            this.formInputs.capacity.value = event.capacity;
            this.formInputs.organizer.value = event.organizer;
            this.modal.classList.add("active");
        }
    }

    // Close modal
    closeModal() {
        this.modal.classList.remove("active");
        this.form.reset();
        this.editingEventId = null;
    }

    // Show event details
    showEventDetails(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const detailsContent = document.getElementById("detailsContent");
        const registrationPercentage = event.capacity > 0 
            ? Math.round((event.registrations / event.capacity) * 100) 
            : 0;

        const details = `<div class="details-info">
                <div class="info-row">
                    <span class="info-label">📅 Date & Time</span>
                    <span class="info-value">${this.formatDateAndTime(event.date, event.time)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📍 Location</span>
                    <span class="info-value">${event.location}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🏷️ Category</span>
                    <span class="info-value" style="text-transform: capitalize;">${event.category}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">👤 Organizer</span>
                    <span class="info-value">${event.organizer}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📝 Description</span>
                    <span class="info-value">${event.description || "No description provided"}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">👥 Registrations</span>
                    <span class="info-value">${event.registrations}${event.capacity ? " / " + event.capacity : ""}</span>
                </div>
            </div>`;

        detailsContent.innerHTML = details;
        document.getElementById("detailsTitle").textContent = event.title;
        
        document.getElementById("registerBtn").onclick = () => this.registerForEvent(eventId);
        
        this.detailsModal.classList.add("active");
    }

    // Close details modal
    closeDetailsModal() {
        this.detailsModal.classList.remove("active");
    }

    // Register for event
    registerForEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        if (event.capacity && event.registrations >= event.capacity) {
            this.showToast("Event is full!", "warning");
            return;
        }

        event.registrations++;
        this.saveToLocalStorage();
        this.showToast("Successfully registered for the event!", "success");
        this.showEventDetails(eventId);
    }

    // Delete event
    async deleteEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        const user = window.authManager.getCurrentUser();

        if (event.createdBy !== user.id) {
            this.showToast("You can only delete events you created!", "error");
            return;
        }

        if (confirm("Are you sure you want to delete this event?")) {
            try {
                const response = await fetch("../api/events.php", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: eventId, createdBy: user.id })
                });

                if (response.ok) {
                    this.showToast("Event deleted successfully!", "success");
                    await this.loadEvents();
                } else {
                    this.showToast("Failed to delete event", "error");
                }
            } catch (error) {
                this.showToast("Connection error. Please try again.", "error");
                console.error("Delete error:", error);
            }
        }
    }

    // Handle filter change
    handleFilterChange(e) {
        this.navButtons.forEach(btn => btn.classList.remove("active"));
        e.target.closest(".nav-btn").classList.add("active");
        
        this.currentFilter = e.target.closest(".nav-btn").dataset.filter;
        this.filteredEvents = this.getFilteredEvents();
        this.render();
    }

    // Handle search
    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        this.filteredEvents = this.events.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm)
        );

        if (this.currentFilter !== "all") {
            this.filteredEvents = this.filteredEvents.filter(e => e.category === this.currentFilter);
        }

        this.render();
    }

    // Get filtered events
    getFilteredEvents() {
        if (this.currentFilter === "all") {
            return this.events;
        }
        return this.events.filter(e => e.category === this.currentFilter);
    }

    // Render events
    render() {
        this.filteredEvents = this.getFilteredEvents();
        this.eventCountSpan.textContent = this.events.length;

        if (this.filteredEvents.length === 0) {
            this.eventsContainer.innerHTML = "<div class=\"empty-state\"><p>📭 No events found. Create one to get started!</p></div>";
            return;
        }

        this.eventsContainer.innerHTML = this.filteredEvents
            .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
            .map(event => this.createEventCard(event))
            .join("");

        this.attachCardListeners();
    }

    // Create event card HTML
    createEventCard(event) {
        const user = window.authManager.getCurrentUser();
        const isOwnEvent = event.createdBy === user.id;

        return `<div class="event-card">
                <div class="event-header">
                    <span class="event-category">${event.category.toUpperCase()}</span>
                    <h3 class="event-title">${event.title}</h3>
                </div>
                <div class="event-body">
                    <div class="event-meta time">
                        🕐 ${this.formatDateAndTime(event.date, event.time)}
                    </div>
                    <div class="event-meta location">
                        📍 ${event.location}
                    </div>
                    ${event.description ? `<p class="event-description">${event.description}</p>` : ""}
                    <div class="event-organizer">
                        👤 Organizer: ${event.organizer}
                    </div>
                    ${event.capacity ? `<div style="color: #718096; font-size: 0.85rem;">
                        Registrations: ${event.registrations}/${event.capacity}
                    </div>` : ""}
                </div>
                <div class="event-footer">
                    <button class="btn btn-primary view-btn" data-id="${event.id}">View Details</button>
                    ${isOwnEvent ? `<button class="btn btn-edit edit-btn" data-id="${event.id}">Edit</button>` : ""}
                    ${isOwnEvent ? `<button class="btn btn-danger delete-btn" data-id="${event.id}">Delete</button>` : ""}
                </div>
            </div>`;
    }

    // Attach listeners to event cards
    attachCardListeners() {
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", () => this.showEventDetails(parseInt(btn.dataset.id)));
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => this.openEditModal(parseInt(btn.dataset.id)));
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => this.deleteEvent(parseInt(btn.dataset.id)));
        });
    }

    // Show toast notification
    showToast(message, type = "info") {
        this.toast.textContent = message;
        this.toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            this.toast.classList.remove("show");
        }, 3000);
    }

    // Format date and time
    formatDateAndTime(date, time) {
        const eventDate = new Date(`${date}T${time}`);
        const options = { 
            weekday: "short", 
            year: "numeric", 
            month: "short", 
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };
        return eventDate.toLocaleDateString("en-US", options);
    }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    new EventManager();
});
