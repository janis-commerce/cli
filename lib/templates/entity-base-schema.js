'use strict';

const startcase = require('lodash.startcase');

const { getFieldSampleValue } = require('../utils');

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
						description: 'ADD A DESCRIPTION',
						example: getFieldSampleValue(field).replace(/'/g, '')
					}
				}), {}),
				required: fields
			}
		}
	}
});
