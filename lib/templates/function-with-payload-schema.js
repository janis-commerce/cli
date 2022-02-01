'use strict';

const apiSchemaTemplate = require('./api-schema');

module.exports = ({
	functionName
}) => apiSchemaTemplate({
	path: `/${functionName}`,
	method: 'post',
	operationId: `${functionName}`,
	tags: ['Functions'],
	summary: `${functionName}`,
	requestBody: {
		description: `${functionName}`,
		required: true,
		content: {
			'application/json': {
			}
		}
	},
	responses: {
		200: {
			$ref: '#/components/responses/GenericSuccess'
		}
	}
});
