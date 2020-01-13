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
				fields: ['id', 'someField', 'status', 'dateCreated', 'userCreated', 'dateModified', 'userModified']
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
									description: 'The Product Image ID',
									example: '5dea9fc691240d00084083f8'
								},
								someField: {
									type: 'string',
									description: 'ADD A DESCRIPTION',
									example: 'bar'
								},
								status: {
									type: 'string',
									description: 'The Product Image status',
									example: 'active'
								},
								dateCreated: {
									type: 'string',
									format: 'date-time',
									description: 'The creation date',
									example: '2020-01-09T21:34:38.897Z'
								},
								userCreated: {
									type: 'string',
									description: 'The creation user ID',
									example: '5dea9fc691240d00084083f9'
								},
								dateModified: {
									type: 'string',
									format: 'date-time',
									description: 'The last modification date',
									example: '2020-01-09T21:34:38.897Z'
								},
								userModified: {
									type: 'string',
									description: 'The last modification user ID',
									example: '5dea9fc691240d0008408301'
								}
							},
							required: [
								'id',
								'someField',
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
