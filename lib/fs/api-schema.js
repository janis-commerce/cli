'use strict';

const path = require('path');
const childProcess = require('child_process');

const fs = require('fs-extra');
const kebabcase = require('lodash.kebabcase');
const YAML = require('yamljs');

const getFilePath = apiPath => {
	const cleanApiPath = apiPath
		.replace(/{\w+}\/?/g, '')
		.split('/')
		.map(kebabcase)
		.join('/');

	return path.join(process.cwd(), 'schemas/src/public/api', `${cleanApiPath}.yml`);
};

module.exports.writeSchema = (apiPath, content) => {
	const filePath = getFilePath(apiPath);
	return fs.outputFile(filePath, YAML.stringify(content, Infinity, 2));
};

module.exports.openSchema = apiPath => {
	const filePath = getFilePath(apiPath);
	childProcess.spawn('xdg-open', [filePath], {
		detached: true
	});
};
