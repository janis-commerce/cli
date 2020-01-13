'use strict';

const path = require('path');
const { inspect } = require('util');

const { writeYml, readYml, openFile, fileExists } = require('./base');

const getRelativePath = (service, entity) => path.join('events/src', service, entity);

module.exports.writeListener = async (service, entity, event, listener, needsChanges) => {

	const relativePath = getRelativePath(service, entity);

	let currentContent = [];

	if(await fileExists(`${relativePath}.yml`)) {
		currentContent = await readYml(relativePath);
		if(!Array.isArray(currentContent))
			throw new Error(`Invalid event subcription yml content. Expected an array, received ${inspect(currentContent)}`);
	}

	const currentListeners = currentContent.find(({
		service: currentService,
		entity: currentEntity,
		event: currentEvent
	}) => currentService === service && currentEntity === entity && currentEvent === event);

	if(!currentListeners) {
		currentContent.push({
			service,
			entity,
			event,
			listeners: [listener]
		});
	} else
		currentListeners.listeners.push(listener);

	return writeYml(relativePath, currentContent, needsChanges);
};

module.exports.openFile = (service, entity) => {
	return openFile(`${getRelativePath(service, entity)}.yml`);
};
