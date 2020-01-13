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

	if(field.match(/user/i)) {
		return {
			name: field,
			component: 'Select',
			componentAttributes: {
				translateLabels: false,
				options: {
					scope: 'remote',
					endpoint: {
						service: 'id',
						namespace: 'user',
						method: 'list'
					},
					searchParam: 'filters[name]',
					valuesMapper: {
						label: 'name',
						value: 'id'
					}
				}
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
		case 'status':
			return buildField(field, 'StatusChip', { useTheme: true });
		default:
			if(field.match(/date/i))
				return buildField(field, 'Text', null, 'date');

			if(field.match(/user/i)) {
				return buildField(field, 'AsyncWrapper', {
					source: {
						service: 'id',
						namespace: 'user',
						method: 'list'
					},
					dataMapping: {
						firstname: `${field}Data.firstname`,
						lastname: `${field}Data.lastname`,
						email: `${field}Data.email`,
						'images.thumbnail': `${field}Data.image`
					},
					field: {
						name: 'user',
						component: 'UserChip',
						componentAttributes: {
							userDataSource: {
								firstname: `${field}Data.firstname`,
								lastname: `${field}Data.lastname`,
								email: `${field}Data.email`,
								image: `${field}Data.image`
							}
						}
					}
				});
			}

			if(field.match(/^(is|has)/))
				return buildField(field, 'Chip', null, 'booleanToWord');

			return buildField(field, 'Text');
	}
};

const ignoredFields = {
	id: true
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
	fields: fields
		.map(f => !ignoredFields[f] && getRecommendedField(f))
		.filter(Boolean)
});
