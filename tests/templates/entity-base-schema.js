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
				fields: ['id', 'status', 'dateCreated', 'userCreated']
			});

			assert.deepStrictEqual(result, {
				components: {
					schemas: {
						ProductImage: {
							type: 'object',
							description: 'A Product Image',
							properties: {
								id: {
									type: 'string',
									description: 'ADD A DESCRIPTION',
									example: '5dea9fc691240d00084083f8'
								},
								status: {
									type: 'string',
									description: 'ADD A DESCRIPTION',
									example: 'active'
								},
								dateCreated: {
									type: 'string',
									description: 'ADD A DESCRIPTION',
									example: '2020-01-09T21:34:38.897Z'
								},
								userCreated: {
									type: 'string',
									description: 'ADD A DESCRIPTION',
									example: '5dea9fc691240d00084083f9'
								}
							},
							required: ['id', 'status', 'dateCreated', 'userCreated']
						}
					}
				}
			});
		});
	});
});
