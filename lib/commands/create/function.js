'use strict';

const functionSchemaTemplate = require('../../templates/function-schema');
const functionSchemaFs = require('../../fs/function-schema');

const functionSourceTemplate = require('../../templates/function-source');
const functionSourceFs = require('../../fs/function-source');

const functionTestTemplate = require('../../templates/function-test');
const functionTestFs = require('../../fs/function-test');

const { ensureOptions, notEmpty, areLettersAndNumbers, upperCamelCase } = require('../../utils');
const { Report } = require('../../report');


const getPrompts = () => [

	{
		name: 'functionName',
		type: 'text',
		message: 'What\'s the function name?  (in-dash-case)',
		validate: notEmpty && areLettersAndNumbers,
		format: functionName => upperCamelCase(functionName.trim())
	},
	{
		type: 'select',
		name: 'useDefaultPath',
		message: 'Use the default path?',
		choices: [
			{ title: 'Yes', description: '/src/lambda/{FunctionName}.js', value: true },
			{ title: 'No', description: 'Add a new path: /src/lambda/{path}/{FunctionName}.js', value: false }
		],
		initial: 0
	},
	{
		name: 'functionNewPath',
		type: prev => (prev === false ? 'text' : null),
		message: 'What\'s the function path?',
		validate: notEmpty,
		format: functionName => upperCamelCase(functionName.trim())
	},
	{
		name: 'hasPayload',
		type: 'toggle',
		message: 'The function will have payload?',
		initial: true,
		active: 'yes',
		inactive: 'no'
	},
	{
		name: 'hasClient',
		type: 'toggle',
		message: 'Must your function be invoked with a client?',
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
		functionName, useDefaultPath, functionNewPath, hasClient, hasPayload
	} = options;

	const functionPath = useDefaultPath ? '' : functionNewPath;

	const promises = [];

	// Function Schema
	const schemaContent = functionSchemaTemplate({ functionName, hasPayload });
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
