'use strict';

const camelcase = require('lodash.camelcase');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const apiSchemaTemplate = require('./api-schema');

const getEntityTitle = entity => startcase(entity).replace(/ /g, '');

const getListParameters = entity => {

	const entityTitle = getEntityTitle(entity);

	return [
		{ $ref: `#/components/parameters/${entityTitle}SortBy` },
		{ $ref: '#/components/parameters/ListSortDirection' },
		{ $ref: `#/components/parameters/${entityTitle}Filters` },
		{ $ref: '#/components/parameters/ListPageNumber' },
		{ $ref: '#/components/parameters/ListPageSize' }
	];
};

const getListComponents = (entity, entityPlural, sortableFields, availableFilters) => {

	const entityTitle = getEntityTitle(entity);

	return {
		components: {
			schemas: {
				[`${entityTitle}List`]: {
					type: 'array',
					description: `A list of ${startcase(entityPlural)}`,
					items: {
						$ref: `#/components/schemas/${entityTitle}`
					}
				}
			},
			parameters: {
				[`${entityTitle}SortBy`]: {
					name: 'sortBy',
					in: 'query',
					description: 'The field to sort by',
					required: false,
					schema: {
						type: 'string',
						enum: sortableFields
					}
				},
				[`${entityTitle}Filters`]: {
					name: 'filters',
					in: 'query',
					description: 'The filters to apply to the list',
					required: false,
					style: 'deepObject',
					explode: true,
					schema: {
						type: 'object',
						properties: availableFilters.reduce((acum, field) => ({
							...acum,
							[field]: {
								$ref: `#/components/schemas/${entityTitle}/properties/${field}`
							}
						}), {})
					}
				}
			}
		}
	};
};

module.exports = ({
	entity,
	entityPlural,
	sortableFields,
	availableFilters,
	auth
}) => apiSchemaTemplate({
	path: `/${kebabcase(entity)}`,
	method: 'get',
	janisNamespace: kebabcase(entity),
	janisMethod: 'list',
	auth,
	operationId: camelcase(`list-${entityPlural}`),
	parameters: getListParameters(entity),
	tags: [startcase(entity)],
	summary: `List ${startcase(entityPlural)}`,
	responses: {
		200: {
			description: `${startcase(entityPlural)} listed`,
			headers: {
				'x-janis-total': {
					$ref: '#/components/headers/x-janis-total'
				}
			},
			content: {
				'application/json': {
					schema: {
						$ref: `#/components/schemas/${getEntityTitle(entity)}List`
					}
				}
			}
		}
	},
	extraSchemaStuff: getListComponents(entity, entityPlural, sortableFields, availableFilters)
});
