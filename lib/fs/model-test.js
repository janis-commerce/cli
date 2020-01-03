'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, fileExists, writeRaw, openFile } = require('./base');

const getRelativePath = entity => path.join('tests/models', `${entity}.js`);

module.exports.getFilePath = entity => baseGetFilePath(getRelativePath(entity));

module.exports.writeTestIfDoesNotExist = async (entity, content) => {

	if(await fileExists(getRelativePath(entity)))
		return;

	return writeRaw(getRelativePath(entity), content);
};

module.exports.openTest = entity => {
	return openFile(getRelativePath(entity));
};
