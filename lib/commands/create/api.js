'use strict';

const path = require('path');
const prompts = require('prompts');

const { normalizePath } = require('../../utils');

const apiSchemaTemplate = require('../../templates/api-schema');
const apiSchemaFs = require('../../fs/api-schema');

const prompt = argv => {

	const notEmpty = value => !!value.trim();

	const promptsOptions = [
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

	return prompts(promptsOptions.map(promptsOption => {
		return {
			...promptsOption,
			initial: argv[promptsOption.name] || promptsOption.initial
		};
	}));
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
				type: 'string'
			},
			required: true,
			description: 'COMPLETE PARAMETER DESCRIPTION'
		}));
};

module.exports.command = 'create api';

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

	const options = await prompt(argv);

	const pathParameters = getPathParameters(options.path);

	const schemaPath = path.join(options.path, `${options.methodAlias}.yml`);

	const schemaContent = apiSchemaTemplate({
		...options,
		parameters: pathParameters
	});
	await apiSchemaFs.writeSchema(schemaPath, schemaContent);

	apiSchemaFs.openSchema(schemaPath);
};
