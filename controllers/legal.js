//! controllers/legal.js

const LEGAL_PAGE_SLUGS = ['privacy', 'cookies', 'terms', 'cancellation-refund'];

export function getLegalPage(req, res) {
	if (!LEGAL_PAGE_SLUGS.includes(req.params.page)) {
		return res.status(404).render('error', {
			title: 'error',
			message: res.__('legal.not_found'),
		});
	}

	const page = res.__('legal.pages.' + req.params.page);

	if (!page || typeof page !== 'object') {
		return res.status(404).render('error', {
			title: 'error',
			message: res.__('legal.not_found'),
		});
	}

	return res.render('legal', {
		title: 'legal',
		styles: ['legal'],
		page,
	});
}
