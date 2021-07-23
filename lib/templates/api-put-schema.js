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
	path: `/${kebabcase(entity)}/{id}`,
	method: 'put',
	janisNamespace: kebabcase(entity),
	janisMethod: 'update',
	auth,
	operationId: camelcase(`update-${entity}`),
	parameters: [{ $ref: '#/components/parameters/id' }],
	tags: [startcase(entity)],
	summary: `Update a ${startcase(entity)}`,
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
		200: { $ref: '#/components/responses/SuccessUpdateResponse' }
	}
});
