'use strict';

const assert = require('assert');

const template = require('../../lib/templates/function-without-payload-schema');

describe('Templates', () => {
	describe('Function without payload schema', () => {

		it('Should return the function schema ', () => {
			const result = template({
				functionName: 'publish-products'
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/publish-products': {
						post: {
							'x-janis-namespace': undefined,
							'x-janis-method': undefined,
							'x-janis-permissions': [],
							operationId: 'publish-products',
							summary: 'publish-products',
							tags: [
								'Functions'
							],
							responses: {
								200: {
									$ref: '#/components/responses/GenericSuccess'
								},
								400: {
									$ref: '#/components/responses/BadRequest'
								},
								401: {
									$ref: '#/components/responses/Unauthorized'
								},
								403: {
									$ref: '#/components/responses/Forbidden'
								},
								500: {
									$ref: '#/components/responses/InternalError'
								}
							}
						}
					}
				}
			});
		});
	});
});
