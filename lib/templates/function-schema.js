'use strict';

const apiSchemaTemplate = require('./api-schema');

module.exports = ({
	functionName,
	hasPayload
}) => apiSchemaTemplate({
	path: `/${functionName}`,
	method: 'post',
	operationId: `${functionName}`,
	tags: ['Functions'],
	summary: `${functionName}`,
	...hasPayload && {
		requestBody: {
			description: `${functionName}`,
			required: true,
			content: {
				'application/json': {
				}
			}
		}
	},
	responses: {
		200: {
			$ref: '#/components/responses/GenericSuccess'
		}
	}
});
