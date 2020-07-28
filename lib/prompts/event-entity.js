'use strict';

const { notEmpty, areLettersAndNumbers } = require('../utils');

module.exports = {
	name: 'entity',
	type: 'text',
	message: 'What\'s the event entity? (in-dash-case)',
	validate: notEmpty && areLettersAndNumbers
};
