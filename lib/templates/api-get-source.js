'use strict';

const startcase = require('lodash.startcase');
const camelcase = require('lodash.camelcase');

module.exports = ({ entity }) => {

	const apiName = startcase(`${entity}-get-api`).replace(/ /g, '');

	const entityFormattedName = camelcase(entity);

	return `'use strict';

const { ApiGet } = require('@janiscommerce/api-get');

module.exports = class ${apiName} extends ApiGet {

	format(${entityFormattedName}) {
		return ${entityFormattedName};
	}
};
`;
};
