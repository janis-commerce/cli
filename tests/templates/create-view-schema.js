'use strict';

const assert = require('assert');

const template = require('../../lib/templates/create-view-schema');

describe('Templates', () => {
	describe('Create view schema', () => {

		it('Should return the schema with the best configuration possible', () => {
			const result = template({
				service: 'my-service',
				entity: 'productImage',
				fields: ['id', 'isMain', 'hasTags', 'normalField', 'status', 'dateOfSomething', 'dateCreated', 'userCreated', 'dateModified', 'userModified']
			});

			assert.deepStrictEqual(result, {
				service: 'my-service',
				root: 'Create',
				name: 'product-image-create',
				target: {
					service: 'my-service',
					namespace: 'product-image',
					method: 'create'
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
									name: 'dateOfSomething',
									component: 'DateTimePicker',
									componentAttributes: {
										selectDate: true
									}
								}
							]
						}]
					}
				]
			});
		});

	});
});
