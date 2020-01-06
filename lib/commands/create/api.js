'use strict';

const path = require('path');

const { normalizePath, ensureOptions } = require('../../utils');

const apiSchemaTemplate = require('../../templates/api-schema');
const apiSchemaFs = require('../../fs/api-schema');

const apiSourceTemplate = require('../../templates/api-source');
const apiSourceFs = require('../../fs/api-source');

const apiTestTemplate = require('../../templates/api-test');
const apiTestFs = require('../../fs/api-test');

const getPrompts = () => {

	const notEmpty = value => !!value.trim();

	return [
		{
			name: 'path',
			type: 'text',
			message: 'What\'s the API path?',
			validate: notEmpty,
			format: userPath => normalizePath(userPath)
		},
		{
			name: 'method',
			type: 'autocomplete',
			message: 'What\'s the API HTTP method?',
			choices: [
				{ title: 'get' },
				{ title: 'post' },
				{ title: 'put' },
				{ title: 'patch' },
				{ title: 'delete' }
			],
			format: method => method.toLowerCase()
		},
		{
			name: 'methodAlias',
			type: 'autocomplete',
			message: 'What\'s the API method name?',
			choices: [
				{ title: 'list' },
				{ title: 'get' },
				{ title: 'post' },
				{ title: 'put' },
				{ title: 'patch' },
				{ title: 'delete' }
			],
			initial: prev => prev,
			format: methodAlias => methodAlias.toLowerCase()
		},
		{
			name: 'janisNamespace',
			type: 'text',
			message: 'What\'s the API JANIS Namespace?',
			validate: notEmpty
		},
		{
			name: 'janisMethod',
			type: 'text',
			message: 'What\'s the API JANIS Method?',
			validate: notEmpty
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
};

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
			description: 'The API JANIS Namespace',
			type: 'string'
		})
		.option('janis-method', {
			alias: 'mt',
			description: 'The API JANIS Method',
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
		parameters: pathParameters
	});

	promises.push(apiSchemaFs.writeSchema(schemaPath, schemaContent));

	// API Source
	const sourcePath = path.join(options.path, options.methodAlias);
	const apiSource = apiSourceTemplate({ ...options });

	promises.push(apiSourceFs.writeSource(sourcePath, apiSource));

	// API Source
	const testPath = path.join(options.path, options.methodAlias);
	const apitest = apiTestTemplate({
		...options,
		testPath,
		sourcePath
	});

	promises.push(apiTestFs.writeTest(testPath, apitest));

	await Promise.all(promises);

	// Open created files
	apiSchemaFs.openSchema(schemaPath);
	apiSourceFs.openSource(sourcePath);
	apiTestFs.openTest(testPath);
};
