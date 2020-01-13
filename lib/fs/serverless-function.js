'use strict';

const { inspect } = require('util');

const { fileExists, readJson, writeJson, openFile } = require('./base');

const getRelativePath = () => 'serverless/functions';

module.exports.writeFunction = async (functionData, needsChanges) => {

	const relativePath = getRelativePath();

	let currentContent = [];

	if(await fileExists(`${getRelativePath()}.json`)) {
		currentContent = await readJson(relativePath);
		if(!Array.isArray(currentContent))
			throw new Error(`Invalid Serverless function JSON content. Expected an array, received ${inspect(currentContent)}`);
	}

	currentContent.push(functionData);

	return writeJson(relativePath, currentContent, needsChanges);
};

module.exports.openFile = () => {
	return openFile(`${getRelativePath()}.json`);
};
