'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/event-listener-source');

describe('Templates', () => {
	describe('Event listener source', () => {

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
				service: 'my service',
				entity: 'productImage',
				event: 'created',
				mustHaveClient: true,
				mustHaveId: true
			});

			assert.deepStrictEqual(result, `'use strict';

const {
	EventListener,
	ServerlessHandler
} = require('@janiscommerce/event-listener');

const logger = require('lllog')();

class MyServiceProductImageCreatedListener extends EventListener {

	get mustHaveClient() {
		return true;
	}

	get mustHaveId() {
		return true;
	}

	async process() {
		// Your code goes here
		logger.info('Event received');
	}

}

module.exports.handler = (...args) => ServerlessHandler.handle(MyServiceProductImageCreatedListener, ...args);
`);
		});
	});
});
