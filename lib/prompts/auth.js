'use strict';

module.exports = {
	name: 'auth',
	type: 'select',
	message: 'Select the authentication method',
	choices: [
		{ title: 'Api Key, Api Secret and Janis Client', value: 'full' },
		{ title: 'Api Key and Api Secret', value: 'core' },
		{ title: 'No auth', value: 'none' }
	]
};
