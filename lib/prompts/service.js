'use strict';

const { notEmpty, areLettersAndNumbers } = require('../utils');

module.exports = {
	name: 'service',
	type: 'text',
	message: 'What\'s the service name? (in-dash-case)',
	validate: notEmpty && areLettersAndNumbers
};
