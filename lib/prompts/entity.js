'use strict';

const camelcase = require('lodash.camelcase');

const { notEmpty } = require('../utils');

module.exports = {
	name: 'entity',
	type: 'text',
	message: 'What\'s the entity?',
	validate: notEmpty,
	format: entity => camelcase(entity.trim())
};
