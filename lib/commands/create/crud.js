'use strict';

const promptService = require('../../prompts/service');
const promptEntity = require('../../prompts/entity');
const promptEntityPlural = require('../../prompts/entity-plural');
const promptAuth = require('../../prompts/auth');
const promptFields = require('../../prompts/fields');
const promptSortableFields = require('../../prompts/sortable-fields');
const promptAvailableFilters = require('../../prompts/available-filters');
const promptAddViews = require('../../prompts/add-views');

const apiList = require('./api-list');
const apiGet = require('./api-get');
const apiPost = require('./api-post');
const apiPut = require('./api-put');

const { ensureOptions } = require('../../utils');

const getPrompts = () => [
	promptService,
	promptEntity,
	promptEntityPlural,
	promptAuth,
	promptFields,
	promptSortableFields,
	promptAvailableFilters,
	promptAddViews
];

module.exports.command = 'create-crud';

module.exports.describe = 'Create an entity CRUD operations';

module.exports.builder = yargs => {

	return yargs
		.option('service', {
			alias: 's',
			description: 'The current service name (in dash case)',
			type: 'string'
		})
		.option('entity', {
			alias: 'e',
			description: 'The CRUD entity',
			type: 'string'
		})
		.help();
};

module.exports.handler = async argv => {

	const options = await ensureOptions(getPrompts(), argv);

	await apiList.handler(options);
	await apiGet.handler(options);
	await apiPost.handler(options);
	await apiPut.handler(options);
};
