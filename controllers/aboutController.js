//! controllers/aboutController.js

export async function getAbout(req, res) {
	res.render('about', {
		title: 'Welcome to Expertise',
		styles: [],
		scripts: [],
	});
}
