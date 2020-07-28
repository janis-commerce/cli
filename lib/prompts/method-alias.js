'use strict';

module.exports = {
	name: 'methodAlias',
	type: 'autocomplete',
	message: 'What\'s the API method name?',
	choices: [
		{ title: 'list' },
		{ title: 'get' },
		{ title: 'post' },
		{ title: 'put' },
		{ title: 'patch' },
		{ title: 'delete' }
	],
	initial: prev => prev,
	format: methodAlias => methodAlias.toLowerCase()
};
