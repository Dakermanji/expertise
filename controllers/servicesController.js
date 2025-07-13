//! controllers/servicesController.js

export function getServices(req, res) {
	res.render('services', {
		title: 'Our Services',
		styles: ['services'],
		scripts: [],
	});
}
