'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-get-serverless-function');

describe('Templates', () => {
	describe('API Get Serverless Function', () => {

		it('Should return the serverless helper function hook', () => {
			const result = template({
				entity: 'productImage'
			});

			assert.deepStrictEqual(result, [
				'janis.apiGet',
				{
					entityName: 'product-image',
					authorizer: 'FullAuthorizer',
					cors: true
				}
			]);
		});
	});
});
