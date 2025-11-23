//! public/js/booking.js

/**
 * Booking Page Interaction Script
 * -------------------------------
 * Handles:
 *  - Service card selection
 *  - Toggle between Rental / Improvement forms
 *  - Keyboard accessibility (Enter + Space)
 *  - ARIA state updates for screen readers
 */

document.addEventListener("DOMContentLoaded", () => {
	const serviceCards = document.querySelectorAll(".service-card");
	const forms = document.querySelectorAll(".booking-form");


	if (!serviceCards.length) return;

	// Helper: select a booking service
	function selectService(card) {
		const selectedForm = card.dataset.form;

		// Remove selection from all cards
		serviceCards.forEach((c) => {
			c.classList.remove("selected");
			c.setAttribute("aria-pressed", "false");
		});

		// Apply selection to clicked card
		card.classList.add("selected");
		card.setAttribute("aria-pressed", "true");

		// Hide all forms
		forms.forEach((form) => form.classList.add("d-none"));

		// Show the correct form
		const targetForm = document.getElementById(`form-${selectedForm}`);
		if (targetForm) {
			targetForm.classList.remove("d-none");

			// Smooth scroll to the form
			targetForm.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
	}

	// Attach click + keyboard handlers
	serviceCards.forEach((card) => {
		// Mouse click
		card.addEventListener("click", () => selectService(card));

		// Keyboard interaction (space / enter)
		card.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				selectService(card);
			}
		});
	});
});
