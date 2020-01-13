'use strict';

const assert = require('assert');

const template = require('../../lib/templates/event-listener-schema');

describe('Templates', () => {
	describe('Event listener schema', () => {

		it('Should return the schema with required client', () => {
			const result = template({
				service: 'my-service',
				entity: 'productImage',
				event: 'created',
				mustHaveClient: true
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/listener/my-service/product-image/created': {
						post: {
							'x-janis-namespace': 'my-service-product-image',
							'x-janis-method': 'created-listener',
							'x-janis-permissions': [],
							operationId: 'myServiceProductImageCreatedListener',
							security: [{
								ApiKey: [],
								ApiSecret: [],
								JanisClient: []
							}],
							tags: ['Event Listeners'],
							summary: 'My Service Product Image Created Event Listener',
							requestBody: {
								description: 'The event',
								required: true,
								content: {
									'application/json': {
										schema: {
											$ref: '#/components/schemas/listenerEvent'
										}
									}
								}
							},
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

		it('Should return the schema without required client', () => {
			const result = template({
				service: 'my-service',
				entity: 'productImage',
				event: 'created',
				mustHaveClient: false
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/listener/my-service/product-image/created': {
						post: {
							'x-janis-namespace': 'my-service-product-image',
							'x-janis-method': 'created-listener',
							'x-janis-permissions': [],
							operationId: 'myServiceProductImageCreatedListener',
							security: [{
								ApiKey: [],
								ApiSecret: []
							}],
							tags: ['Event Listeners'],
							summary: 'My Service Product Image Created Event Listener',
							requestBody: {
								description: 'The event',
								required: true,
								content: {
									'application/json': {
										schema: {
											$ref: '#/components/schemas/listenerEvent'
										}
									}
								}
							},
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
