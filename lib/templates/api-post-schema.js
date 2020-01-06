'use strict';

const camelcase = require('lodash.camelcase');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const apiSchemaTemplate = require('./api-schema');

const getEntityTitle = entity => startcase(entity).replace(/ /g, '');

module.exports = ({
	entity,
	security = []
}) => apiSchemaTemplate({
	path: `/${kebabcase(entity)}`,
	method: 'post',
	janisNamespace: kebabcase(entity),
	janisMethod: 'create',
	security,
	operationId: camelcase(`create-${entity}s`),
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
		200: {
			description: `The ${startcase(entity)} was created`,
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
