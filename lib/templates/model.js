'use strict';

const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

module.exports = ({
	entity,
	entityPlural,
	auth
}) => {

	const modelName = startcase(`${entity}`).replace(/ /g, '');

	const table = kebabcase(entityPlural);

	const databaseKeyGetter = auth === 'core' ? `
	get databaseKey() {
		return 'core';
	}
` : '';

	return `'use strict';

const Model = require('@janiscommerce/model');

module.exports = class ${modelName} extends Model {
${databaseKeyGetter}
	static get table() {
		return '${table}';
	}

	static get indexes() {
		return [];
	}
};
`;
};
