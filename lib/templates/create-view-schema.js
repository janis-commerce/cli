'use strict';

const kebabcase = require('lodash.kebabcase');

const schemaBuilder = require('./create-edit-view-schema');

module.exports = options => schemaBuilder({
	...options,
	root: 'Create',
	target: {
		service: options.service,
		namespace: kebabcase(options.entity),
		method: 'create'
	}
});
