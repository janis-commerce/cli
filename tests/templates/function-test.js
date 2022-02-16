'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/function-test');

describe('Templates', () => {
	describe('Function test', () => {

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
				functionName: 'PublishProducts',
				functionPath: 'PublishProducts'
			});

			assert.deepStrictEqual(result, `'use strict';

const sinon = require('sinon');

const { handler: PublishProducts } = require('/var/www/root-path/src/lambda/PublishProducts/PublishProducts.js');

describe('Function PublishProducts', () => {

	afterEach(() => {
		sinon.restore();
	});

	context('When event is invalid', () => {

		beforeEach(() => {
			// Some spies maybe?
		});

		afterEach(() => {
			// Some notCalled maybe?
		});
	});

	context('When event is valid', () => {

		const validEvent = {};
	});
});
`);
		});
	});
});
