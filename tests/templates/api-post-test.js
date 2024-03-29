'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/api-post-test');

describe('Templates', () => {
	describe('API Create test', () => {

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
				testPath: 'productImage/post',
				sourcePath: 'productImage/post'
			});

			assert.deepStrictEqual(result, `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ProductImagePostApi = require('../../../src/api/product-image/post');
const ProductImageModel = require('../../../src/models/product-image');

const deleteProp = (object, prop) => {
	const { [prop]: propToRemove, ...newObject } = object;
	return newObject;
};

describe('Product Image Post Api', () => {

	const productImage = {
		status: 'active'
	};

	const productImageFormatted = {
		status: 'active'
	};

	ApiTest(ProductImagePostApi, '/api/product-image', [
		{
			description: 'Should return 400 if the required field \\'status\\' is not passed',
			request: {
				data: deleteProp(productImage, 'status')
			},
			response: {
				code: 400
			},
			before: sinon => {
				sinon.spy(ProductImageModel.prototype, 'insert');
			},
			after: (response, sinon) => {
				sinon.assert.notCalled(ProductImageModel.prototype.insert);
			}
		},
		{
			description: 'Should return 500 if the model fails to insert the productImage',
			request: {
				data: { ...productImage }
			},
			response: {
				code: 500
			},
			before: sinon => {
				sinon.stub(ProductImageModel.prototype, 'insert')
					.rejects(new Error('Error inserting'));
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(ProductImageModel.prototype.insert, { ...productImageFormatted });
			}
		},
		{
			description: 'Should save the formatted productImage with all the fields',
			request: {
				data: { ...productImage }
			},
			response: {
				code: 200,
				body: {
					id: '5dea9fc691240d00084083f8'
				}
			},
			before: sinon => {
				sinon.stub(ProductImageModel.prototype, 'insert')
					.resolves('5dea9fc691240d00084083f8');
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(ProductImageModel.prototype.insert, { ...productImageFormatted });
			}
		}
	]);
});
`);
		});
	});
});
