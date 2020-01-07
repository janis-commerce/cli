'use strict';

const kebabcase = require('lodash.kebabcase');

module.exports = ({
	entity,
	event
}) => ({
	namespace: kebabcase(entity),
	method: `${kebabcase(event)}-listener`
});
