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

	ApiTest(ProductImageGetApi, '/api/product-image/5dea9fc691240d00084083f8', [
		{
			description: 'Should fail with a 404 if no productImages are found',
			request: {},
			response: {
				code: 404
			},
			before: sandbox => {
				sandbox.stub(ProductImageModel.prototype, 'get');
				ProductImageModel.prototype.get.resolves([]);
			}
		},
		{
			description: 'Should pass the correct params to the model',
			request: {},
			response: {},
			before: sandbox => {
				sandbox.stub(ProductImageModel.prototype, 'get');
				ProductImageModel.prototype.get.resolves([{ ...productImage }]);
			},
			after: (response, sandbox) => {
				sandbox.assert.calledOnce(ProductImageModel.prototype.get);
				sandbox.assert.calledWithExactly(ProductImageModel.prototype.get, {
					filters: {
						id: '5dea9fc691240d00084083f8'
					},
					page: 1,
					limit: 1
				});
			}
		},
		{
			description: 'Should return the formatted object if the productImage is found',
			request: {},
			response: {
				code: 200,
				body: { ...productImageFormatted }
			},
			before: sandbox => {
				sandbox.stub(ProductImageModel.prototype, 'get');
				ProductImageModel.prototype.get.resolves([{ ...productImage }]);
			}
		}
	]);
});
`);
		});
	});
});
