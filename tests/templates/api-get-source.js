'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-get-source');

describe('Templates', () => {
	describe('API Get source', () => {

		it('Should return the source code as a string', () => {
			const result = template({
				entity: 'productImage'
			});

			assert.deepStrictEqual(result, `'use strict';

const { ApiGet } = require('@janiscommerce/api-get');

module.exports = class ProductImageGetApi extends ApiGet {

	format(productImage) {
		return productImage;
	}
};
`);
		});
	});
});
