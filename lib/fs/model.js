'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, fileExists, writeRaw, openFile } = require('./base');
const { reportEvents, Report } = require('../report');

const getRelativePath = entity => path.join(process.env.MS_PATH || '', 'models', `${entity}.js`);

module.exports.getFilePath = entity => baseGetFilePath(getRelativePath(entity));

module.exports.writeModelIfDoesNotExist = async (entity, content, needsChanges) => {

	const relativePath = getRelativePath(entity);

	if(await fileExists(relativePath)) {
		Report.add(reportEvents.FILE_NOT_OVERRIDEN, baseGetFilePath(relativePath));
		return;
	}

	return writeRaw(relativePath, content, needsChanges);
};

module.exports.openModel = entity => {
	return openFile(getRelativePath(entity));
};
