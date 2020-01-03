'use strict';

const kebabcase = require('lodash.kebabcase');

const buildField = (field, component, componentAttributes) => {

	const result = {
		name: field,
		component
	};

	if(componentAttributes)
		result.componentAttributes = componentAttributes;

	return result;
};

const getRecommendedField = field => {
	switch(field) {
		case 'id':
			return buildField(field, 'Text');
		default:
			if(field.match(/date/i))
				return buildField(field, 'DateTimePicker', { selectDate: true });

			if(field.match(/^(is|has)/))
				return buildField(field, 'Switch');

			return buildField(field, 'Input');
	}
};

module.exports = ({
	service,
	entity,
	fields
}) => ({
	service,
	root: 'Edit',
	name: `${kebabcase(entity)}-edit`,
	source: {
		service,
		namespace: kebabcase(entity),
		method: 'get'
	},
	target: {
		service,
		namespace: kebabcase(entity),
		method: 'update'
	},
	sections: [{
		name: 'mainFormSection',
		rootComponent: 'MainForm',
		fieldsGroup: [{
			name: 'detail',
			icon: 'catalogue',
			fields: fields.map(f => getRecommendedField(f))
		}]
	}]
});
