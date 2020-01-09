'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-list-serverless-function');

describe('Templates', () => {
	describe('API List Serverless Function', () => {

		it('Should return the serverless helper function hook', () => {
			const result = template({
				entity: 'productImage'
			});

			assert.deepStrictEqual(result, [
				'janis.apiList',
				{
					entityName: 'product-image',
					authorizer: 'FullAuthorizer',
					cors: true
				}
			]);
		});
	});
});
