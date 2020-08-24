'use strict';

const assert = require('assert');

const template = require('../../lib/templates/edit-view-schema');

describe('Templates', () => {
	describe('Edit view schema', () => {

		it('Should return the schema with the best configuration possible', () => {
			const result = template({
				service: 'my-service',
				entity: 'productImage',
				fields: ['id', 'isMain', 'hasTags', 'normalField', 'status', 'dateOfSomething', 'dateCreated', 'userCreated', 'dateModified', 'userModified']
			});

			assert.deepStrictEqual(result, {
				service: 'my-service',
				root: 'Edit',
				name: 'product-image-edit',
				source: {
					service: 'my-service',
					namespace: 'product-image',
					method: 'get'
				},
				target: {
					service: 'my-service',
					namespace: 'product-image',
					method: 'update'
				},
				sections: [
					{
						name: 'mainFormSection',
						rootComponent: 'MainForm',
						fieldsGroup: [{
							name: 'detail',
							icon: 'catalogue',
							fields: [
								{
									name: 'isMain',
									component: 'Switch'
								},
								{
									name: 'hasTags',
									component: 'Switch'
								},
								{
									name: 'normalField',
									component: 'Input'
								},
								{
									name: 'dateOfSomething',
									component: 'DateTimePicker',
									componentAttributes: {
										selectDate: true
									}
								}
							]
						},
						{
							name: 'others',
							position: 'right',
							fields: [
								{
									name: 'status',
									component: 'Select',
									defaultValue: 'active',
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
								}
							]
						}]
					},
					{
						name: 'logsSection',
						rootComponent: 'LogsBrowseSection'
					}
				]
			});
		});

	});
});
