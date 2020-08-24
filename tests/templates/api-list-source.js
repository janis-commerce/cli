'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-list-source');

describe('Templates', () => {
	describe('API List source', () => {

		it('Should return the source code as a string with no imported valueMappers', () => {
			const result = template({
				entity: 'productImage',
				sortableFields: ['dateCreated'],
				availableFilters: ['id', 'quantity', 'status', 'userCreated']
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
			{ name: 'quantity', valueMapper: Number },
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

		it('Should return the source code as a string with some exported valueMappers', () => {
			const result = template({
				entity: 'productImage',
				sortableFields: ['dateCreated'],
				availableFilters: ['id', 'name', 'hasHeight', 'itemsQuantity', 'status', 'dateCreated', 'userCreated']
			});

			assert.deepStrictEqual(result, `'use strict';

const {
	ApiListData,
	FilterMappers: {
		searchMapper,
		booleanMapper,
		dateMapper
	}
} = require('@janiscommerce/api-list');

module.exports = class ProductImageListApi extends ApiListData {

	get sortableFields() {
		return [
			'dateCreated'
		];
	}

	get availableFilters() {
		return [
			'id',
			{ name: 'name', valueMapper: searchMapper },
			{ name: 'hasHeight', valueMapper: booleanMapper },
			{ name: 'itemsQuantity', valueMapper: Number },
			'status',
			{ name: 'dateCreated', valueMapper: dateMapper },
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
