'use strict';

const camelcase = require('lodash.camelcase');

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

const getPrompts = () => {

	const notEmpty = value => !!value.trim();

	return [
		{
			name: 'service',
			type: 'text',
			message: 'What\'s the event service? (in-dash-case)',
			validate: notEmpty && (value => !!value.match(/^[a-z0-9-]+$/))
		},
		{
			name: 'entity',
			type: 'text',
			message: 'What\'s the event entity?',
			validate: notEmpty,
			format: entity => camelcase(entity.trim())
		},
		{
			name: 'event',
			type: 'text',
			message: 'What\'s the event name?',
			validate: notEmpty,
			format: event => camelcase(event.trim())
		},
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
};

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
	promises.push(listenerSchemaFs.writeSchema(entity, event, schemaContent));

	// Listener Source
	const listenerSource = listenerSourceTemplate({ ...options });
	promises.push(listenerSourceFs.writeSource(entity, event, listenerSource));

	// Listener tests
	const listenerTest = listenerTestTemplate({ ...options });
	promises.push(listenerTestFs.writeTest(entity, event, listenerTest));

	// Serverless function configuration
	const serverlessFunction = serverlessFunctionTemplate({ ...options });
	promises.push(serverlessFunctionFs.writeFunction(serverlessFunction));

	// Wait every file to be generated
	await Promise.all(promises);

	// Open created files
	eventListenerFs.openFile(service, entity);
	listenerSchemaFs.openSchema(entity, event);
	listenerSourceFs.openSource(entity, event);
	listenerTestFs.openTest(entity, event);
	serverlessFunctionFs.openFile();
};
