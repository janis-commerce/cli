'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-post-source');

describe('Templates', () => {
	describe('API Create source', () => {

		it('Should return the source code as a string', () => {
			const result = template({
				entity: 'productImage',
				fields: ['id', 'status', 'dateCreated', 'userCreated']
			});

			assert.deepStrictEqual(result, `'use strict';

const { ApiSaveData } = require('@janiscommerce/api-save');
const { struct } = require('superstruct');

const mainStruct = struct.partial({
	status: 'string'
});

module.exports = class ProductImagePostApi extends ApiSaveData {

	static get mainStruct() {
		return mainStruct;
	}

	format(record) {
		return record;
	}

};
`);
		});
	});
});
