'use strict';

const path = require('path');
const startcase = require('lodash.startcase');

const { getFilePath: getSourceFilePath } = require('../fs/api-source');
const { getFilePath: getTestFilePath } = require('../fs/api-test');

module.exports = ({
	entity,
	testPath,
	sourcePath
}) => {

	const apiTitle = startcase(`${entity}-list-api`);
	const apiName = apiTitle.replace(/ /g, '');

	const sourceRelativePath = path.relative(path.dirname(getTestFilePath(testPath)), getSourceFilePath(sourcePath));

	return `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ${apiName} = require('${sourceRelativePath}');

describe('${apiTitle}', () => {

	ApiTest(${apiName}, '/${entity}', [
	]);

});
`;
};
