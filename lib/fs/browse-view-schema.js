'use strict';

const path = require('path');
const childProcess = require('child_process');

const fs = require('fs-extra');
const YAML = require('yamljs');

const getFilePath = entity => {
	return path.join(process.cwd(), 'view-schemas', entity, 'browse.yml');
};

module.exports.writeSchema = async (entity, content) => {
	const filePath = getFilePath(entity);
	return fs.outputFile(filePath, YAML.stringify(content, Infinity, 2));
};

module.exports.openSchema = entity => {
	const filePath = getFilePath(entity);
	childProcess.spawn('xdg-open', [filePath], {
		detached: true
	});
};
