'use strict';

const assert = require('assert');
const sinon = require('sinon');

const template = require('../../lib/templates/entity-base-schema');

describe('Templates', () => {
	describe('Entity base schema', () => {

		before(() => {
			sinon.stub(Date.prototype, 'toISOString').returns('2020-01-09T21:34:38.897Z');
		});

		after(() => {
			sinon.restore();
		});

		it('Should return the entity base schema', () => {
			const result = template({
				entity: 'productImage',
				fields: ['id', 'someField', 'isDefault', 'qty', 'hasEntity', 'status', 'dateCreated', 'userCreated', 'dateModified', 'userModified']
			});

			assert.deepStrictEqual(result, {
				components: {
					schemas: {
						ProductImage: {
							type: 'object',
							description: 'A Product Image',
							properties: {
								id: {
									$ref: '#/components/schemas/id'
								},
								someField: {
									type: 'string',
									description: 'ADD A DESCRIPTION',
									example: 'bar'
								},
								isDefault: {
									type: 'boolean',
									description: 'ADD A DESCRIPTION',
									example: true
								},
								qty: {
									type: 'number',
									description: 'ADD A DESCRIPTION',
									example: 10
								},
								hasEntity: {
									type: 'boolean',
									description: 'ADD A DESCRIPTION',
									example: true
								},
								status: {
									$ref: '#/components/schemas/status'
								},
								dateCreated: {
									$ref: '#/components/schemas/dateCreated'
								},
								userCreated: {
									$ref: '#/components/schemas/userCreated'
								},
								dateModified: {
									$ref: '#/components/schemas/dateModified'
								},
								userModified: {
									$ref: '#/components/schemas/userModified'
								}
							},
							required: [
								'id',
								'someField',
								'isDefault',
								'qty',
								'hasEntity',
								'status',
								'dateCreated',
								'userCreated',
								'dateModified',
								'userModified'
							]
						}
					}
				}
			});
		});
	});
});
