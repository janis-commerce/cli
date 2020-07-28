'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, fileExists, writeRaw, openFile } = require('./base');
const { reportEvents, Report } = require('../report');

const getRelativePath = (entity, page) => path.join('view-schemas', entity, `${page}.yml`);

module.exports.writeViewSchema = async (entity, page, content, needsChanges) => {

	const relativePath = getRelativePath(entity, page);

	if(await fileExists(relativePath)) {
		Report.add(reportEvents.FILE_NOT_OVERRIDEN, baseGetFilePath(relativePath));
		return;
	}

	return writeRaw(relativePath, content, needsChanges);
};

module.exports.openSchema = (entity, page) => {
	return openFile(getRelativePath(entity, page));
};
