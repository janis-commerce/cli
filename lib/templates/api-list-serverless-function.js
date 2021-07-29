'use strict';

const kebabcase = require('lodash.kebabcase');

const { getAuthorizerFromAuth } = require('../utils');

module.exports = ({
	entity,
	auth
}) => ['janis.apiList', {
	entityName: kebabcase(entity),
	...getAuthorizerFromAuth(auth) && { authorizer: getAuthorizerFromAuth(auth) },
	cors: true
}];
