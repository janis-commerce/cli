'use strict';

const path = require('path');

const { writeYml, openFile } = require('./base');

const getRelativePath = (entity, event) => path.join('schemas/src/public/event-listeners', entity, event);

module.exports.writeSchema = (entity, event, content) => {
	return writeYml(getRelativePath(entity, event), content);
};

module.exports.openSchema = (entity, event) => {
	return openFile(getRelativePath(entity, `${event}.yml`));
};
