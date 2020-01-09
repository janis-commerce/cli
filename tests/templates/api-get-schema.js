'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-get-schema');

describe('Templates', () => {
	describe('API Get schema', () => {

		it('Should return the schema with no security', () => {
			const result = template({
				entity: 'productImage'
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/product-image/{id}': {
						get: {
							'x-janis-namespace': 'product-image',
							'x-janis-method': 'get',
							'x-janis-permissions': [],
							operationId: 'getProductImage',
							tags: ['Product Image'],
							summary: 'Get a Product Image',
							parameters: [{
								name: 'id',
								in: 'path',
								schema: {
									type: 'string',
									example: 'd555345345345as67a342a'
								},
								required: true,
								description: 'The entity ID'
							}],
							responses: {
								200: {
									description: 'Product Image found',
									content: {
										'application/json': {
											schema: {
												$ref: '#/components/schemas/ProductImage'
											}
										}
									}
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

		it('Should return the schema with security', () => {
			const result = template({
				entity: 'productImage',
				security: [{
					ApiKey: [],
					ApiSecret: [],
					JanisClient: []
				}]
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/product-image/{id}': {
						get: {
							'x-janis-namespace': 'product-image',
							'x-janis-method': 'get',
							'x-janis-permissions': [],
							operationId: 'getProductImage',
							tags: ['Product Image'],
							summary: 'Get a Product Image',
							security: [{
								ApiKey: [],
								ApiSecret: [],
								JanisClient: []
							}],
							parameters: [{
								name: 'id',
								in: 'path',
								schema: {
									type: 'string',
									example: 'd555345345345as67a342a'
								},
								required: true,
								description: 'The entity ID'
							}],
							responses: {
								200: {
									description: 'Product Image found',
									content: {
										'application/json': {
											schema: {
												$ref: '#/components/schemas/ProductImage'
											}
										}
									}
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
