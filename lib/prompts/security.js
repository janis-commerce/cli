'use strict';

module.exports = {
	name: 'security',
	type: 'multiselect',
	message: 'What are the API security requirements?',
	choices: [
		{ title: 'API Key and Secret', value: { ApiKey: [], ApiSecret: [] } },
		{ title: 'Janis Client', value: { JanisClient: [] } }
	],
	format: security => (security.length ? [security.reduce((acum, securityItem) => {
		return {
			...acum,
			...securityItem
		};
	}, {})] : [])
};
