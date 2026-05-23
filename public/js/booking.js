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
	const preselected =
	document.querySelector('meta[name="preselected-service"]')?.content || "";

	if (!serviceCards.length) return;

	function updateCarRentalPaymentState() {
		const rentalForm = document.querySelector("#form-rental form");
		if (!rentalForm) return;

		const regionSelect = rentalForm.querySelector('select[name="region"]');
		const paymentSummary = rentalForm.querySelector(
			"[data-montreal-payment-summary]"
		);
		const submitButton = rentalForm.querySelector("[data-region-submit-button]");
		const submitIcon = rentalForm.querySelector("[data-submit-icon]");
		const submitLabel = rentalForm.querySelector("[data-submit-label-text]");

		if (!regionSelect || !paymentSummary || !submitButton || !submitLabel) {
			return;
		}

		const isMontreal = regionSelect.value === "montreal";

		paymentSummary.classList.toggle("d-none", !isMontreal);
		submitLabel.textContent = isMontreal
			? submitButton.dataset.paymentLabel
			: submitButton.dataset.submitLabel;

		if (submitIcon) {
			submitIcon.classList.toggle("bi-credit-card", isMontreal);
			submitIcon.classList.toggle("bi-send", !isMontreal);
		}
	}

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
			updateCarRentalPaymentState();

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

	const rentalRegionSelect = document.querySelector(
		'#form-rental select[name="region"]'
	);

	if (rentalRegionSelect) {
		rentalRegionSelect.addEventListener("change", updateCarRentalPaymentState);
		updateCarRentalPaymentState();
	}

	// Auto-select if preselected route
	if (preselected) {
		const autoCard = document.querySelector(
			`.service-card[data-form="${preselected}"]`
		);

		if (autoCard) {
			selectService(autoCard);
		}
	}
});
