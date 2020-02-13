'use strict';

const assert = require('assert');

const template = require('../../lib/templates/browse-view-schema');

describe('Templates', () => {
	describe('Browse view schema', () => {

		it('Should return the schema with the best configuration possible', () => {
			const result = template({
				service: 'my-service',
				entity: 'productImage',
				fields: ['id', 'isMain', 'hasTags', 'normalField', 'status', 'dateCreated', 'userCreated'],
				sortableFields: ['status', 'dateCreated'],
				availableFilters: ['id', 'isMain', 'hasTags', 'status', 'dateCreated', 'userCreated']
			});

			assert.deepStrictEqual(result, {
				service: 'my-service',
				root: 'Browse',
				name: 'product-image-browse',
				source: {
					service: 'my-service',
					namespace: 'product-image',
					method: 'list'
				},
				sortableFields: [
					{
						name: 'status',
						isDefaultSort: false,
						initialSortDirection: 'asc'
					},
					{
						name: 'dateCreated',
						isDefaultSort: true,
						initialSortDirection: 'desc'
					}
				],
				filters: [
					{
						name: 'id',
						component: 'Input'
					},
					{
						name: 'isMain',
						component: 'Select',
						componentAttributes: {
							translateLabels: false,
							labelPrefix: 'common.boolean.',
							options: {
								scope: 'local',
								values: [
									{ label: 1, value: 'true' },
									{ label: 0, value: 'false' }
								]
							}
						}
					},
					{
						name: 'hasTags',
						component: 'Select',
						componentAttributes: {
							translateLabels: false,
							labelPrefix: 'common.boolean.',
							options: {
								scope: 'local',
								values: [
									{ label: 1, value: 'true' },
									{ label: 0, value: 'false' }
								]
							}
						}
					},
					{
						name: 'status',
						component: 'Input'
					},
					{
						name: 'dateCreated',
						component: 'DateTimePicker',
						componentAttributes: {
							selectDate: true
						}
					},
					{
						name: 'userCreated',
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
					}
				],
				fields: [
					{
						name: 'isMain',
						component: 'Chip',
						mapper: 'booleanToWord'
					},
					{
						name: 'hasTags',
						component: 'Chip',
						mapper: 'booleanToWord'
					},
					{
						name: 'normalField',
						component: 'Text'
					},
					{
						name: 'status',
						component: 'StatusChip',
						componentAttributes: {
							useTheme: true
						}
					},
					{
						name: 'dateCreated',
						component: 'Text',
						mapper: 'date'
					},
					{
						name: 'userCreated',
						component: 'AsyncWrapper',
						componentAttributes: {
							source: {
								service: 'id',
								namespace: 'user',
								method: 'list'
							},
							dataMapping: {
								firstname: 'userCreatedData.firstname',
								lastname: 'userCreatedData.lastname',
								email: 'userCreatedData.email',
								'images.thumbnail': 'userCreatedData.image'
							},
							field: {
								name: 'user',
								component: 'UserChip',
								componentAttributes: {
									userDataSource: {
										firstname: 'userCreatedData.firstname',
										lastname: 'userCreatedData.lastname',
										email: 'userCreatedData.email',
										image: 'userCreatedData.image'
									}
								}
							}
						}
					}
				]
			});
		});

	});
});
