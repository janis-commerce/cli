'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, fileExists, writeRaw, openFile } = require('./base');
const { reportEvents, Report } = require('../report');

const getRelativePath = entity => path.join('tests/models', `${entity}.js`);

module.exports.getFilePath = entity => baseGetFilePath(getRelativePath(entity));

module.exports.writeTestIfDoesNotExist = async (entity, content, needsChanges) => {

	const relativePath = getRelativePath(entity);

	if(await fileExists(relativePath)) {
		Report.add(reportEvents.FILE_NOT_OVERRIDEN, baseGetFilePath(relativePath));
		return;
	}

	return writeRaw(relativePath, content, needsChanges);
};

module.exports.openTest = entity => {
	return openFile(getRelativePath(entity));
};
