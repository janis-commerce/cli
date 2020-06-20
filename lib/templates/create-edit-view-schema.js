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

	if(field === 'status') {
		return buildField(field, 'Select', {
			labelPrefix: 'common.status.',
			translateLabels: true,
			options: {
				scope: 'local',
				values: [
					{
						label: 'active',
						value: 'active'
					},
					{
						label: 'inactive',
						value: 'inactive'
					}
				]
			}
		});
	}

	if(field.match(/date/i))
		return buildField(field, 'DateTimePicker', { selectDate: true });

	if(field.match(/^(is|has)/))
		return buildField(field, 'Switch');

	return buildField(field, 'Input');
};

const ignoredFields = {
	id: true,
	status: true,
	dateCreated: true,
	userCreated: true,
	dateModified: true,
	userModified: true
};

const otherFields = {
	status: true
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
					fields: fields
						.map(f => !ignoredFields[f] && getRecommendedField(f))
						.filter(Boolean)
				}]
			},
			...(root.toLowerCase() === 'edit' ? [{
				name: 'logsSection',
				rootComponent: 'LogsBrowseSection'
			}] : [])
		]
	};

	const parsedOtherFields = fields.filter(f => otherFields[f])
		.map(f => getRecommendedField(f));

	if(parsedOtherFields.length) {
		schema.sections[0].fieldsGroup.push({
			name: 'others',
			position: 'right',
			fields: parsedOtherFields
		});
	}

	if(!source)
		delete schema.source;

	return schema;
};
