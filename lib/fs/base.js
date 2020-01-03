'use strict';

const path = require('path');
const childProcess = require('child_process');

const fs = require('fs-extra');
const kebabcase = require('lodash.kebabcase');
const YAML = require('yamljs');

const getFilePath = relativePath => {

	const fullPath = path.join(process.cwd(), relativePath);

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

module.exports.readJson = async relativePath => {
	const filePath = getFilePath(`${relativePath}.json`);
	return JSON.parse(await fs.readFile(filePath, 'utf8'));
};

module.exports.writeYml = (relativePath, content) => {
	const filePath = getFilePath(`${relativePath}.yml`);
	return fs.outputFile(filePath, YAML.stringify(content, Infinity, 2));
};

module.exports.writeJson = (relativePath, content) => {
	const filePath = getFilePath(`${relativePath}.json`);
	return fs.outputFile(filePath, JSON.stringify(content, null, '\t'));
};

module.exports.writeRaw = (relativePathWithExt, content) => {
	const filePath = getFilePath(relativePathWithExt);
	return fs.outputFile(filePath, content);
};

module.exports.openFile = relativePath => {
	const filePath = getFilePath(relativePath);
	childProcess.spawn('xdg-open', [filePath], {
		detached: true
	});
};
