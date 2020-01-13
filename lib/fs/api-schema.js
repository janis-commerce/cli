'use strict';

const path = require('path');

const { writeYml, openFile, fileExists, getFilePath } = require('./base');
const { reportEvents, Report } = require('../report');

const getRelativePath = apiPath => path.join('schemas/src/public/api', apiPath);

const writeSchema = async (apiPath, content, needsChanges) => {
	await writeYml(path.join('schemas/src/public/api', apiPath), content, needsChanges);
};

module.exports.writeSchema = writeSchema;

module.exports.writeSchemaIfDoesNotExist = async (apiPath, content, needsChanges) => {

	const relativePath = getRelativePath(`${apiPath}.yml`);

	if(await fileExists(relativePath)) {
		Report.add(reportEvents.FILE_NOT_OVERRIDEN, getFilePath(relativePath));
		return;
	}

	return writeSchema(apiPath, content, needsChanges);
};

module.exports.openSchema = apiPath => {
	return openFile(getRelativePath(`${apiPath}.yml`));
};
