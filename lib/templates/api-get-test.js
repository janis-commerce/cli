'use strict';

const path = require('path');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const { getFilePath: getSourceFilePath } = require('../fs/api-source');
const { getFilePath: getTestFilePath } = require('../fs/api-test');
const { getFilePath: getModelFilePath } = require('../fs/model');

const getFieldSampleValue = fieldName => {
	switch(fieldName) {
		case 'id':
			return '\'5dea9fc691240d00084083f8\'';
		case 'status':
			return '\'active\'';
		case 'dateCreated':
			return `'${(new Date().toISOString())}'`;
		case 'dateModified':
			return `'${(new Date().toISOString())}'`;
		case 'userCreated':
			return '\'5dea9fc691240d00084083f9\'';
		case 'userModified':
			return '\'5dea9fc691240d0008408301\'';
		default:
			return fieldName.match(/^(is|has)/) ? 'true' : '\'bar\'';
	}
};

module.exports = ({
	entity,
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

	const sampleData = fields.map(f => [f, getFieldSampleValue(f)]);

	return `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ${apiName} = require('${sourceRelativePath}');
const ${modelName} = require('${modelRelativePath}');

describe('${apiTitle}', () => {

	const ${entity} = {
		${sampleData.map(([f, sampleValue]) => `${f}: ${sampleValue}`).join(',\n\t\t')}
	};

	const ${entity}Formatted = {
		${sampleData.map(([f, sampleValue]) => `${f}: ${sampleValue}`).join(',\n\t\t')}
	};

	ApiTest(${apiName}, '${apiPath}', [
		{
			description: 'Should fail with a 404 if no audit rules are found',
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
