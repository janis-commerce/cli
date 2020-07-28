'use strict';

const { notEmpty, areLettersAndNumbers } = require('../utils');

module.exports = {
	name: 'event',
	type: 'text',
	message: 'What\'s the event name?  (in-dash-case)',
	validate: notEmpty && areLettersAndNumbers
};
