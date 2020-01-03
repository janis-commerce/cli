'use strict';

const kebabcase = require('lodash.kebabcase');

const recommendedDefaultSort = 'dateCreated';

const getRecommendedInitialSortDirection = field => (field.match(/date/i) ? 'desc' : 'asc');

const getRecommendedFilter = field => {
	if(field.match(/date/i)) {
		return {
			name: field,
			component: 'DateTimePicker',
			componentAttributes: {
				selectDate: true
			}
		};
	}

	return {
		name: field,
		component: 'Input'
	};
};

const buildField = (field, component, componentAttributes, mapper) => {

	const result = {
		name: field,
		component
	};

	if(componentAttributes)
		result.componentAttributes = componentAttributes;

	if(mapper)
		result.mapper = mapper;

	return result;
};

const getRecommendedField = field => {
	switch(field) {
		case 'id':
			return buildField(field, 'BoldText', null, 'addHashtag');
		case 'status':
			return buildField(field, 'StatusChip', { useTheme: true });
		default:
			if(field.match(/date/i))
				return buildField(field, 'Text', null, 'date');

			if(field.match(/^(is|has)/))
				return buildField(field, 'Chip', null, 'booleanToWord');

			return buildField(field, 'Text');
	}
};

module.exports = ({
	service,
	entity,
	fields,
	sortableFields,
	availableFilters
}) => ({
	service,
	root: 'Browse',
	name: `${kebabcase(entity)}-browse`,
	source: {
		service,
		namespace: kebabcase(entity),
		method: 'list'
	},
	sortableFields: sortableFields.map(f => ({
		name: f,
		isDefaultSort: f === recommendedDefaultSort,
		initialSortDirection: getRecommendedInitialSortDirection(f)
	})),
	filters: availableFilters.map(f => getRecommendedFilter(f)),
	fields: fields.map(f => getRecommendedField(f))
});
