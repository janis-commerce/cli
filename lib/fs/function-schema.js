'use strict';

const path = require('path');

const { writeYml, openFile } = require('./base');

const getRelativePath = (functionPath, functionName) => path.join('schemas/src', functionPath || '', functionName);

module.exports.writeSchema = (functionPath, functionName, content, needsChanges) => {
	return writeYml(getRelativePath(functionPath, functionName), content, needsChanges, false);
};

module.exports.openSchema = (functionPath, functionName) => {
	return openFile(getRelativePath(functionPath, functionName), false);
};
