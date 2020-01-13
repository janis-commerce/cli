'use strict';

const path = require('path');

const { writeYml, openFile } = require('./base');

const getRelativePath = (service, entity, event) => path.join('schemas/src/public/event-listeners', service, entity, event);

module.exports.writeSchema = (service, entity, event, content, needsChanges) => {
	return writeYml(getRelativePath(service, entity, event), content, needsChanges);
};

module.exports.openSchema = (service, entity, event) => {
	return openFile(getRelativePath(service, entity, `${event}.yml`));
};
