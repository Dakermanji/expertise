//! public/js/booking.js

document.querySelectorAll('.select-service').forEach((card) => {
	card.addEventListener('click', () => {
		const selected = card.dataset.form;

		document
			.querySelectorAll('.select-service')
			.forEach((c) => c.classList.remove('selected'));
		card.classList.add('selected');

		document
			.querySelectorAll('.booking-form')
			.forEach((form) => form.classList.add('d-none'));
		document.getElementById(`form-${selected}`).classList.remove('d-none');

		window.scrollTo({
			top: document.getElementById(`form-${selected}`).offsetTop - 100,
			behavior: 'smooth',
		});
	});
});
