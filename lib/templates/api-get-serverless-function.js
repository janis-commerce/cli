'use strict';

const kebabcase = require('lodash.kebabcase');

module.exports = ({
	entity
}) => ['janis.apiGet', {
	entityName: kebabcase(entity),
	authorizer: 'FullAuthorizer',
	cors: true
}];
