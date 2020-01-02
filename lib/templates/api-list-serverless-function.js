'use strict';

module.exports = ({
	entity
}) => ['janis.apiList', {
	entityName: entity,
	authorizer: 'FullAuthorizer',
	cors: true
}];
