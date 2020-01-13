'use strict';

const path = require('path');

const { writeYml, openFile } = require('./base');

module.exports.writeSchema = (entity, page, content, needsChanges) => {
	return writeYml(path.join('view-schemas', entity, page), content, needsChanges);
};

module.exports.openSchema = (entity, page) => {
	return openFile(path.join('view-schemas', entity, `${page}.yml`));
};
