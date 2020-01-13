'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, writeRaw, openFile } = require('./base');

const getRelativePath = apiPath => path.join(process.env.MS_PATH || '', 'api', `${apiPath}.js`);

module.exports.getFilePath = apiPath => baseGetFilePath(getRelativePath(apiPath));

module.exports.writeSource = (apiPath, content, needsChanges) => {
	return writeRaw(getRelativePath(apiPath), content, needsChanges);
};

module.exports.openSource = apiPath => {
	return openFile(getRelativePath(apiPath));
};
