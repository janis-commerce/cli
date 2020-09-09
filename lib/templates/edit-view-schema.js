'use strict';

const kebabcase = require('lodash.kebabcase');

const schemaBuilder = require('./create-edit-view-schema');

module.exports = options => schemaBuilder({
	...options,
	root: 'Edit',
	header: {
		title: {
			afterId: [{
				name: 'status',
				component: 'StatusChip',
				componentAttributes: {
					useTheme: true
				}
			}]
		}
	},
	source: {
		service: options.service,
		namespace: kebabcase(options.entity),
		method: 'get'
	},
	target: {
		service: options.service,
		namespace: kebabcase(options.entity),
		method: 'update'
	}
});
