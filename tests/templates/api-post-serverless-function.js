'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-post-serverless-function');

describe('Templates', () => {
	describe('API Create Serverless Function', () => {

		it('Should return the serverless helper function hook without authorizer', () => {
			const result = template({
				entity: 'productImage'
			});

			assert.deepStrictEqual(result, [
				'janis.apiPost',
				{
					entityName: 'product-image',
					cors: true
				}
			]);
		});

		it('Should return the serverless helper function hook with FullAuthorizer', () => {
			const result = template({
				entity: 'productImage',
				auth: 'full'
			});

			assert.deepStrictEqual(result, [
				'janis.apiPost',
				{
					entityName: 'product-image',
					authorizer: 'FullAuthorizer',
					cors: true
				}
			]);
		});

		it('Should return the serverless helper function hook with NoClientAuthorizer', () => {
			const result = template({
				entity: 'productImage',
				auth: 'core'
			});

			assert.deepStrictEqual(result, [
				'janis.apiPost',
				{
					entityName: 'product-image',
					authorizer: 'NoClientAuthorizer',
					cors: true
				}
			]);
		});
	});
});
