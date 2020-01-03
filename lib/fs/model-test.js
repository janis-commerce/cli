'use strict';

const path = require('path');
const childProcess = require('child_process');

const fs = require('fs-extra');
const kebabcase = require('lodash.kebabcase');

const getFilePath = entity => {
	return path.join(process.cwd(), 'tests/models', `${kebabcase(entity)}.js`);
};

module.exports.getFilePath = getFilePath;

const testExists = entity => {
	const filePath = getFilePath(entity);
	return fs.pathExists(filePath);
};

module.exports.writeTestIfDoesNotExist = async (entity, content) => {

	if(await testExists(entity))
		return;

	const filePath = getFilePath(entity);
	return fs.outputFile(filePath, content);
};

module.exports.openTest = entity => {
	const filePath = getFilePath(entity);
	childProcess.spawn('xdg-open', [filePath], {
		detached: true
	});
};
