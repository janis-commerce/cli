'use strict';

const { notEmpty } = require('../utils');

module.exports = {
	name: 'service',
	type: 'text',
	message: 'What\'s the service name? (in-dash-case)',
	validate: /* istanbul ignore next */ notEmpty && (value => !!value.match(/^[a-z0-9-]+$/))
};
