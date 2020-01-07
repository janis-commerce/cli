'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, writeRaw, openFile } = require('./base');

const getRelativePath = (entity, event) => path.join('tests/event-listeners', entity, `${event}.js`);

module.exports.getFilePath = (entity, event) => baseGetFilePath(getRelativePath(entity, event));

module.exports.writeTest = (entity, event, content) => {
	return writeRaw(getRelativePath(entity, event), content);
};

module.exports.openTest = (entity, event) => {
	return openFile(getRelativePath(entity, event));
};
