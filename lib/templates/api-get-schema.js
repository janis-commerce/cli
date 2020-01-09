'use strict';

const camelcase = require('lodash.camelcase');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const apiSchemaTemplate = require('./api-schema');

const getEntityTitle = entity => startcase(entity).replace(/ /g, '');

const getPathParameter = () => {
	return [
		{
			name: 'id',
			in: 'path',
			schema: {
				type: 'string',
				example: 'd555345345345as67a342a'
			},
			required: true,
			description: 'The entity ID'
		}
	];
};

module.exports = ({
	entity,
	security = []
}) => apiSchemaTemplate({
	path: `/${kebabcase(entity)}/{id}`,
	method: 'get',
	janisNamespace: kebabcase(entity),
	janisMethod: 'get',
	security,
	operationId: camelcase(`get-${entity}`),
	parameters: getPathParameter(),
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
