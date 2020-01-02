'use strict';

const startcase = require('lodash.startcase');

module.exports = ({
	janisMethod,
	janisNamespace
}) => {

	const apiName = startcase(`${janisMethod}-${janisNamespace}-api`).replace(/ /g, '');

	return `'use strict';

const { API } = require('@janiscommerce/api');

module.exports = class ${apiName} extends API {

	get struct() {
		// Struct validation
	}

	async validate() {
		// Validate your API
	}

	async process() {
		// Your API code goes here
	}

};
`;
};
