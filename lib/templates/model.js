'use strict';

const startcase = require('lodash.startcase');

module.exports = ({
	entity,
	entityPlural
}) => {

	const modelName = startcase(`${entity}`).replace(/ /g, '');

	return `'use strict';

const Model = require('@janiscommerce/model');

module.exports = class ${modelName} extends Model {

	static get table() {
		return '${entityPlural}';
	}

	static get uniqueIndexes() {
		return [];
	}

};
`;
};
