'use strict';

const camelcase = require('lodash.camelcase');

const { notEmpty } = require('../utils');

module.exports = {
	name: 'entityPlural',
	type: 'text',
	message: 'What\'s the entity plural form?',
	initial: prev => `${prev}s`,
	validate: notEmpty,
	format: entity => camelcase(entity.trim())
};
