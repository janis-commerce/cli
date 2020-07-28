'use strict';

module.exports = {
	name: 'method',
	type: 'autocomplete',
	message: 'What\'s the API HTTP method?',
	choices: [
		{ title: 'get' },
		{ title: 'post' },
		{ title: 'put' },
		{ title: 'patch' },
		{ title: 'delete' }
	],
	format: method => method.toLowerCase()
};
