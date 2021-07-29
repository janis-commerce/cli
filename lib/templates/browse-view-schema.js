'use strict';

const kebabcase = require('lodash.kebabcase');

const { booleanRegexp, dateRegexp, userRegexp } = require('../utils');

const recommendedDefaultSort = 'dateCreated';

const getRecommendedInitialSortDirection = field => (field.match(dateRegexp) ? 'desc' : 'asc');

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

const getRecommendedFilter = field => {

	if(field === 'status')
		return buildField(field, 'StatusSelector');

	if(field.match(dateRegexp)) {
		return {
			name: field,
			component: 'DateTimePicker',
			componentAttributes: {
				selectDate: true
			}
		};
	}

	if(field.match(userRegexp)) {
		return {
			name: field,
			component: 'UserSelector'
		};
	}

	if(field.match(booleanRegexp)) {
		return {
			name: field,
			component: 'Select',
			componentAttributes: {
				translateLabels: true,
				labelPrefix: 'common.boolean.',
				options: {
					scope: 'local',
					values: [
						{ label: 'yes', value: 1 },
						{ label: 'no', value: 0 }
					]
				}
			}
		};
	}

	return {
		name: field,
		component: 'Input'
	};
};

const getRecommendedField = field => {
	switch(field) {
		case 'status':
			return buildField(field, 'StatusChip', { useTheme: true });
		default:
			if(field.match(dateRegexp))
				return buildField(field, 'Text', null, 'date');

			if(field.match(userRegexp))
				return buildField(field, 'AsyncUserChip');

			if(field.match(booleanRegexp))
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
