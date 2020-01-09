'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/event-listener-test');

describe('Templates', () => {
	describe('Event listener test', () => {

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
				service: 'my-service',
				entity: 'productImage',
				event: 'created',
				mustHaveClient: true,
				mustHaveId: true
			});

			assert.deepStrictEqual(result, `'use strict';

const EventListenerTest = require('@janiscommerce/event-listener-test');

const ProductImageCreatedListener = require('../../../src/event-listeners/product-image/created.js');

describe('Product Image Created Listener', async () => {

	const validEvent = {
		service: 'my-service',
		entity: 'productImage',
		event: 'created',
		client: 'defaultClient',
		id: '5ddd38fbfd60ad001118dbec'
	};

	await EventListenerTest(ProductImageCreatedListener.handler, [
		{
			description: 'Should return 400 if the event has no client',
			session: true,
			event: {
				...validEvent,
				client: undefined
			},
			responseCode: 400
		},
		{
			description: 'Should return 400 if the event has no ID',
			session: true,
			event: {
				...validEvent,
				id: undefined
			},
			responseCode: 400
		},
		{
			description: 'Should return 200 if no errors ocur',
			session: true,
			event: { ...validEvent },
			responseCode: 200
		}
	]);
});
`);
		});

		it('Should return the test source code as a string testing client', () => {
			const result = template({
				service: 'my-service',
				entity: 'productImage',
				event: 'created',
				mustHaveClient: true,
				mustHaveId: false
			});

			assert.deepStrictEqual(result, `'use strict';

const EventListenerTest = require('@janiscommerce/event-listener-test');

const ProductImageCreatedListener = require('../../../src/event-listeners/product-image/created.js');

describe('Product Image Created Listener', async () => {

	const validEvent = {
		service: 'my-service',
		entity: 'productImage',
		event: 'created',
		client: 'defaultClient'
	};

	await EventListenerTest(ProductImageCreatedListener.handler, [
		{
			description: 'Should return 400 if the event has no client',
			session: true,
			event: {
				...validEvent,
				client: undefined
			},
			responseCode: 400
		},
		{
			description: 'Should return 200 if no errors ocur',
			session: true,
			event: { ...validEvent },
			responseCode: 200
		}
	]);
});
`);
		});

		it('Should return the test source code as a string testing id', () => {
			const result = template({
				service: 'my-service',
				entity: 'productImage',
				event: 'created',
				mustHaveClient: false,
				mustHaveId: true
			});

			assert.deepStrictEqual(result, `'use strict';

const EventListenerTest = require('@janiscommerce/event-listener-test');

const ProductImageCreatedListener = require('../../../src/event-listeners/product-image/created.js');

describe('Product Image Created Listener', async () => {

	const validEvent = {
		service: 'my-service',
		entity: 'productImage',
		event: 'created',
		id: '5ddd38fbfd60ad001118dbec'
	};

	await EventListenerTest(ProductImageCreatedListener.handler, [
		{
			description: 'Should return 400 if the event has no ID',
			session: false,
			event: {
				...validEvent,
				id: undefined
			},
			responseCode: 400
		},
		{
			description: 'Should return 200 if no errors ocur',
			session: false,
			event: { ...validEvent },
			responseCode: 200
		}
	]);
});
`);
		});

		it('Should return the test source code as a string without testing client and id', () => {
			const result = template({
				service: 'my-service',
				entity: 'productImage',
				event: 'created',
				mustHaveClient: false,
				mustHaveId: false
			});

			assert.deepStrictEqual(result, `'use strict';

const EventListenerTest = require('@janiscommerce/event-listener-test');

const ProductImageCreatedListener = require('../../../src/event-listeners/product-image/created.js');

describe('Product Image Created Listener', async () => {

	const validEvent = {
		service: 'my-service',
		entity: 'productImage',
		event: 'created'
	};

	await EventListenerTest(ProductImageCreatedListener.handler, [
		{
			description: 'Should return 200 if no errors ocur',
			session: false,
			event: { ...validEvent },
			responseCode: 200
		}
	]);
});
`);
		});
	});
});
