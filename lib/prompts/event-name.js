'use strict';

const { notEmpty } = require('../utils');

module.exports = {
	name: 'event',
	type: 'text',
	message: 'What\'s the event name?  (in-dash-case)',
	validate: /* istanbul ignore next */ notEmpty && (value => !!value.match(/^[a-z0-9-]+$/))
};
