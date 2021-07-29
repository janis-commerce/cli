'use strict';

const path = require('path');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const { getFilePath: getSourceFilePath } = require('../fs/api-source');
const { getFilePath: getTestFilePath } = require('../fs/api-test');
const { getFilePath: getModelFilePath } = require('../fs/model');

const { getFieldSampleValue, getValidationTestCase } = require('../utils');

const ignoredFields = {
	id: true,
	dateCreated: true,
	userCreated: true,
	dateModified: true,
	userModified: true
};

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

	const sampleData = fields
		.map(f => {

			if(ignoredFields[f])
				return;

			const sampleValue = getFieldSampleValue(f);
			return `${f}: ${sampleValue}`;
		})
		.filter(Boolean)
		.join(',\n\t\t');

	const validationTestCases = fields
		.map(f => !ignoredFields[f] && getValidationTestCase(entity, modelName, f, 'insert'))
		.filter(Boolean);

	return `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ${apiName} = require('${sourceRelativePath.replace(/\.js$/, '')}');
const ${modelName} = require('${modelRelativePath.replace(/\.js$/, '')}');

const deleteProp = (object, prop) => {
	const { [prop]: propToRemove, ...newObject } = object;
	return newObject;
};

describe('${apiTitle}', () => {

	const ${entity} = {
		${sampleData}
	};

	const ${entity}Formatted = {
		${sampleData}
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
			before: sinon => {
				sinon.stub(${modelName}.prototype, 'insert')
					.rejects(new Error('Error inserting'));
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(${modelName}.prototype.insert, { ...${entity}Formatted });
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
			before: sinon => {
				sinon.stub(${modelName}.prototype, 'insert')
					.resolves('5dea9fc691240d00084083f8');
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(${modelName}.prototype.insert, { ...${entity}Formatted });
			}
		}
	]);
});
`;
};
