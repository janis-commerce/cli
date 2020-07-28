'use strict';

const { notEmpty, normalizePath } = require('../utils');

module.exports = {
	name: 'path',
	type: 'text',
	message: 'What\'s the API path?',
	validate: notEmpty,
	format: userPath => normalizePath(userPath)
};
