'use strict';

const kebabcase = require('lodash.kebabcase');

module.exports = ({
	entity
}) => ['janis.apiList', {
	entityName: kebabcase(entity),
	authorizer: 'FullAuthorizer',
	cors: true
}];
