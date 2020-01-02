'use strict';

const path = require('path');
const childProcess = require('child_process');

const fs = require('fs-extra');

const getFilePath = apiPath => {
	const cleanApiPath = apiPath.replace(/{\w+}\/?/g, '');
	return path.join(process.cwd(), process.env.MS_PATH || '', 'api', cleanApiPath);
};

module.exports.getFilePath = getFilePath;

module.exports.writeSource = (apiPath, content) => {
	const filePath = getFilePath(apiPath);
	return fs.outputFile(filePath, content);
};

module.exports.openSource = apiPath => {
	const filePath = getFilePath(apiPath);
	childProcess.spawn('xdg-open', [filePath], {
		detached: true
	});
};
