'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, writeRaw, openFile } = require('./base');

const getRelativePath = (functionPath, functionName) => path.join(process.env.MS_PATH || '', 'lambda', functionPath || '', `${functionName}.js`);

module.exports.getFilePath = (functionPath, functionName) => baseGetFilePath(getRelativePath(functionPath, functionName));

module.exports.writeSource = (functionPath, functionName, content, needsChanges) => {
	return writeRaw(getRelativePath(functionPath, functionName), content, needsChanges);
};

module.exports.openSource = (functionPath, functionName) => {
	return openFile(getRelativePath(functionPath, functionName));
};
