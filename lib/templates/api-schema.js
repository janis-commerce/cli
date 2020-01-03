'use strict';

const camelcase = require('lodash.camelcase');

module.exports = ({
	path,
	method,
	janisNamespace,
	janisMethod,
	operationId,
	permissions = [],
	tags = ['SELECT A TAG'],
	summary = 'COMPLETE API SUMMARY',
	security = [],
	parameters = {},
	responses = {},
	extraSchemaStuff
}) => {

	operationId = operationId || camelcase(`${janisMethod}-${janisNamespace}`);

	const schema = {
		paths: {
			[path]: {
				[method]: {
					'x-janis-namespace': janisNamespace,
					'x-janis-method': janisMethod,
					'x-janis-permissions': permissions,
					operationId,
					tags,
					summary,
					security,
					parameters,
					responses: {
						200: {
							$ref: `#/components/responses/${operationId}`
						},
						400: {
							$ref: '#/components/responses/BadRequest'
						},
						401: {
							$ref: '#/components/responses/Unauthorized'
						},
						403: {
							$ref: '#/components/responses/Forbidden'
						},
						500: {
							$ref: '#/components/responses/InternalError'
						},
						...responses
					}
				}
			}
		},
		...(extraSchemaStuff || {})
	};

	return schema;
};
