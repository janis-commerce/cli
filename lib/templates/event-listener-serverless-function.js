'use strict';

const kebabcase = require('lodash.kebabcase');

module.exports = ({
	entity,
	event,
	mustHaveClient
}) => ['janis.eventListener', {
	entityName: kebabcase(entity),
	eventName: kebabcase(event),
	mustHaveClient
}];
