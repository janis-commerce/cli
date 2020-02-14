'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/model-test');

describe('Templates', () => {
	describe('Model test', () => {

		const cwd = '/var/www/root-path';

		const env = { ...process.env };

		before(() => {
			process.env.MS_PATH = 'src';
			sinon.stub(process, 'cwd').returns(cwd);
		});

		after(() => {
			sinon.restore();
			process.env = env;
		});

		it('Should return the test source code as a string', () => {
			const result = template({
				entity: 'productImage',
				entityPlural: 'productImages'
			});

			assert.deepStrictEqual(result, `'use strict';

const assert = require('assert');

const ProductImageModel = require('../../src/models/product-image.js');

describe('Product Image Model', () => {

	describe('Getters', () => {

		it('Should not return any databaseKey', () => {
			assert.deepStrictEqual(ProductImageModel.prototype.databaseKey, undefined);
		});

		it('Should return the table name', () => {
			assert.deepStrictEqual(ProductImageModel.table, 'productImages');
		});

		it('Should return the uniqueIndexes', async () => {
			assert.deepStrictEqual(ProductImageModel.uniqueIndexes, []);
		});
	});
});
`);
		});
	});
});
