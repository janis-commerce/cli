'use strict';

const startcase = require('lodash.startcase');

module.exports = ({
	entity
}) => {

	const modelName = startcase(`${entity}-model`).replace(/ /g, '');

	return `'use strict';

const Model = require('@janiscommerce/model');

module.exports = class ${modelName} extends Model {

	get databaseKey() {
		return 'core';
	}

	static get table() {
		return '${entity}s';
	}

	static get uniqueIndexes() {
		return [];
	}

};
`;
};
