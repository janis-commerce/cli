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
	entityPlural,
	fields,
	testPath,
	sourcePath
}) => {

	const apiPath = `/api/${kebabcase(entity)}/5dea9fc691240d00084083f8`;

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

	const ${entity} = {
		${sampleData}
	};

	const ${entity}Formatted = {
		${sampleData}
	};

	ApiTest(${apiName}, '${apiPath}', [
		{
			description: 'Should fail with a 404 if no ${entityPlural} are found',
			request: {},
			response: {
				code: 404
			},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype, 'get');
				${modelName}.prototype.get.resolves([]);
			}
		},
		{
			description: 'Should pass the correct params to the model',
			request: {},
			response: {},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype, 'get');
				${modelName}.prototype.get.resolves([{ ...${entity} }]);
			},
			after: (response, sandbox) => {
				sandbox.assert.calledOnce(${modelName}.prototype.get);
				sandbox.assert.calledWithExactly(${modelName}.prototype.get, {
					filters: {
						id: '5dea9fc691240d00084083f8'
					},
					page: 1,
					limit: 1
				});
			}
		},
		{
			description: 'Should return the formatted object if the ${entity} is found',
			request: {},
			response: {
				code: 200,
				body: { ...${entity}Formatted }
			},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype, 'get');
				${modelName}.prototype.get.resolves([{ ...${entity} }]);
			}
		}
	]);
});
`;
};
