'use strict';

const startcase = require('lodash.startcase');

const { getFieldSampleValue, getFieldSampleDescription } = require('../utils');

const getEntityTitle = entity => startcase(entity).replace(/ /g, '');

module.exports = ({
	entity,
	fields
}) => ({
	components: {
		schemas: {
			[getEntityTitle(entity)]: {
				type: 'object',
				description: `A ${startcase(entity)}`,
				properties: fields.reduce((acum, field) => ({
					...acum,
					[field]: {
						type: 'string',
						description: getFieldSampleDescription(field, entity),
						example: getFieldSampleValue(field).replace(/'/g, ''),
						...(field.match(/date/i) ? { format: 'date-time' } : {})
					}
				}), {}),
				required: fields
			}
		}
	}
});
