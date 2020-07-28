'use strict';

const { notEmpty } = require('../utils');

module.exports = {
	name: 'entity',
	type: 'text',
	message: 'What\'s the event entity? (in-dash-case)',
	validate: /* istanbul ignore next */ notEmpty && (value => !!value.match(/^[a-z0-9-]+$/))
};
