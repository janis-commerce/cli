'use strict';

const { notEmpty } = require('../utils');

module.exports = {
	name: 'janisMethod',
	type: 'text',
	message: 'What\'s the API Janis Method?',
	validate: notEmpty
};
