'use strict';

const path = require('path');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const { getFilePath: getSourceFilePath } = require('../fs/api-source');
const { getFilePath: getTestFilePath } = require('../fs/api-test');
const { getFilePath: getModelFilePath } = require('../fs/model');

const { getFieldSampleValue } = require('../utils');

module.exports = ({
	entity,
	fields,
	testPath,
	sourcePath
}) => {

	const entityId = '5dea9fc691240d00084083f8';

	const apiTitle = startcase(`${entity}-get-api`);
	const apiName = apiTitle.replace(/ /g, '');

	const modelName = startcase(`${entity}-model`).replace(/ /g, '');

	const sourceRelativePath = path.relative(path.dirname(getTestFilePath(testPath)), getSourceFilePath(sourcePath));
	const modelRelativePath = path.relative(path.dirname(getTestFilePath(testPath)), getModelFilePath(entity));

	const sampleData = fields.map(f => {
		const sampleValue = getFieldSampleValue(f);
		return `${f}: ${sampleValue}`;
	}).join(',\n\t\t');

	return `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ${apiName} = require('${sourceRelativePath.replace(/\.js$/, '')}');
const ${modelName} = require('${modelRelativePath.replace(/\.js$/, '')}');

describe('${apiTitle}', () => {

	const id = '${entityId}';
	const apiPath = '/api/${kebabcase(entity)}/${entityId}';

	const ${entity} = {
		${sampleData}
	};

	const ${entity}Formatted = {
		${sampleData}
	};

	ApiTest(${apiName}, apiPath, [
		{
			description: 'Should fail with a 404 if no ${entity} are found',
			request: {},
			response: {
				code: 404
			},
			before: sinon => {
				sinon.stub(${modelName}.prototype, 'get')
					.resolves([]);
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(${modelName}.prototype.get, {
					filters: { id },
					page: 1,
					limit: 1
				});
			}
		},
		{
			description: 'Should return 200 with the formatted object if the ${entity} is found',
			request: {},
			response: {
				code: 200,
				body: { ...${entity}Formatted }
			},
			before: sinon => {
				sinon.stub(${modelName}.prototype, 'get')
					.resolves([{ ...${entity} }]);
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(${modelName}.prototype.get, {
					filters: { id },
					page: 1,
					limit: 1
				});
			}
		},
		{
			description: 'Should return 500 when the model fails',
			request: {},
			response: {
				code: 500,
				body: { message: 'Some DB Error' }
			},
			before: sinon => {
				sinon.stub(${modelName}.prototype, 'get')
					.rejects(new Error('Some DB Error'))
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(${modelName}.prototype.get, {
					filters: { id },
					page: 1,
					limit: 1
				});
			}
		}
	]);
});
`;
};
