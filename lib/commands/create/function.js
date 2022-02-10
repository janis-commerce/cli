'use strict';

const promptFunctionName = require('../../prompts/function-name');
const promptFunctionDefaultPath = require('../../prompts/function-default-path');

const functionWithPayloadSchemaTemplate = require('../../templates/function-with-payload-schema');
const functionWithoutPayloadSchemaTemplate = require('../../templates/function-without-payload-schema');
const functionSchemaFs = require('../../fs/function-schema');

const functionSourceTemplate = require('../../templates/function-source');
const functionSourceFs = require('../../fs/function-source');

const functionTestTemplate = require('../../templates/function-test');
const functionTestFs = require('../../fs/function-test');

const { ensureOptions, notEmpty, upperCamelCase } = require('../../utils');
const { Report } = require('../../report');


const getPrompts = () => [

	promptFunctionName,
	promptFunctionDefaultPath,
	{
		name: 'functionNewPath',
		type: prev => (prev === true ? 'text' : null),
		message: 'What\'s the functión name?  (in-dash-case)',
		validate: notEmpty,
		format: functionName => upperCamelCase(functionName.trim())
	},
	{
		name: 'hasPayload',
		type: 'toggle',
		message: 'Does the function have a payload?',
		initial: true,
		active: 'yes',
		inactive: 'no'
	},
	{
		name: 'hasClient',
		type: prev => (prev === true ? 'toggle' : null),
		message: 'Must your function be invoked with a client',
		initial: true,
		active: 'yes',
		inactive: 'no'
	}
];

module.exports.command = 'create-function';

module.exports.describe = 'Create a new Lambda Function';

module.exports.builder = yargs => {

	return yargs
		.option('functionName', {
			alias: 'f',
			description: 'The function Name',
			type: 'string'
		})
		.help();
};

module.exports.handler = async argv => {

	const options = await ensureOptions(getPrompts(), argv);

	const {
		functionName, functionDefaultPath, functionNewPath, hasClient, hasPayload
	} = options;

	const functionPath = functionDefaultPath && functionNewPath;

	const promises = [];

	// Function Schema
	const schemaContent = hasPayload ? functionWithPayloadSchemaTemplate({ functionName }) : functionWithoutPayloadSchemaTemplate({ functionName });
	promises.push(functionSchemaFs.writeSchema(functionPath, functionName, schemaContent));

	// Function Source
	const sourceContent = functionSourceTemplate({ functionName, hasClient, hasPayload });
	promises.push(functionSourceFs.writeSource(functionPath, functionName, sourceContent));

	// Function Test
	const testContent = functionTestTemplate({ functionPath, functionName });
	promises.push(functionTestFs.writeTest(functionPath, functionName, testContent, true));

	// Wait every file to be generated
	await Promise.all(promises);

	await Report.finish();
};
