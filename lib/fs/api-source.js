'use strict';

const path = require('path');
const childProcess = require('child_process');

const fs = require('fs-extra');
const kebabcase = require('lodash.kebabcase');

const getFilePath = apiPath => {
	const cleanApiPath = apiPath
		.replace(/{\w+}\/?/g, '')
		.split('/')
		.map(kebabcase)
		.join('/');

	return path.join(process.cwd(), process.env.MS_PATH || '', 'api', `${cleanApiPath}.js`);
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
