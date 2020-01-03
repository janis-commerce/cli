'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, writeRaw, openFile } = require('./base');

const getRelativePath = apiPath => path.join('tests/api', `${apiPath}.js`);

module.exports.getFilePath = apiPath => baseGetFilePath(getRelativePath(apiPath));

module.exports.writeTest = (apiPath, content) => {
	return writeRaw(getRelativePath(apiPath), content);
};

module.exports.openTest = apiPath => {
	return openFile(getRelativePath(apiPath));
};
