'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/function-source');

describe('Templates', () => {
	describe('Function source', () => {

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

		context('When the function has client and payload', () => {

			it('Should return the source code as a string', () => {
				const result = template({
					functionName: 'PublishProducts',
					hasPayload: true,
					hasClient: true
				});

				assert.deepStrictEqual(result, `'use strict';

const { Handler, LambdaWithClientAndPayload } = require('@janiscommerce/lambda');

class PublishProducts extends LambdaWithClientAndPayload {

	async process() {
		// Process something
	}
}

module.exports.handler = (...args) => Handler.handle(PublishProducts, ...args);
`);
			});
		});

		context('When the function has only payload', () => {

			it('Should return the source code as a string', () => {
				const result = template({
					functionName: 'PublishProducts',
					hasPayload: true,
					hasClient: false
				});

				assert.deepStrictEqual(result, `'use strict';

const { Handler, LambdaWithPayload } = require('@janiscommerce/lambda');

class PublishProducts extends LambdaWithPayload {

	async process() {
		// Process something
	}
}

module.exports.handler = (...args) => Handler.handle(PublishProducts, ...args);
`);
			});
		});

		context('When the function has no payload', () => {

			it('Should return the source code as a string', () => {
				const result = template({
					functionName: 'PublishProducts',
					hasPayload: false,
					hasClient: true
				});

				assert.deepStrictEqual(result, `'use strict';

const { Handler, Lambda } = require('@janiscommerce/lambda');

class PublishProducts extends Lambda {

	async process() {
		// Process something
	}
}

module.exports.handler = (...args) => Handler.handle(PublishProducts, ...args);
`);
			});
		});
	});
});
