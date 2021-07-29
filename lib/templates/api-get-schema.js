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
	method: 'get',
	janisNamespace: kebabcase(entity),
	janisMethod: 'get',
	auth,
	operationId: camelcase(`get-${entity}`),
	parameters: [{ $ref: '#/components/parameters/id' }],
	tags: [startcase(entity)],
	summary: `Get a ${startcase(entity)}`,
	responses: {
		200: {
			description: `${startcase(entity)} found`,
			content: {
				'application/json': {
					schema: {
						$ref: `#/components/schemas/${getEntityTitle(entity)}`
					}
				}
			}
		}
	}
});
