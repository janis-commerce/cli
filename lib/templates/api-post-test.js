'use strict';

const path = require('path');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const { getFilePath: getSourceFilePath } = require('../fs/api-source');
const { getFilePath: getTestFilePath } = require('../fs/api-test');
const { getFilePath: getModelFilePath } = require('../fs/model');

const { getFieldSampleValue, getValidationTestCase } = require('../utils');

module.exports = ({
	entity,
	fields,
	testPath,
	sourcePath
}) => {

	const apiPath = `/api/${kebabcase(entity)}`;

	const apiTitle = startcase(`${entity}-post-api`);
	const apiName = apiTitle.replace(/ /g, '');

	const modelName = startcase(`${entity}-model`).replace(/ /g, '');

	const sourceRelativePath = path.relative(path.dirname(getTestFilePath(testPath)), getSourceFilePath(sourcePath));
	const modelRelativePath = path.relative(path.dirname(getTestFilePath(testPath)), getModelFilePath(entity));

	const sampleData = fields.map(f => f !== 'id' && [f, getFieldSampleValue(f)])
		.filter(Boolean);

	const validationTestCases = fields
		.map(f => f !== 'id' && getValidationTestCase(entity, modelName, f)) // ID should not be validated in request body
		.filter(Boolean);

	return `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ${apiName} = require('${sourceRelativePath}');
const ${modelName} = require('${modelRelativePath}');

const deleteProp = (object, prop) => {
	const { [prop]: propToRemove, ...newObject } = object;
	return newObject;
};

describe('${apiTitle}', () => {

	const ${entity} = {
		${sampleData.map(([f, sampleValue]) => `${f}: ${sampleValue}`).join(',\n\t\t')}
	};

	const ${entity}Formatted = {
		${sampleData.map(([f, sampleValue]) => `${f}: ${sampleValue}`).join(',\n\t\t')}
	};

	ApiTest(${apiName}, '${apiPath}', [
${validationTestCases.join('\n')}
		{
			description: 'Should return 500 if the model fails to insert the ${entity}',
			request: {
				data: { ...${entity} }
			},
			response: {
				code: 500
			},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype);
				${modelName}.prototype.insert.rejects(new Error('Error updating'));
			}
		},
		{
			description: 'Should save the formatted ${entity} with all the fields',
			request: {
				data: { ...${entity} }
			},
			response: {
				code: 200,
				body: {
					id: '5dea9fc691240d00084083f8'
				}
			},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype);
				${modelName}.prototype.insert.returns('5dea9fc691240d00084083f8');
			},
			after: (response, sandbox) => {
				sandbox.assert.calledOnce(${modelName}.prototype.insert);
				sandbox.assert.calledWithExactly(${modelName}.prototype.insert, { ...${entity}Formatted });
			}
		}
	]);
});
`;
};