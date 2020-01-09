'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/api-test');

describe('Templates', () => {
	describe('API test', () => {

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
				path: '/pending-product',
				janisNamespace: 'product',
				janisMethod: 'listPending',
				testPath: 'pending-product/list',
				sourcePath: 'pending-product/list'
			});

			assert.deepStrictEqual(result, `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ListPendingProductApi = require('../../../src/api/pending-product/list');

describe('List Pending Product Api', () => {

	ApiTest(ListPendingProductApi, '/pending-product', [
	]);

});
`);
		});
	});
});
