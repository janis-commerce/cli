'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-post-schema');

describe('Templates', () => {
	describe('API Create schema', () => {

		it('Should return the schema with no security', () => {
			const result = template({
				entity: 'productImage'
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/product-image': {
						post: {
							'x-janis-namespace': 'product-image',
							'x-janis-method': 'create',
							'x-janis-permissions': [],
							operationId: 'createProductImage',
							tags: ['Product Image'],
							summary: 'Create a Product Image',
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
							responses: {
								200: {
									description: 'The Product Image was created',
									content: {
										'application/json': {
											schema: {
												type: 'object',
												properties: {
													id: {
														$ref: '#/components/schemas/ProductImage/properties/id'
													}
												}
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
					'/product-image': {
						post: {
							'x-janis-namespace': 'product-image',
							'x-janis-method': 'create',
							'x-janis-permissions': [],
							operationId: 'createProductImage',
							tags: ['Product Image'],
							summary: 'Create a Product Image',
							security: [{
								ApiKey: [],
								ApiSecret: [],
								JanisClient: []
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
							responses: {
								200: {
									description: 'The Product Image was created',
									content: {
										'application/json': {
											schema: {
												type: 'object',
												properties: {
													id: {
														$ref: '#/components/schemas/ProductImage/properties/id'
													}
												}
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
