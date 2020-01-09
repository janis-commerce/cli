'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/api-source');

describe('Templates', () => {
	describe('API source', () => {

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

		it('Should return the source code as a string', () => {
			const result = template({
				janisNamespace: 'product',
				janisMethod: 'listPending'
			});

			assert.deepStrictEqual(result, `'use strict';

const { API } = require('@janiscommerce/api');

module.exports = class ListPendingProductApi extends API {

	get struct() {
		// Struct validation
	}

	async validate() {
		// Validate your API
	}

	async process() {
		// Your API code goes here
	}

};
`);
		});
	});
});
