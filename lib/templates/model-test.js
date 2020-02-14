'use strict';

const path = require('path');
const startcase = require('lodash.startcase');

const { getFilePath: getModelFilePath } = require('../fs/model');
const { getFilePath: getTestFilePath } = require('../fs/model-test');

module.exports = ({
	entity,
	entityPlural
}) => {

	const modelTitle = startcase(`${entity}-model`);
	const modelName = modelTitle.replace(/ /g, '');

	const sourceRelativePath = path.relative(path.dirname(getTestFilePath(entity)), getModelFilePath(entity));

	return `'use strict';

const assert = require('assert');

const ${modelName} = require('${sourceRelativePath}');

describe('${modelTitle}', () => {

	describe('Getters', () => {

		it('Should not return any databaseKey', () => {
			assert.deepStrictEqual(${modelName}.prototype.databaseKey, undefined);
		});

		it('Should return the table name', () => {
			assert.deepStrictEqual(${modelName}.table, '${entityPlural}');
		});

		it('Should return the uniqueIndexes', async () => {
			assert.deepStrictEqual(${modelName}.uniqueIndexes, []);
		});
	});
});
`;
};
