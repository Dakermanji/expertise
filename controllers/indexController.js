//! controllers/indexController.js

export function getHome(req, res) {
	res.render('home', {
		title: 'Welcome to Expertise',
		styles: ['home'],
		scripts: ['home'],
	});
}
