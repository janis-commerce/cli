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
		{ $ref: `#/components/parameters/${entityTitle}Filters` },
		{ $ref: '#/components/parameters/ListSortDirection' },
		{ $ref: '#/components/parameters/ListPageNumber' },
		{ $ref: '#/components/parameters/ListPageSize' }
	];
};

const getListComponents = (entity, sortableFields, availableFilters) => {

	const entityTitle = getEntityTitle(entity);

	return {
		components: {
			schemas: {
				[`${entityTitle}List`]: {
					type: 'array',
					description: `A list of ${startcase(entity)}s`,
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
								type: 'string',
								description: 'ADD FILTER DESCRIPTION'
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
	sortableFields,
	availableFilters,
	security = []
}) => apiSchemaTemplate({
	path: `/${kebabcase(entity)}`,
	method: 'get',
	janisNamespace: kebabcase(entity),
	janisMethod: 'list',
	security,
	operationId: camelcase(`list-${entity}s`),
	parameters: getListParameters(entity),
	tags: [startcase(entity)],
	summary: `List ${startcase(entity)}s`,
	responses: {
		200: {
			description: `${startcase(entity)}s listed`,
			content: {
				'application/json': {
					schema: {
						$ref: `#/components/schemas/${getEntityTitle(entity)}List`
					}
				}
			}
		}
	},
	extraSchemaStuff: getListComponents(entity, sortableFields, availableFilters)
});
