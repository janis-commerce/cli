'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/api-list-test');

describe('Templates', () => {
	describe('API List test', () => {

		const cwd = '/var/www/root-path';

		const env = { ...process.env };

		before(() => {
			process.env.MS_PATH = 'src';
			sinon.stub(process, 'cwd').returns(cwd);
			sinon.stub(Date.prototype, 'toISOString').returns('2020-01-09T21:34:38.897Z');
		});

		after(() => {
			sinon.restore();
			process.env = env;
		});

		it('Should return the test source code as a string', () => {
			const result = template({
				entity: 'productImage',
				fields: ['id', 'status', 'dateCreated', 'userCreated'],
				testPath: 'productImage/get',
				sourcePath: 'productImage/get',
				sortableFields: ['dateCreated'],
				availableFilters: ['id', 'status', 'userCreated']
			});

			assert.deepStrictEqual(result, `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ProductImageListApi = require('../../../src/api/product-image/get');
const ProductImageModel = require('../../../src/models/product-image');

describe('Product Image List Api', () => {

	const productImage = {
		id: '5dea9fc691240d00084083f8',
		status: 'active',
		dateCreated: '2020-01-09T21:34:38.897Z',
		userCreated: '5dea9fc691240d00084083f9'
	};

	const productImageFormatted = {
		id: '5dea9fc691240d00084083f8',
		status: 'active',
		dateCreated: '2020-01-09T21:34:38.897Z',
		userCreated: '5dea9fc691240d00084083f9'
	};

	ApiTest(ProductImageListApi, '/api/product-image', [
		{
			description: 'Should pass the correct params to the model',
			request: {},
			response: {},
			before: sandbox => {
				sandbox.stub(ProductImageModel.prototype, 'get');
				ProductImageModel.prototype.get.resolves([]);
			},
			after: (response, sandbox) => {
				sandbox.assert.calledOnce(ProductImageModel.prototype.get);
				sandbox.assert.calledWithExactly(ProductImageModel.prototype.get, {
					page: 1,
					limit: 60
				});
			}
		},
		{
			description: 'Should succeed with a 200 and an empty array if no productImages are found',
			request: {},
			response: {
				code: 200,
				body: []
			},
			before: sandbox => {
				sandbox.stub(ProductImageModel.prototype, 'get');
				ProductImageModel.prototype.get.resolves([]);
			}
		},
		{
			description: 'Should succeed with a 200 and an array with formatted productImages if productImages are found',
			request: {},
			response: {
				code: 200,
				body: [{ ...productImageFormatted }],
				headers: {
					'x-janis-total': 1
				}
			},
			before: sandbox => {
				sandbox.stub(ProductImageModel.prototype, 'get');
				ProductImageModel.prototype.get.resolves([{ ...productImage }]);

				sandbox.stub(ProductImageModel.prototype, 'getTotals');
				ProductImageModel.prototype.getTotals.returns({ total: 1 });
			}
		}
	]);

	describe('Filtering', () => {

		const filters = [
			['id', 'foo', 'foo', 'id'],
			['status', 'foo', 'foo', 'status'],
			['userCreated', 'foo', 'foo', 'userCreated']
		];

		ApiTest(ProductImageListApi, '/api/product-image', filters.map(([field, data, queryValue, internalName]) => ({
			description: \`Should pass the \${field} filter to the model\`,
			request: {
				data: {
					filters: {
						[field]: data
					}
				}
			},
			response: {},
			before: sandbox => {
				sandbox.stub(ProductImageModel.prototype, 'get');
				ProductImageModel.prototype.get.resolves([]);
			},
			after: (response, sandbox) => {
				sandbox.assert.calledOnce(ProductImageModel.prototype.get);
				sandbox.assert.calledWithExactly(ProductImageModel.prototype.get, {
					page: 1,
					limit: 60,
					filters: {
						[internalName || field]: queryValue
					}
				});
			}
		})));
	});

	describe('Sorting', () => {

		const sorting = [
			'dateCreated'
		];

		ApiTest(ProductImageListApi, '/api/product-image', sorting.map(field => ({
			description: \`Should pass the \${field} sort field to the model\`,
			request: {
				data: {
					sortBy: field
				}
			},
			response: {},
			before: sandbox => {
				sandbox.stub(ProductImageModel.prototype, 'get');
				ProductImageModel.prototype.get.resolves([]);
			},
			after: (response, sandbox) => {
				sandbox.assert.calledOnce(ProductImageModel.prototype.get);
				sandbox.assert.calledWithExactly(ProductImageModel.prototype.get, {
					page: 1,
					limit: 60,
					order: {
						[field]: 'asc'
					}
				});
			}
		})));

		ApiTest(ProductImageListApi, '/api/product-image', [
			{
				description: 'Should pass the sort direction to the model',
				request: {
					data: {
						sortBy: sorting[0],
						sortDirection: 'desc'
					}
				},
				response: {},
				before: sandbox => {
					sandbox.stub(ProductImageModel.prototype, 'get');
					ProductImageModel.prototype.get.resolves([]);
				},
				after: (response, sandbox) => {
					sandbox.assert.calledOnce(ProductImageModel.prototype.get);
					sandbox.assert.calledWithExactly(ProductImageModel.prototype.get, {
						page: 1,
						limit: 60,
						order: {
							[sorting[0]]: 'desc'
						}
					});
				}
			}
		]);
	});
});
`);
		});
	});
});
