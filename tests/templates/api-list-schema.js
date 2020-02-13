'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-list-schema');

describe('Templates', () => {
	describe('API List schema', () => {

		it('Should return the schema with no security', () => {
			const result = template({
				entity: 'productImage',
				entityPlural: 'productImages',
				sortableFields: ['dateCreated'],
				availableFilters: ['id', 'isDefault', 'status', 'userCreated', 'dateCreated']
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/product-image': {
						get: {
							'x-janis-namespace': 'product-image',
							'x-janis-method': 'list',
							'x-janis-permissions': [],
							operationId: 'listProductImages',
							tags: ['Product Image'],
							summary: 'List Product Images',
							parameters: [
								{ $ref: '#/components/parameters/ProductImageSortBy' },
								{ $ref: '#/components/parameters/ProductImageFilters' },
								{ $ref: '#/components/parameters/ListSortDirection' },
								{ $ref: '#/components/parameters/ListPageNumber' },
								{ $ref: '#/components/parameters/ListPageSize' }
							],
							responses: {
								200: {
									description: 'Product Images listed',
									content: {
										'application/json': {
											schema: {
												$ref: '#/components/schemas/ProductImageList'
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
				},
				components: {
					schemas: {
						ProductImageList: {
							type: 'array',
							description: 'A list of Product Images',
							items: {
								$ref: '#/components/schemas/ProductImage'
							}
						}
					},
					parameters: {
						ProductImageSortBy: {
							name: 'sortBy',
							in: 'query',
							description: 'The field to sort by',
							required: false,
							schema: {
								type: 'string',
								enum: ['dateCreated']
							}
						},
						ProductImageFilters: {
							name: 'filters',
							in: 'query',
							description: 'The filters to apply to the list',
							required: false,
							style: 'deepObject',
							explode: true,
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'The Product Image ID'
									},
									isDefault: {
										type: 'boolean',
										description: 'ADD A DESCRIPTION'
									},
									status: {
										type: 'string',
										description: 'The Product Image status',
										enum: ['active', 'inactive']
									},
									userCreated: {
										type: 'string',
										description: 'The creation user ID'
									},
									dateCreated: {
										type: 'string',
										format: 'date-time',
										description: 'The creation date'
									}
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
				entityPlural: 'productImages',
				sortableFields: ['dateCreated'],
				availableFilters: ['id', 'isDefault', 'status', 'userCreated', 'dateCreated'],
				security: [{
					ApiKey: [],
					ApiSecret: [],
					JanisClient: []
				}]
			});

			assert.deepStrictEqual(result, {
				paths: {
					'/product-image': {
						get: {
							'x-janis-namespace': 'product-image',
							'x-janis-method': 'list',
							'x-janis-permissions': [],
							operationId: 'listProductImages',
							tags: ['Product Image'],
							summary: 'List Product Images',
							security: [{
								ApiKey: [],
								ApiSecret: [],
								JanisClient: []
							}],
							parameters: [
								{ $ref: '#/components/parameters/ProductImageSortBy' },
								{ $ref: '#/components/parameters/ProductImageFilters' },
								{ $ref: '#/components/parameters/ListSortDirection' },
								{ $ref: '#/components/parameters/ListPageNumber' },
								{ $ref: '#/components/parameters/ListPageSize' }
							],
							responses: {
								200: {
									description: 'Product Images listed',
									content: {
										'application/json': {
											schema: {
												$ref: '#/components/schemas/ProductImageList'
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
				},
				components: {
					schemas: {
						ProductImageList: {
							type: 'array',
							description: 'A list of Product Images',
							items: {
								$ref: '#/components/schemas/ProductImage'
							}
						}
					},
					parameters: {
						ProductImageSortBy: {
							name: 'sortBy',
							in: 'query',
							description: 'The field to sort by',
							required: false,
							schema: {
								type: 'string',
								enum: ['dateCreated']
							}
						},
						ProductImageFilters: {
							name: 'filters',
							in: 'query',
							description: 'The filters to apply to the list',
							required: false,
							style: 'deepObject',
							explode: true,
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'The Product Image ID'
									},
									isDefault: {
										type: 'boolean',
										description: 'ADD A DESCRIPTION'
									},
									status: {
										type: 'string',
										description: 'The Product Image status',
										enum: ['active', 'inactive']
									},
									userCreated: {
										type: 'string',
										description: 'The creation user ID'
									},
									dateCreated: {
										type: 'string',
										format: 'date-time',
										description: 'The creation date'
									}
								}
							}
						}
					}
				}
			});
		});
	});
});
