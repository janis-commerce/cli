'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-put-serverless-function');

describe('Templates', () => {
	describe('API Update Serverless Function', () => {

		it('Should return the serverless helper function hook', () => {
			const result = template({
				entity: 'productImage'
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
	});
});
