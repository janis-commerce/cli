'use strict';

const camelcase = require('lodash.camelcase');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const apiSchemaTemplate = require('./api-schema');

const getEntityTitle = entity => startcase(entity).replace(/ /g, '');

const getPathParameter = entity => {
	return [
		{
			name: 'id',
			in: 'path',
			schema: {
				type: 'string',
				example: 'd555345345345as67a342a'
			},
			required: true,
			description: `The ${startcase(entity)} ID`
		}
	];
};

module.exports = ({
	entity,
	security = []
}) => apiSchemaTemplate({
	path: `/${kebabcase(entity)}/{id}`,
	method: 'put',
	janisNamespace: kebabcase(entity),
	janisMethod: 'update',
	security,
	operationId: camelcase(`update-${entity}`),
	parameters: getPathParameter(entity),
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
		200: {
			description: `The ${startcase(entity)} was updated`,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							id: {
								$ref: `#/components/schemas/${getEntityTitle(entity)}/properties/id`
							}
						}
					}
				}
			}
		}
	}
});
