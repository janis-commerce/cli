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

		it('Should return the test source code as a string for client models', () => {
			const result = template({
				entity: 'productImage',
				entityPlural: 'productImages',
				auth: 'full'
			});

			assert.deepStrictEqual(result, `'use strict';

const assert = require('assert');

const ProductImageModel = require('../../src/models/product-image');

describe('Product Image Model', () => {

	it('Should return the correct databaseKey', () => {
		assert.deepStrictEqual(ProductImageModel.prototype.databaseKey, 'default');
	});

	it('Should return the table name', () => {
		assert.deepStrictEqual(ProductImageModel.table, 'product-images');
	});

	it('Should return the indexes', async () => {
		assert.deepStrictEqual(ProductImageModel.indexes, []);
	});
});
`);
		});

		it('Should return the test source code as a string for core models', () => {
			const result = template({
				entity: 'productImage',
				entityPlural: 'productImages',
				auth: 'core'
			});

			assert.deepStrictEqual(result, `'use strict';

const assert = require('assert');

const ProductImageModel = require('../../src/models/product-image');

describe('Product Image Model', () => {

	it('Should return the correct databaseKey', () => {
		assert.deepStrictEqual(ProductImageModel.prototype.databaseKey, 'core');
	});

	it('Should return the table name', () => {
		assert.deepStrictEqual(ProductImageModel.table, 'product-images');
	});

	it('Should return the indexes', async () => {
		assert.deepStrictEqual(ProductImageModel.indexes, []);
	});
});
`);
		});
	});
});
