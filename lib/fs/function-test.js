'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, writeRaw, openFile } = require('./base');

const getRelativePath = (functionPath, functionName) => path.join('tests/lambda', functionPath || '', `${functionName}.js`);

module.exports.getFilePath = (functionPath, functionName) => baseGetFilePath(getRelativePath(functionPath, functionName));

module.exports.writeTest = (functionPath, functionName, content, needsChanges) => {
	return writeRaw(getRelativePath(functionPath, functionName), content, needsChanges);
};

module.exports.openTest = (functionPath, functionName) => {
	return openFile(getRelativePath(functionPath, functionName));
};
