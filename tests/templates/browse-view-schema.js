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
					},
					{
						name: 'hasTags',
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
					},
					{
						name: 'status',
						component: 'Select',
						componentAttributes: {
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
						}
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
						component: 'UserSelector'
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
						component: 'AsyncUserChip'
					}
				]
			});
		});

	});
});
