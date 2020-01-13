'use strict';

const kebabcase = require('lodash.kebabcase');

module.exports = ({
	service,
	entity,
	event,
	mustHaveClient
}) => ['janis.eventListener', {
	serviceName: kebabcase(service),
	entityName: kebabcase(entity),
	eventName: kebabcase(event),
	mustHaveClient
}];
