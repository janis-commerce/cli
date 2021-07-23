'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/api-get-test');

describe('Templates', () => {
	describe('API Get test', () => {

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
				entityPlural: 'productImages',
				fields: ['id', 'status', 'dateCreated', 'userCreated'],
				testPath: 'productImage/get',
				sourcePath: 'productImage/get'
			});

			assert.deepStrictEqual(result, `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ProductImageGetApi = require('../../../src/api/product-image/get');
const ProductImageModel = require('../../../src/models/product-image');

describe('Product Image Get Api', () => {

	const id = '5dea9fc691240d00084083f8';
	const apiPath = '/api/product-image/5dea9fc691240d00084083f8';

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

	ApiTest(ProductImageGetApi, apiPath, [
		{
			description: 'Should fail with a 404 if no productImage are found',
			request: {},
			response: {
				code: 404
			},
			before: sinon => {
				sinon.spy(ProductImageModel.prototype, 'get');
			},
			after: (response, sinon) => {
				sinon.assert.notCalled(ProductImageModel.prototype.get);
			}
		},
		{
			description: 'Should return 200 with the formatted object if the productImage is found',
			request: {},
			response: {
				code: 200,
				body: { ...productImageFormatted }
			},
			before: sinon => {
				sinon.stub(ProductImageModel.prototype, 'get')
					.resolves([{ ...productImage }]);
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(ProductImageModel.prototype.get, {
					filters: { id },
					page: 1,
					limit: 1
				});
			}
		},
		{
			description: 'Should return 500 when the model fails',
			request: {},
			response: {
				code: 500,
				body: { message: 'Some DB Error' }
			},
			before: sinon => {
				sinon.stub(ProductImageModel.prototype, 'get')
					.rejects(new Error('Some DB Error'))
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(ProductImageModel.prototype.get, {
					filters: { id },
					page: 1,
					limit: 1
				});
			}
		}
	]);
});
`);
		});
	});
});
