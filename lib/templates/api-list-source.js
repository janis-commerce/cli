'use strict';

const startcase = require('lodash.startcase');

module.exports = ({
	entity,
	sortableFields,
	availableFilters
}) => {

	const apiName = startcase(`${entity}-list-api`).replace(/ /g, '');

	return `'use strict';

const { ApiListData } = require('@janiscommerce/api-list');

module.exports = class ${apiName} extends ApiListData {

	get sortableFields() {
		return [
			${sortableFields.map(f => `'${f}'`).join(',\n\t\t\t')}
		];
	}

	get availableFilters() {
		return [
			${availableFilters.map(f => `'${f}'`).join(',\n\t\t\t')}
		];
	}

	async formatRows(rows) {
		return rows;
	}

};
`;
};
