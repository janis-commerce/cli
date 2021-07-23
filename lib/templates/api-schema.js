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
	auth,
	parameters = {},
	requestBody,
	responses = {},
	extraSchemaStuff
}) => {

	operationId = operationId || camelcase(`${janisMethod}-${janisNamespace}`);

	const security = {};

	if(auth === 'core' || auth === 'full') {
		security.ApiKey = [];
		security.ApiSecret = [];
	}

	if(auth === 'full')
		security.JanisClient = [];

	const apiData = {
		'x-janis-namespace': janisNamespace,
		'x-janis-method': janisMethod,
		'x-janis-permissions': permissions,
		operationId,
		tags,
		summary,
		...Object.keys(security).length && { security: [security] },
		parameters,
		requestBody,
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
	};

	if(!apiData.security || !apiData.security.length)
		delete apiData.security;

	if(!apiData.parameters || !Object.keys(apiData.parameters).length)
		delete apiData.parameters;

	if(!apiData.requestBody)
		delete apiData.requestBody;

	return {
		paths: {
			[path]: {
				[method]: apiData
			}
		},
		...(extraSchemaStuff || {})
	};
};
