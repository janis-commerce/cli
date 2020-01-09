'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/event-listener');

describe('Templates', () => {
	describe('Event listener subscription', () => {

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

		it('Should return the test source code as a string testing client and id', () => {
			const result = template({
				entity: 'productImage',
				event: 'created'
			});

			assert.deepStrictEqual(result, {
				namespace: 'product-image',
				method: 'created-listener'
			});
		});
	});
});
