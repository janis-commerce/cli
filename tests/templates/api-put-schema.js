'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-put-schema');

describe('Templates', () => {

	const expectedResponses = {
		200: {
			$ref: '#/components/responses/SuccessUpdateResponse'
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
	};

	describe('API Update schema', () => {

		it('Should return the schema with no security', () => {
			const result = template({
				entity: 'productImage'
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/product-image/{id}': {
						put: {
							'x-janis-namespace': 'product-image',
							'x-janis-method': 'update',
							'x-janis-permissions': [],
							operationId: 'updateProductImage',
							tags: ['Product Image'],
							summary: 'Update a Product Image',
							parameters: [{
								$ref: '#/components/parameters/id'
							}],
							requestBody: {
								description: 'A Product Image',
								required: true,
								content: {
									'application/json': {
										schema: {
											$ref: '#/components/schemas/ProductImage'
										}
									}
								}
							},
							responses: expectedResponses
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
						put: {
							'x-janis-namespace': 'product-image',
							'x-janis-method': 'update',
							'x-janis-permissions': [],
							operationId: 'updateProductImage',
							tags: ['Product Image'],
							summary: 'Update a Product Image',
							security: [{
								ApiKey: [],
								ApiSecret: [],
								JanisClient: []
							}],
							parameters: [{
								$ref: '#/components/parameters/id'
							}],
							requestBody: {
								description: 'A Product Image',
								required: true,
								content: {
									'application/json': {
										schema: {
											$ref: '#/components/schemas/ProductImage'
										}
									}
								}
							},
							responses: expectedResponses
						}
					}
				}
			});
		});
	});
});
