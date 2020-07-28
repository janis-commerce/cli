'use strict';

const path = require('path');

const promptPath = require('../../prompts/path');
const promptHttpMethod = require('../../prompts/http-method');
const promptMethodAlias = require('../../prompts/method-alias');
const promptSecurity = require('../../prompts/security');
const promptJanisNamespace = require('../../prompts/janis-namespace');
const promptJanisMethod = require('../../prompts/janis-method');

const { ensureOptions } = require('../../utils');

const apiSchemaTemplate = require('../../templates/api-schema');
const apiSchemaFs = require('../../fs/api-schema');

const apiSourceTemplate = require('../../templates/api-source');
const apiSourceFs = require('../../fs/api-source');

const apiTestTemplate = require('../../templates/api-test');
const apiTestFs = require('../../fs/api-test');

const serverlessFunctionTemplate = require('../../templates/api-serverless-function');
const serverlessFunctionFs = require('../../fs/serverless-function');

const { Report } = require('../../report');

const getPrompts = () => [
	promptPath,
	promptHttpMethod,
	promptMethodAlias,
	promptJanisNamespace,
	promptJanisMethod,
	promptSecurity
];

const getPathParameters = apiPath => {

	const matches = apiPath.match(/{\w+}/ig);

	if(!matches)
		return [];

	return matches
		.map(match => ({
			name: match.replace(/[{}]/g, ''),
			in: 'path',
			schema: {
				type: 'string',
				example: 'COMPLETE AN EXAMPLE'
			},
			required: true,
			description: 'COMPLETE PARAMETER DESCRIPTION'
		}));
};

module.exports.command = 'create-api';

module.exports.describe = 'Create a new API';

module.exports.builder = yargs => {

	return yargs
		.option('path', {
			alias: 'p',
			description: 'The API path',
			type: 'string'
		})
		.option('method', {
			alias: 'm',
			description: 'The API method',
			type: 'string'
		})
		.option('janis-namespace', {
			alias: 'ns',
			description: 'The API Janis Namespace',
			type: 'string'
		})
		.option('janis-method', {
			alias: 'mt',
			description: 'The API Janis Method',
			type: 'string'
		})
		.help();
};

module.exports.handler = async argv => {

	const options = await ensureOptions(getPrompts(), argv);

	const pathParameters = getPathParameters(options.path);

	const promises = [];

	// API Schema
	const schemaPath = path.join(options.path, options.methodAlias);
	const schemaContent = apiSchemaTemplate({
		...options,
		parameters: pathParameters,
		extraSchemaStuff: {
			components: {
				responses: {}
			}
		}
	});

	promises.push(apiSchemaFs.writeSchema(schemaPath, schemaContent, true));

	// API Source
	const sourcePath = path.join(options.path, options.methodAlias);
	const apiSource = apiSourceTemplate({ ...options });

	promises.push(apiSourceFs.writeSource(sourcePath, apiSource, true));

	// API Source
	const testPath = path.join(options.path, options.methodAlias);
	const apiTest = apiTestTemplate({
		...options,
		testPath,
		sourcePath
	});

	promises.push(apiTestFs.writeTest(testPath, apiTest, true));

	// Serverless function configuration
	const serverlessFunction = serverlessFunctionTemplate({ ...options });

	promises.push(serverlessFunctionFs.writeFunction(serverlessFunction));

	// Wait every file to be generated
	await Promise.all(promises);

	await Report.finish();
};
