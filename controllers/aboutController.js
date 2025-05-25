//! controllers/aboutController.js

export function getAbout(req, res) {
	res.render('about', {
		title: 'Welcome to Expertise',
		styles: [],
		scripts: [],
	});
}
