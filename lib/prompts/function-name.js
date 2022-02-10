'use strict';

const { notEmpty, areLettersAndNumbers, upperCamelCase } = require('../utils');

module.exports = {
	name: 'functionName',
	type: 'text',
	message: 'What\'s the functión name?  (in-dash-case)',
	validate: notEmpty && areLettersAndNumbers,
	format: functionName => upperCamelCase(functionName.trim())
};
