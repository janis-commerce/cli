'use strict';

const path = require('path');
const childProcess = require('child_process');

const fs = require('fs-extra');
const YAML = require('yamljs');

const getSchemaPath = apiPath => {
	const cleanApiPath = apiPath.replace(/{\w+}\/?/g, '');
	return path.join(process.cwd(), 'schemas/src/public/api', cleanApiPath);
};

module.exports.writeSchema = (apiPath, content) => {
	const schemaPath = getSchemaPath(apiPath);
	return fs.outputFile(schemaPath, YAML.stringify(content, Infinity, 2));
};

module.exports.openSchema = apiPath => {
	const schemaPath = getSchemaPath(apiPath);
	childProcess.spawn('xdg-open', [schemaPath], {
		detached: true
	});
};
