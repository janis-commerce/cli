'use strict';

const camelcase = require('lodash.camelcase');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const apiSchemaTemplate = require('./api-schema');

module.exports = ({
	entity,
	event,
	mustHaveClient
}) => apiSchemaTemplate({
	path: `/listener/${kebabcase(entity)}/${kebabcase(event)}`,
	method: 'post',
	janisNamespace: kebabcase(entity),
	janisMethod: `${kebabcase(event)}-listener`,
	security: [{
		ApiKey: [],
		ApiSecret: [],
		...(mustHaveClient ? { JanisClient: [] } : {})
	}],
	operationId: camelcase(`${entity}-${event}-listener`),
	tags: ['Event Listeners'],
	summary: `${startcase(entity)} ${startcase(event)} Event Listener`,
	requestBody: {
		description: 'The event',
		required: true,
		content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/listenerEvent'
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
