'use strict';

const path = require('path');

const promptService = require('../../prompts/service');
const promptEntity = require('../../prompts/entity');
const promptEntityPlural = require('../../prompts/entity-plural');
const promptSecurity = require('../../prompts/security');
const promptFields = require('../../prompts/fields');
const promptSortableFields = require('../../prompts/sortable-fields');
const promptAvailableFilters = require('../../prompts/available-filters');
const promptAddViews = require('../../prompts/add-views');

const entityBaseSchemaTemplate = require('../../templates/entity-base-schema');
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
const viewSchemaFs = require('../../fs/view-schema');

const serverlessFunctionTemplate = require('../../templates/api-list-serverless-function');
const serverlessFunctionFs = require('../../fs/serverless-function');

const { ensureOptions } = require('../../utils');
const { Report } = require('../../report');

const getPrompts = () => [
	promptService,
	promptEntity,
	promptEntityPlural,
	promptSecurity,
	promptFields,
	promptSortableFields,
	promptAvailableFilters,
	promptAddViews
];

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

	const options = await ensureOptions(getPrompts(), argv);

	const { entity, addViews } = options;

	const promises = [];

	// Entity base Schema
	const baseSchemaPath = path.join(entity, 'base');
	const entityBaseContent = entityBaseSchemaTemplate({ ...options });

	promises.push(apiSchemaFs.writeSchemaIfDoesNotExist(baseSchemaPath, entityBaseContent, true));

	// API Schema
	const schemaPath = path.join(entity, 'list');
	const schemaContent = apiSchemaTemplate({ ...options });

	promises.push(apiSchemaFs.writeSchema(schemaPath, schemaContent, true));

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

	// View schema
	if(addViews) {
		const browseSchema = viewSchemaTemplate({ ...options });
		promises.push(viewSchemaFs.writeViewSchema(entity, 'browse', browseSchema));
	}

	// Serverless function configuration
	const serverlessFunction = serverlessFunctionTemplate({ ...options });

	promises.push(serverlessFunctionFs.writeFunction(serverlessFunction));

	// Wait every file to be generated
	await Promise.all(promises);

	await Report.finish();
};
