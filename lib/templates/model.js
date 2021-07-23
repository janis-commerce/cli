'use strict';

const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

module.exports = ({
	entity,
	entityPlural
}) => {

	const modelName = startcase(`${entity}`).replace(/ /g, '');

	const table = kebabcase(entityPlural);

	return `'use strict';

const Model = require('@janiscommerce/model');

module.exports = class ${modelName} extends Model {

	static get table() {
		return '${table}';
	}

	static get indexes() {
		return [];
	}
};
`;
};
