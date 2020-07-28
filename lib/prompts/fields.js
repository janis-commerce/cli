'use strict';

module.exports = {
	name: 'fields',
	type: 'list',
	message: 'List the entity fields (comma-separated)',
	format: fields => fields.filter(Boolean)
};
