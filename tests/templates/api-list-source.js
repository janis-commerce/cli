'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-list-source');

describe('Templates', () => {
	describe('API List source', () => {

		it('Should return the source code as a string', () => {
			const result = template({
				entity: 'productImage',
				sortableFields: ['dateCreated'],
				availableFilters: ['id', 'status', 'userCreated']
			});

			assert.deepStrictEqual(result, `'use strict';

const { ApiListData } = require('@janiscommerce/api-list');

module.exports = class ProductImageListApi extends ApiListData {

	get sortableFields() {
		return [
			'dateCreated'
		];
	}

	get availableFilters() {
		return [
			'id',
			'status',
			'userCreated'
		];
	}

	async formatRows(rows) {
		return rows;
	}

};
`);
		});
	});
});
