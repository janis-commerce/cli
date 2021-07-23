'use strict';

const { getAuthorizerFromAuth } = require('../utils');

module.exports = ({
	path,
	method,
	methodAlias,
	auth
}) => ['janis.api', {
	path,
	method,
	methodName: methodAlias,
	...getAuthorizerFromAuth(auth) && { authorizer: getAuthorizerFromAuth(auth) },
	cors: true
}];
