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
								$ref: '#/components/parameters/id'
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
				auth: 'full'
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
								$ref: '#/components/parameters/id'
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
