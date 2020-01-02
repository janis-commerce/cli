'use strict';

const startcase = require('lodash.startcase');

module.exports = ({
	entity
}) => {

	const apiName = startcase(`${entity}-list-api`).replace(/ /g, '');

	return `'use strict';

const { ApiListData } = require('@janiscommerce/api-list');

module.exports = class ${apiName} extends ApiListData {

	get sortableFields() {
		return [];
	}

	get availableFilters() {
		return [];
	}

	async formatRows(rows) {
		return rows;
	}

};
`;
};
