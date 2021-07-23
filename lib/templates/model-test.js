'use strict';

const path = require('path');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const { getFilePath: getModelFilePath } = require('../fs/model');
const { getFilePath: getTestFilePath } = require('../fs/model-test');

module.exports = ({
	entity,
	entityPlural
}) => {

	const modelTitle = startcase(`${entity}-Model`);
	const modelName = modelTitle.replace(/ /g, '');

	const table = kebabcase(entityPlural);

	const sourceRelativePath = path.relative(path.dirname(getTestFilePath(entity)), getModelFilePath(entity)).replace('.js', '');

	return `'use strict';

const assert = require('assert');

const ${modelName} = require('${sourceRelativePath}');

describe('${modelTitle}', () => {

	it('Should not return any databaseKey', () => {
		assert.deepStrictEqual(${modelName}.prototype.databaseKey, undefined);
	});

	it('Should return the table name', () => {
		assert.deepStrictEqual(${modelName}.table, '${table}');
	});

	it('Should return the indexes', async () => {
		assert.deepStrictEqual(${modelName}.indexes, []);
	});
});
`;
};
