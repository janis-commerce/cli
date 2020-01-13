'use strict';

const path = require('path');

const { getFilePath: baseGetFilePath, writeRaw, openFile } = require('./base');

const getRelativePath = (service, entity, event) => path.join(process.env.MS_PATH || '', 'event-listeners', service, entity, `${event}.js`);

module.exports.getFilePath = (service, entity, event) => baseGetFilePath(getRelativePath(service, entity, event));

module.exports.writeSource = (service, entity, event, content, needsChanges) => {
	return writeRaw(getRelativePath(service, entity, event), content, needsChanges);
};

module.exports.openSource = (service, entity, event) => {
	return openFile(getRelativePath(service, entity, event));
};
