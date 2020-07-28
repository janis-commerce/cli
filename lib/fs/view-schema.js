'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, fileExists, writeYml, openFile } = require('./base');
const { reportEvents, Report } = require('../report');

const getRelativePath = (entity, page) => path.join('view-schemas', entity, page);

module.exports.writeViewSchema = async (entity, page, content, needsChanges) => {

	const relativePath = getRelativePath(entity, page);

	if(await fileExists(`${relativePath}.yml`)) {
		Report.add(reportEvents.FILE_NOT_OVERRIDEN, baseGetFilePath(relativePath));
		return;
	}

	return writeYml(relativePath, content, needsChanges);
};

module.exports.openSchema = (entity, page) => {
	const relativePath = getRelativePath(entity, page);
	return openFile(`${relativePath}.yml`);
};
