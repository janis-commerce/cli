'use strict';

const kebabcase = require('lodash.kebabcase');

const schemaBuilder = require('./create-edit-view-schema');

module.exports = options => schemaBuilder({
	...options,
	root: 'Edit',
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
