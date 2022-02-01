'use strict';

const camelcase = require('lodash.camelcase');
const { notEmpty, areLettersAndNumbers } = require('../utils');


module.exports = {
	name: 'functionName',
	type: 'text',
	message: 'What\'s the functión name?  (in-dash-case)',
	validate: notEmpty && areLettersAndNumbers,
	format: functionName => camelcase(functionName.trim())
};
