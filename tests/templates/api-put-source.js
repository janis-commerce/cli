'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-put-source');

describe('Templates', () => {
	describe('API Update source', () => {

		it('Should return the source code as a string', () => {
			const result = template({
				entity: 'productImage',
				fields: ['id', 'status', 'dateCreated', 'userCreated']
			});

			assert.deepStrictEqual(result, `'use strict';

const { ApiSaveData } = require('@janiscommerce/api-save');
const { struct } = require('@janiscommerce/superstruct');

const mainStruct = struct.partial({
	status: 'string'
});

module.exports = class ProductImagePutApi extends ApiSaveData {

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
