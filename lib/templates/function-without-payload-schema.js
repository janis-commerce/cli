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
	responses: {
		200: {
			$ref: '#/components/responses/GenericSuccess'
		}
	}
});
