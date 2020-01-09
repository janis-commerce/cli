'use strict';

const assert = require('assert');

const template = require('../../lib/templates/event-listener-serverless-function');

describe('Templates', () => {
	describe('Event Listener Serverless Function', () => {

		it('Should return the serverless helper function hook with mandatory client', () => {
			const result = template({
				entity: 'productImage',
				event: 'created',
				mustHaveClient: true
			});

			assert.deepStrictEqual(result, [
				'janis.eventListener',
				{
					entityName: 'product-image',
					eventName: 'created',
					mustHaveClient: true
				}
			]);
		});

		it('Should return the serverless helper function hook without mandatory client', () => {
			const result = template({
				entity: 'productImage',
				event: 'created',
				mustHaveClient: false
			});

			assert.deepStrictEqual(result, [
				'janis.eventListener',
				{
					entityName: 'product-image',
					eventName: 'created',
					mustHaveClient: false
				}
			]);
		});
	});
});
