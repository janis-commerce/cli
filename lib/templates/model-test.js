'use strict';

const path = require('path');
const startcase = require('lodash.startcase');

const { getFilePath: getModelFilePath } = require('../fs/model');
const { getFilePath: getTestFilePath } = require('../fs/model-test');

module.exports = ({
	entity
}) => {

	const modelTitle = startcase(`${entity}-model`);
	const modelName = modelTitle.replace(/ /g, '');

	const sourceRelativePath = path.relative(path.dirname(getTestFilePath(entity)), getModelFilePath(entity));

	return `'use strict';

const assert = require('assert');

const ${modelName} = require('${sourceRelativePath}');

describe('${modelTitle}', () => {

	describe('Getters', () => {

		it('Should return the databaseKey', () => {
			assert.deepStrictEqual(${modelName}.prototype.databaseKey, 'core');
		});

		it('Should return the table name', () => {
			assert.deepStrictEqual(${modelName}.table, '${entity}s');
		});

		it('Should return the uniqueIndexes', async () => {

			assert.deepStrictEqual(${modelName}.uniqueIndexes, []);
		});

	});
});
`;
};
