'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/api-put-test');

describe('Templates', () => {
	describe('API Update test', () => {

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
				testPath: 'productImage/put',
				sourcePath: 'productImage/put'
			});

			assert.deepStrictEqual(result, `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ProductImagePutApi = require('../../../src/api/product-image/put');
const ProductImageModel = require('../../../src/models/product-image');

const deleteProp = (object, prop) => {
	const { [prop]: propToRemove, ...newObject } = object;
	return newObject;
};

describe('Product Image Put Api', () => {

	const id = '5dea9fc691240d00084083f8';
	const apiPath = '/api/product-image/5dea9fc691240d00084083f8';

	const productImage = {
		status: 'active'
	};

	const productImageFormatted = {
		status: 'active'
	};

	ApiTest(ProductImagePutApi, apiPath, [
		{
			description: 'Should return 400 if the required field \\'status\\' is not passed',
			request: {
				data: deleteProp(productImage, 'status')
			},
			response: {
				code: 400
			},
			before: sinon => {
				sinon.spy(ProductImageModel.prototype, 'update');
			},
			after: (response, sinon) => {
				sinon.assert.notCalled(ProductImageModel.prototype.update);
			}
		},
		{
			description: 'Should return 500 if the model fails to update the productImage',
			request: {
				data: { ...productImage }
			},
			response: {
				code: 500
			},
			before: sinon => {
				sinon.stub(ProductImageModel.prototype, 'update')
					.rejects(new Error('Error updating'));
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(ProductImageModel.prototype.update, { ...productImageFormatted }, { id });
			}
		},
		{
			description: 'Should update the productImage with all the formatted fields',
			request: {
				data: { ...productImage }
			},
			response: {
				code: 200,
				body: { id }
			},
			before: sinon => {
				sinon.stub(ProductImageModel.prototype, 'update')
					.resolves(1);
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(ProductImageModel.prototype.update, { ...productImageFormatted }, { id });
			}
		}
	]);
});
`);
		});
	});
});
