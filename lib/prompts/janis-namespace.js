'use strict';

const { notEmpty } = require('../utils');

module.exports = {
	name: 'janisNamespace',
	type: 'text',
	message: 'What\'s the API Janis Namespace?',
	validate: notEmpty
};
