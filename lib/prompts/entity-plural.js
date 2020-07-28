'use strict';

const camelcase = require('lodash.camelcase');
const kebabcase = require('lodash.kebabcase');

const { notEmpty } = require('../utils');

module.exports = {
	name: 'entityPlural',
	type: 'text',
	message: 'What\'s the entity plural form?',
	initial: prev => `${kebabcase(prev)}s`,
	validate: notEmpty,
	format: entity => camelcase(entity.trim())
};
