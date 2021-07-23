'use strict';

const camelcase = require('lodash.camelcase');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const apiSchemaTemplate = require('./api-schema');

const getEntityTitle = entity => startcase(entity).replace(/ /g, '');

module.exports = ({
	entity,
	auth
}) => apiSchemaTemplate({
	path: `/${kebabcase(entity)}`,
	method: 'post',
	janisNamespace: kebabcase(entity),
	janisMethod: 'create',
	auth,
	operationId: camelcase(`create-${entity}`),
	tags: [startcase(entity)],
	summary: `Create a ${startcase(entity)}`,
	requestBody: {
		description: `A ${startcase(entity)}`,
		required: true,
		content: {
			'application/json': {
				schema: {
					$ref: `#/components/schemas/${getEntityTitle(entity)}`
				}
			}
		}
	},
	responses: {
		200: { $ref: '#/components/responses/SuccessCreateResponse' }
	}
});
