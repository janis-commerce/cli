'use strict';

const camelcase = require('lodash.camelcase');
const { notEmpty, areLettersAndNumbers } = require('../utils');

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

module.exports = {
	name: 'functionName',
	type: 'text',
	message: 'What\'s the functión name?  (in-dash-case)',
	validate: notEmpty && areLettersAndNumbers,
	format: functionName => capitalizeFirstLetter(camelcase(functionName.trim()))
};
