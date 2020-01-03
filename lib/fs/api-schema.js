'use strict';

const path = require('path');

const { writeYml, openFile } = require('./base');

module.exports.writeSchema = (apiPath, content) => {
	return writeYml(path.join('schemas/src/public/api', apiPath), content);
};

module.exports.openSchema = apiPath => {
	return openFile(path.join('schemas/src/public/api', `${apiPath}.yml`));
};
