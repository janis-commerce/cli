'use strict';

const path = require('path');

const fs = require('fs-extra');
const kebabcase = require('lodash.kebabcase');
const YAML = require('yamljs');

const { reportEvents, Report } = require('../report');
const open = require('../wrappers/open');

const getFilePath = (relativePath, sanitize = true) => {

	const fullPath = path.isAbsolute(relativePath) ? relativePath : path.join(process.cwd(), relativePath);

	if(sanitize) {
		const { dir, name, ext } = path.parse(fullPath);

		const cleanApiPath = `${dir}/${name}`
			.replace(/{\w+}\/?/g, '')
			.replace(/\/+$/, '')
			.split('/')
			.map(kebabcase)
			.join('/');

		return `${cleanApiPath}${ext}`;
	}

	return fullPath;
};

module.exports.getFilePath = getFilePath;

module.exports.fileExists = relativePathWithExt => {
	const filePath = getFilePath(relativePathWithExt);
	return fs.pathExists(filePath);
};

module.exports.readYml = relativePath => {
	const filePath = getFilePath(`${relativePath}.yml`);
	return YAML.load(filePath);
};

module.exports.readJson = async relativePath => {
	const filePath = getFilePath(`${relativePath}.json`);
	return JSON.parse(await fs.readFile(filePath, 'utf8'));
};

const writeFile = async (relativePathWithExt, rawContent, needsChanges, needsCleaning) => {
	const filePath = getFilePath(relativePathWithExt, needsCleaning);
	await fs.outputFile(filePath, rawContent);
	Report.add(needsChanges ? reportEvents.FILE_NEEDS_CHANGES : reportEvents.FILE_CREATED, filePath);
};

module.exports.writeRaw = writeFile;

module.exports.writeYml = (relativePath, content, needsChanges, needsCleaning) => {
	return writeFile(`${relativePath}.yml`, YAML.stringify(content, Infinity, 2), needsChanges, needsCleaning);
};

module.exports.writeJson = (relativePath, content, needsChanges, needsCleaning) => {
	return writeFile(`${relativePath}.json`, JSON.stringify(content, null, '\t'), needsChanges, needsCleaning);
};

module.exports.openFile = (relativePathWithExt, needsCleaning) => {
	const filePath = getFilePath(relativePathWithExt, needsCleaning);
	open.openFile(filePath);
};
