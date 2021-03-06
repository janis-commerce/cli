'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/model');

describe('Templates', () => {
	describe('Model source', () => {

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
				entity: 'productImage',
				entityPlural: 'productImages'
			});

			assert.deepStrictEqual(result, `'use strict';

const Model = require('@janiscommerce/model');

module.exports = class ProductImage extends Model {

	static get table() {
		return 'productImages';
	}

};
`);
		});
	});
});
