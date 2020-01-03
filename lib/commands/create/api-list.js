'use strict';

const path = require('path');
const prompts = require('prompts');
const camelcase = require('lodash.camelcase');

const logger = require('lllog')();

const apiSchemaTemplate = require('../../templates/api-list-schema');
const apiSchemaFs = require('../../fs/api-schema');

const apiSourceTemplate = require('../../templates/api-list-source');
const apiSourceFs = require('../../fs/api-source');

const apiTestTemplate = require('../../templates/api-list-test');
const apiTestFs = require('../../fs/api-test');

const modelTemplate = require('../../templates/model');
const modelFs = require('../../fs/model');

const modelTestTemplate = require('../../templates/model-test');
const modelTestFs = require('../../fs/model-test');

const viewSchemaTemplate = require('../../templates/browse-view-schema');
const viewSchemaFs = require('../../fs/browse-view-schema');

const serverlessFunctionTemplate = require('../../templates/api-list-serverless-function');
const serverlessFunctionFs = require('../../fs/serverless-function');

const prompt = argv => {

	const notEmpty = value => !!value.trim();

	const fieldsToChoices = (_, { fields }) => fields.map(f => ({ title: f, value: f }));

	const promptsOptions = [
		{
			name: 'service',
			type: 'text',
			message: 'What\'s the service name? (in-dash-case)',
			validate: notEmpty && (value => !!value.match(/^[a-z0-9-]+$/))
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
			initial: prev => prev,
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

	return prompts(promptsOptions.map(promptsOption => {
		return {
			...promptsOption,
			initial: argv[promptsOption.name] || promptsOption.initial
		};
	}), {
		onCancel: () => {
			logger.info('Operation cancelled');
			process.exit(0);
		}
	});
};

module.exports.command = 'create-api-list';

module.exports.describe = 'Create a new API List';

module.exports.builder = yargs => {

	return yargs
		.option('service', {
			alias: 's',
			description: 'The current service name (in dash case)',
			type: 'string'
		})
		.option('entity', {
			alias: 'e',
			description: 'The API List entity',
			type: 'string'
		})
		.help();
};

module.exports.handler = async argv => {

	const options = await prompt(argv);

	const { entity } = options;

	const promises = [];

	// API Schema
	const schemaPath = path.join(entity, 'list');
	const schemaContent = apiSchemaTemplate({ ...options });

	promises.push(apiSchemaFs.writeSchema(schemaPath, schemaContent));

	// API Source
	const sourcePath = path.join(entity, 'list');
	const apiSource = apiSourceTemplate({ ...options });

	promises.push(apiSourceFs.writeSource(sourcePath, apiSource));

	// API tests
	const testPath = path.join(entity, 'list');
	const apiTest = apiTestTemplate({
		...options,
		testPath,
		sourcePath
	});

	promises.push(apiTestFs.writeTest(testPath, apiTest));

	// Model
	const model = modelTemplate({ ...options });

	promises.push(modelFs.writeModelIfDoesNotExist(entity, model));

	// Model tests
	const modelTest = modelTestTemplate({ ...options });

	promises.push(modelTestFs.writeTestIfDoesNotExist(entity, modelTest));

	// Browse view schema
	const browseSchema = viewSchemaTemplate({ ...options });

	promises.push(viewSchemaFs.writeSchema(entity, browseSchema));

	// Serverless function configuration
	const serverlessFunction = serverlessFunctionTemplate({ ...options });

	promises.push(serverlessFunctionFs.writeFunction(serverlessFunction));

	// Wait every file to be generated
	await Promise.all(promises);

	// Open created files
	apiSchemaFs.openSchema(schemaPath);
	apiSourceFs.openSource(sourcePath);
	apiTestFs.openTest(testPath);
	modelFs.openModel(entity);
	modelTestFs.openTest(entity);
	viewSchemaFs.openSchema(entity);
	serverlessFunctionFs.openFile(entity);
};
