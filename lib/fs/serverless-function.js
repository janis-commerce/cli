'use strict';

const path = require('path');
const childProcess = require('child_process');

const { inspect } = require('util');

const fs = require('fs-extra');

const getFilePath = () => {
	return path.join(process.cwd(), 'serverless/functions.json');
};

module.exports.getFilePath = getFilePath;

const fileExists = () => {
	const filePath = getFilePath();
	return fs.pathExists(filePath);
};

module.exports.writeFunction = async functionData => {

	const filePath = getFilePath();

	let currentContent = [];

	if(await fileExists()) {
		currentContent = JSON.parse(await fs.readFile(filePath, 'utf8'));
		if(!Array.isArray(currentContent))
			throw new Error(`Invalid Serverless function JSON content. Expected an array, received ${inspect(currentContent)}`);
	}

	currentContent.push(functionData);

	return fs.outputFile(filePath, JSON.stringify(currentContent, null, '\t'));
};

module.exports.openFile = () => {
	const filePath = getFilePath();
	childProcess.spawn('xdg-open', [filePath], {
		detached: true
	});
};
