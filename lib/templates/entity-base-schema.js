'use strict';

const startcase = require('lodash.startcase');

const { getFieldSampleStruct, getFieldSampleValue, getFieldSampleDescription, dateRegexp } = require('../utils');

const getEntityTitle = entity => startcase(entity).replace(/ /g, '');

const getExampleValue = field => {

	const sampleValue = getFieldSampleValue(field);

	if(typeof sampleValue === 'string')
		return sampleValue.replace(/'/g, '');

	return sampleValue;
};

const resuableFields = [
	'id',
	'dateCreated',
	'userCreated',
	'dateModified',
	'userModified',
	'status'
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
						...(field.match(dateRegexp) ? { format: 'date-time' } : {})
					},
					...resuableFields.includes(field) ? { [field]: { $ref: `#/components/schemas/${field}` } } : {}
				}), {}),
				required: fields
			}
		}
	}
});
