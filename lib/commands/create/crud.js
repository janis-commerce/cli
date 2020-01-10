'use strict';

const camelcase = require('lodash.camelcase');

const apiList = require('./api-list');
const apiGet = require('./api-get');
const apiPost = require('./api-post');
const apiPut = require('./api-put');

const { ensureOptions } = require('../../utils');

const getPrompts = () => {

	/* istanbul ignore next */
	const notEmpty = value => !!value.trim();

	const fieldsToChoices = (_, { fields }) => fields.map(f => ({ title: f, value: f }));

	return [
		{
			name: 'service',
			type: 'text',
			message: 'What\'s the service name? (in-dash-case)',
			validate: /* istanbul ignore next */notEmpty && (value => !!value.match(/^[a-z0-9-]+$/))
		},
		{
			name: 'entity',
			type: 'text',
			message: 'What\'s the entity?',
			validate: notEmpty,
			format: entity => camelcase(entity.trim())
		},
		{
			name: 'security',
			type: 'multiselect',
			message: 'What are the API security requirements?',
			choices: [
				{ title: 'API Key and Secret', value: { ApiKey: [], ApiSecret: [] } },
				{ title: 'JANIS Client header', value: { JanisClient: [] } }
			],
			format: security => (security.length ? [security.reduce((acum, securityItem) => {
				return {
					...acum,
					...securityItem
				};
			}, {})] : [])
		},
		{
			name: 'fields',
			type: 'list',
			message: 'List the entity fields (comma-separated)',
			format: fields => fields.filter(Boolean)
		},
		{
			name: 'sortableFields',
			type: 'multiselect',
			message: 'Which fields will be sortable?',
			choices: fieldsToChoices,
			format: fields => fields.filter(Boolean)
		},
		{
			name: 'availableFilters',
			type: 'multiselect',
			message: 'Which fields will be filtrable?',
			choices: fieldsToChoices,
			format: fields => fields.filter(Boolean)
		}
	];
};

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
