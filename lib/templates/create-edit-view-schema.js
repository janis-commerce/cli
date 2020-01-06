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
	root,
	source,
	target,
	service,
	entity,
	fields
}) => {

	const schema = {
		service,
		name: `${kebabcase(entity)}-${root.toLowerCase()}`,
		root,
		source,
		target,
		sections: [
			{
				name: 'mainFormSection',
				rootComponent: 'MainForm',
				fieldsGroup: [{
					name: 'detail',
					icon: 'catalogue',
					fields: fields.map(f => getRecommendedField(f))
				}]
			},
			...(root.toLowerCase() === 'edit' ? [{
				name: 'logsSection',
				rootComponent: 'LogsBrowseSection'
			}] : [])
		]
	};

	if(!source)
		delete schema.source;

	if(!target)
		delete schema.target;

	return schema;
};
