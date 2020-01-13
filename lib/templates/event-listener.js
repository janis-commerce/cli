'use strict';

const kebabcase = require('lodash.kebabcase');

module.exports = ({
	service,
	entity,
	event
}) => ({
	namespace: `${kebabcase(service)}-${kebabcase(entity)}`,
	method: `${kebabcase(event)}-listener`
});
