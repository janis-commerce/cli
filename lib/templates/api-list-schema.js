'use strict';

const camelcase = require('lodash.camelcase');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

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

const getListComponents = ({ entity, sortableFields, availableFilters }) => {

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
	permissions = [],
	tags = [startcase(entity)],
	summary = `List ${startcase(entity)}s`,
	security = []
}) => {

	const operationId = camelcase(`list-${entity}s`);
	const parameters = getListParameters(entity);
	const extraSchemaStuff = getListComponents({
		entity,
		sortableFields,
		availableFilters
	});

	const kebabEntity = kebabcase(entity);

	const schema = {
		paths: {
			[`/${kebabEntity}`]: {
				get: {
					'x-janis-namespace': kebabcase(kebabEntity),
					'x-janis-method': 'list',
					'x-janis-permissions': permissions,
					operationId,
					tags,
					summary,
					security,
					parameters,
					responses: {
						200: {
							description: `A list of ${startcase(entity)}s`,
							content: {
								'application/json': {
									schema: {
										$ref: `#/components/schemas/${getEntityTitle(entity)}List`
									}
								}
							}
						},
						400: {
							$ref: '#/components/responses/BadRequest'
						},
						401: {
							$ref: '#/components/responses/Unauthorized'
						},
						403: {
							$ref: '#/components/responses/Forbidden'
						},
						500: {
							$ref: '#/components/responses/InternalError'
						}
					}
				}
			}
		},
		...(extraSchemaStuff || {})
	};

	return schema;
};
