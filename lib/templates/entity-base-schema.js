'use strict';

const startcase = require('lodash.startcase');

const { getFieldSampleStruct, getFieldSampleValue, getFieldSampleDescription } = require('../utils');

const getEntityTitle = entity => startcase(entity).replace(/ /g, '');

const getExampleValue = field => {

	const sampleValue = getFieldSampleValue(field);

	if(typeof sampleValue === 'string')
		return sampleValue.replace(/'/g, '');

	return sampleValue;
};

const readOnlyFields = [
	'id',
	'dateCreated',
	'userCreated',
	'dateModified',
	'userModified'
];

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
						type: getFieldSampleStruct(field),
						description: getFieldSampleDescription(field, entity),
						example: getExampleValue(field),
						...(field.match(/date/i) ? { format: 'date-time' } : {}),
						...(readOnlyFields.includes(field) ? { readOnly: true } : {}),
						...(field === 'status' ? { enum: ['active', 'inactive'] } : {})
					}
				}), {}),
				required: fields
			}
		}
	}
});
