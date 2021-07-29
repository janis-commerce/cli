'use strict';

const assert = require('assert');

const template = require('../../lib/templates/edit-view-schema');

describe('Templates', () => {
	describe('Edit view schema', () => {

		it('Should return the schema with the best configuration possible', () => {
			const result = template({
				service: 'my-service',
				entity: 'productImage',
				fields: [
					'id',
					'isMain',
					'hasTags',
					'itemsQuantity',
					'normalField',
					'status',
					'dateOfSomething',
					'dateCreated',
					'userCreated',
					'dateModified',
					'userModified'
				]
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
						title: 'main',
						icon: 'summary',
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
									name: 'itemsQuantity',
									component: 'Input',
									componentAttributes: {
										type: 'number'
									}
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
									component: 'StatusSelector',
									defaultValue: 'active'
								}
							]
						}]
					},
					{
						name: 'comments',
						icon: 'comment',
						rootComponent: 'Comments'
					},
					{
						name: 'logs',
						icon: 'clock',
						rootComponent: 'LogsBrowseSection'
					}
				]
			});
		});

	});
});
