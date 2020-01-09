'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-schema');

describe('Templates', () => {
	describe('API schema', () => {

		it('Should return the schema with minimal configuration', () => {
			const result = template({
				path: '/pending-product',
				method: 'get',
				janisNamespace: 'product',
				janisMethod: 'listPending'
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/pending-product': {
						get: {
							'x-janis-namespace': 'product',
							'x-janis-method': 'listPending',
							'x-janis-permissions': [],
							operationId: 'listPendingProduct',
							tags: ['SELECT A TAG'],
							summary: 'COMPLETE API SUMMARY',
							responses: {
								200: {
									$ref: '#/components/responses/listPendingProduct'
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

		it('Should override default values if they are passed', () => {
			const result = template({
				path: '/pending-product',
				method: 'get',
				janisNamespace: 'product',
				janisMethod: 'listPending',
				operationId: 'bestOperation',
				permissions: ['s:n:m'],
				tags: ['MySuperTag'],
				summary: 'The best API',
				security: [{
					ApiKey: [],
					ApiSecret: []
				}],
				parameters: [{
					in: 'header',
					name: 'x-foo'
				}],
				responses: {
					200: {
						$ref: '#/components/responses/myCustomResponse'
					}
				},
				extraSchemaStuff: {
					components: {
						responses: {
							myCustomResponse: {
								description: 'This is the best response'
							}
						}
					}
				}
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/pending-product': {
						get: {
							'x-janis-namespace': 'product',
							'x-janis-method': 'listPending',
							'x-janis-permissions': ['s:n:m'],
							operationId: 'bestOperation',
							tags: ['MySuperTag'],
							summary: 'The best API',
							security: [{
								ApiKey: [],
								ApiSecret: []
							}],
							parameters: [{
								in: 'header',
								name: 'x-foo'
							}],
							responses: {
								200: {
									$ref: '#/components/responses/myCustomResponse'
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
				},
				components: {
					responses: {
						myCustomResponse: {
							description: 'This is the best response'
						}
					}
				}
			});
		});
	});
});
