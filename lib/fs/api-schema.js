'use strict';

const path = require('path');

const { writeYml, openFile, fileExists } = require('./base');

const getRelativePath = apiPath => path.join('schemas/src/public/api', apiPath);

module.exports.writeSchema = (apiPath, content) => {
	return writeYml(path.join('schemas/src/public/api', apiPath), content);
};

module.exports.writeSchemaIfDoesNotExist = async (apiPath, content) => {

	if(await fileExists(getRelativePath(`${apiPath}.yml`)))
		return;

	return writeYml(getRelativePath(apiPath), content);
};

module.exports.openSchema = apiPath => {
	return openFile(getRelativePath(`${apiPath}.yml`));
};
