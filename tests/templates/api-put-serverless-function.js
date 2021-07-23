'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-put-serverless-function');

describe('Templates', () => {
	describe('API Update Serverless Function', () => {

		it('Should return the serverless helper function hook without', () => {
			const result = template({
				entity: 'productImage'
			});

			assert.deepStrictEqual(result, [
				'janis.apiPut',
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
				'janis.apiPut',
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
				'janis.apiPut',
				{
					entityName: 'product-image',
					authorizer: 'NoClientAuthorizer',
					cors: true
				}
			]);
		});
	});
});
