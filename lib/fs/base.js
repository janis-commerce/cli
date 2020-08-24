'use strict';

const path = require('path');

const fs = require('fs-extra');
const kebabcase = require('lodash.kebabcase');
const YAML = require('yamljs');

const { reportEvents, Report } = require('../report');
const open = require('../wrappers/open');

const getFilePath = relativePath => {

	const fullPath = path.isAbsolute(relativePath) ? relativePath : path.join(process.cwd(), relativePath);

	const { dir, name, ext } = path.parse(fullPath);

	const cleanApiPath = `${dir}/${name}`
		.replace(/{\w+}\/?/g, '')
		.replace(/\/+$/, '')
		.split('/')
		.map(kebabcase)
		.join('/');

	return `${cleanApiPath}${ext}`;
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

const writeFile = async (relativePathWithExt, rawContent, needsChanges) => {
	const filePath = getFilePath(relativePathWithExt);
	await fs.outputFile(filePath, rawContent);
	Report.add(needsChanges ? reportEvents.FILE_NEEDS_CHANGES : reportEvents.FILE_CREATED, filePath);
};

module.exports.writeRaw = writeFile;

module.exports.writeYml = (relativePath, content, needsChanges) => {
	return writeFile(`${relativePath}.yml`, YAML.stringify(content, Infinity, 2), needsChanges);
};

module.exports.writeJson = (relativePath, content, needsChanges) => {
	return writeFile(`${relativePath}.json`, JSON.stringify(content, null, '\t'), needsChanges);
};

module.exports.openFile = relativePathWithExt => {
	const filePath = getFilePath(relativePathWithExt);
	open.openFile(filePath);
};
