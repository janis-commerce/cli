'use strict';

const promptService = require('../../prompts/service');
const promptEventEntity = require('../../prompts/event-entity');
const promptEventName = require('../../prompts/event-name');

const eventListenerTemplate = require('../../templates/event-listener');
const eventListenerFs = require('../../fs/event-listener');

const listenerSchemaTemplate = require('../../templates/event-listener-schema');
const listenerSchemaFs = require('../../fs/event-listener-schema');

const listenerSourceTemplate = require('../../templates/event-listener-source');
const listenerSourceFs = require('../../fs/event-listener-source');

const listenerTestTemplate = require('../../templates/event-listener-test');
const listenerTestFs = require('../../fs/event-listener-test');

const serverlessFunctionTemplate = require('../../templates/event-listener-serverless-function');
const serverlessFunctionFs = require('../../fs/serverless-function');

const { ensureOptions } = require('../../utils');
const { Report } = require('../../report');

const getPrompts = () => [
	promptService,
	promptEventEntity,
	promptEventName,
	{
		name: 'mustHaveClient',
		type: 'toggle',
		message: 'Must the event have a client?',
		initial: true,
		active: 'yes',
		inactive: 'no'
	},
	{
		name: 'mustHaveId',
		type: 'toggle',
		message: 'Must the event have an ID?',
		initial: true,
		active: 'yes',
		inactive: 'no'
	}
];

module.exports.command = 'create-event-listener';

module.exports.describe = 'Create a new Event Listener';

module.exports.builder = yargs => {

	return yargs
		.option('service', {
			alias: 's',
			description: 'The event source service',
			type: 'string'
		})
		.option('entity', {
			alias: 'e',
			description: 'The event entity',
			type: 'string'
		})
		.option('event', {
			alias: 'en',
			description: 'The event name',
			type: 'string'
		})
		.help();
};

module.exports.handler = async argv => {

	const options = await ensureOptions(getPrompts(), argv);

	const { service, entity, event } = options;

	const promises = [];

	// Event subscription
	const eventListenerContent = eventListenerTemplate({ ...options });
	promises.push(eventListenerFs.writeListener(service, entity, event, eventListenerContent));

	// Listener Schema
	const schemaContent = listenerSchemaTemplate({ ...options });
	promises.push(listenerSchemaFs.writeSchema(service, entity, event, schemaContent));

	// Listener Source
	const listenerSource = listenerSourceTemplate({ ...options });
	promises.push(listenerSourceFs.writeSource(service, entity, event, listenerSource, true));

	// Listener tests
	const listenerTest = listenerTestTemplate({ ...options });
	promises.push(listenerTestFs.writeTest(service, entity, event, listenerTest, true));

	// Serverless function configuration
	const serverlessFunction = serverlessFunctionTemplate({ ...options });
	promises.push(serverlessFunctionFs.writeFunction(serverlessFunction));

	// Wait every file to be generated
	await Promise.all(promises);

	await Report.finish();
};
