'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-post-serverless-function');

describe('Templates', () => {
	describe('API Create Serverless Function', () => {

		it('Should return the serverless helper function hook', () => {
			const result = template({
				entity: 'productImage'
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
	});
});
