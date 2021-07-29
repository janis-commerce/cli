'use strict';

const kebabcase = require('lodash.kebabcase');

const { getAuthorizerFromAuth } = require('../utils');

module.exports = ({
	entity,
	auth
}) => ['janis.apiPut', {
	entityName: kebabcase(entity),
	...getAuthorizerFromAuth(auth) && { authorizer: getAuthorizerFromAuth(auth) },
	cors: true
}];
