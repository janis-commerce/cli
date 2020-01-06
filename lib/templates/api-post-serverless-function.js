'use strict';

const kebabcase = require('lodash.kebabcase');

module.exports = ({
	entity
}) => ['janis.apiPost', {
	entityName: kebabcase(entity),
	authorizer: 'FullAuthorizer',
	cors: true
}];
