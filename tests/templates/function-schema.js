'use strict';

const assert = require('assert');

const template = require('../../lib/templates/function-schema');

describe('Templates', () => {
	describe('Function with payload schema', () => {

		it('Should return the function schema (with Client) ', () => {
			const result = template({
				functionName: 'publish-products',
				hasClient: true,
				hasPayload: true
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/publish-products': {
						post: {
							'x-janis-namespace': undefined,
							'x-janis-method': undefined,
							'x-janis-permissions': [],
							operationId: 'publish-products',
							requestBody: {
								description: 'publish-products',
								required: true,
								content: {
									'application/json': {}
								}
							},
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

		it('Should return the function schema (without Client) ', () => {
			const result = template({
				functionName: 'publish-products',
				hasClient: false,
				hasPayload: true
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/publish-products': {
						post: {
							'x-janis-namespace': undefined,
							'x-janis-method': undefined,
							'x-janis-permissions': [],
							operationId: 'publish-products',
							requestBody: {
								description: 'publish-products',
								required: true,
								content: {
									'application/json': {}
								}
							},
							summary: 'publish-products',
							tags: [
								'Core-Functions'
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

	describe('Function without payload schema', () => {

		it('Should return the function schema (with Client)', () => {
			const result = template({
				functionName: 'publish-products',
				hasClient: true,
				hasPayload: false
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

		it('Should return the function schema (without Client)', () => {
			const result = template({
				functionName: 'publish-products',
				hasClient: false,
				hasPayload: false
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
								'Core-Functions'
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
