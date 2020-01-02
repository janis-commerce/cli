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

const prompt = argv => {

	const notEmpty = value => !!value.trim();

	const promptsOptions = [
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
	const schemaPath = path.join(entity, 'list.yml');
	const schemaContent = apiSchemaTemplate({ ...options });

	promises.push(apiSchemaFs.writeSchema(schemaPath, schemaContent));

	// API Source
	const sourcePath = path.join(entity, 'list.js');
	const apiSource = apiSourceTemplate({ ...options });

	promises.push(apiSourceFs.writeSource(sourcePath, apiSource));

	// API Source
	const testPath = path.join(entity, 'list.js');
	const apiTest = apiTestTemplate({
		...options,
		testPath,
		sourcePath
	});

	promises.push(apiTestFs.writeTest(testPath, apiTest));

	// Model
	const model = modelTemplate({ entity });

	promises.push(modelFs.writeModelIfDoesNotExist(entity, model));

	// Model
	const modelTest = modelTestTemplate({ entity });

	promises.push(modelTestFs.writeTestIfDoesNotExist(entity, modelTest));

	await Promise.all(promises);

	// Open created files
	apiSchemaFs.openSchema(schemaPath);
	apiSourceFs.openSource(sourcePath);
	apiTestFs.openTest(testPath);
	modelFs.openModel(entity);
	modelTestFs.openTest(entity);
};
