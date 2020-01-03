'use strict';

const startcase = require('lodash.startcase');

module.exports = ({ entity }) => {

	const apiName = startcase(`${entity}-get-api`).replace(/ /g, '');

	return `'use strict';

const { ApiGet } = require('@janiscommerce/api-get');

module.exports = class ${apiName} extends ApiGet {

	get fieldsToSelect() {
		return undefined;
	}

	async format(record) {
		return record;
	}

};
`;
};
