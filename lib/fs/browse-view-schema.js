'use strict';

const path = require('path');

const { writeYml, openFile } = require('./base');

module.exports.writeSchema = (entity, content) => {
	return writeYml(path.join('view-schemas', entity, 'browse'), content);
};

module.exports.openSchema = entity => {
	return openFile(path.join('view-schemas', entity, 'browse.yml'));
};
