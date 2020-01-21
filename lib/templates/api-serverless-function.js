'use strict';

module.exports = ({
	path,
	method,
	methodAlias
}) => ['janis.api', {
	path,
	method,
	methodName: methodAlias,
	cors: true,
	authorizer: 'FullAuthorizer'
}];
