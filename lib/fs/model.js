'use strict';

const path = require('path');
const childProcess = require('child_process');

const fs = require('fs-extra');
const kebabcase = require('lodash.kebabcase');

const getFilePath = entity => {
	return path.join(process.cwd(), process.env.MS_PATH || '', 'models', `${kebabcase(entity)}.js`);
};

module.exports.getFilePath = getFilePath;

const modelExists = entity => {
	const filePath = getFilePath(entity);
	return fs.pathExists(filePath);
};

module.exports.writeModelIfDoesNotExist = async (entity, content) => {

	if(await modelExists(entity))
		return;

	const filePath = getFilePath(entity);
	return fs.outputFile(filePath, content);
};

module.exports.openModel = entity => {
	const filePath = getFilePath(entity);
	childProcess.spawn('xdg-open', [filePath], {
		detached: true
	});
};
