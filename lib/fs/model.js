'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, fileExists, writeRaw, openFile } = require('./base');

const getRelativePath = entity => path.join(process.env.MS_PATH || '', 'models', `${entity}.js`);

module.exports.getFilePath = entity => baseGetFilePath(getRelativePath(entity));

module.exports.writeModelIfDoesNotExist = async (entity, content) => {

	if(await fileExists(getRelativePath(entity)))
		return;

	return writeRaw(getRelativePath(entity), content);
};

module.exports.openModel = entity => {
	return openFile(getRelativePath(entity));
};
