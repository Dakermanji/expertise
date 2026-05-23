//! public/js/cookie-consent.js

document.addEventListener("DOMContentLoaded", () => {
	const banner = document.querySelector("[data-cookie-consent]");
	if (!banner) return;

	const storageKey = "expertiseProCookieConsent";
	const existingChoice = localStorage.getItem(storageKey);

	function setPageLock(isLocked) {
		document.body.classList.toggle("cookie-consent-open", isLocked);
	}

	if (!existingChoice) {
		banner.hidden = false;
		setPageLock(true);
	}

	function saveChoice(choice) {
		localStorage.setItem(
			storageKey,
			JSON.stringify({
				choice,
				createdAt: new Date().toISOString(),
			})
		);
		banner.hidden = true;
		setPageLock(false);
	}

	banner
		.querySelector("[data-cookie-essential]")
		?.addEventListener("click", () => saveChoice("essential"));

	banner
		.querySelector("[data-cookie-accept]")
		?.addEventListener("click", () => saveChoice("all"));

	banner
		.querySelector("[data-cookie-details-toggle]")
		?.addEventListener("click", (event) => {
			const details = banner.querySelector("#cookieConsentDetails");
			if (!details) return;

			const isHidden = details.hidden;
			details.hidden = !isHidden;
			event.currentTarget.setAttribute("aria-expanded", String(isHidden));
		});

	banner
		.querySelector("[data-cookie-language-select]")
		?.addEventListener("change", (event) => {
			window.location.href = `/lang/${event.target.value}`;
		});
});
