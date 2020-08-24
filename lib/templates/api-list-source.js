'use strict';

const startcase = require('lodash.startcase');

const { booleanRegexp, numberRegexp, dateRegexp } = require('../utils');

const getFilterValueMapper = filterName => {

	if(filterName.match(booleanRegexp))
		return 'booleanMapper';

	if(filterName.match(numberRegexp))
		return 'Number';

	if(filterName.match(dateRegexp))
		return 'dateMapper';

	if(filterName === 'name')
		return 'searchMapper';
};

const getFilterConfig = filterName => {

	const valueMapper = getFilterValueMapper(filterName);

	if(valueMapper)
		return `{ name: '${filterName}', valueMapper: ${valueMapper} }`;

	return `'${filterName}'`;
};

const getRequireStatement = filters => {

	const exportedMappers = new Set();

	filters.forEach(filter => {
		const valueMapper = getFilterValueMapper(filter);

		if(valueMapper && valueMapper.match(/^[a-z]/))
			exportedMappers.add(valueMapper);
	});

	if(exportedMappers.size === 0)
		return 'const { ApiListData } = require(\'@janiscommerce/api-list\');';

	const mappersArray = [...exportedMappers];

	return `const {
	ApiListData,
	FilterMappers: {
		${mappersArray.join(',\n\t\t')}
	}
} = require('@janiscommerce/api-list');`;

};

module.exports = ({
	entity,
	sortableFields,
	availableFilters
}) => {

	const apiName = startcase(`${entity}-list-api`).replace(/ /g, '');

	return `'use strict';

${getRequireStatement(availableFilters)}

module.exports = class ${apiName} extends ApiListData {

	get sortableFields() {
		return [
			${sortableFields.map(f => `'${f}'`).join(',\n\t\t\t')}
		];
	}

	get availableFilters() {
		return [
			${availableFilters.map(f => getFilterConfig(f)).join(',\n\t\t\t')}
		];
	}

	async formatRows(rows) {
		return rows;
	}

};
`;
};
