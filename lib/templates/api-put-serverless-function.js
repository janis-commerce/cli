'use strict';

const kebabcase = require('lodash.kebabcase');

module.exports = ({
	entity
}) => ['janis.apiPut', {
	entityName: kebabcase(entity),
	authorizer: 'FullAuthorizer',
	cors: true
}];
