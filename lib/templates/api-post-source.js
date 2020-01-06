'use strict';

const startcase = require('lodash.startcase');

const { getFieldSampleStruct } = require('../utils');

module.exports = ({ entity, fields }) => {

	const apiName = startcase(`${entity}-post-api`).replace(/ /g, '');

	const sampleStruct = fields
		.map(field => field !== 'id' && [field, getFieldSampleStruct(field)]) // ID should not be in the struct
		.filter(Boolean);

	return `'use strict';

const { ApiSaveData } = require('@janiscommerce/api-save');
const { struct } = require('superstruct');

const mainStruct = struct.partial({
	${sampleStruct.map(([f, struct]) => `${f}: ${struct}`).join(',\n\t')}
});

module.exports = class ${apiName} extends ApiSaveData {

	static get mainStruct() {
		return mainStruct;
	}

	format(record) {
		return record;
	}

};
`;
};