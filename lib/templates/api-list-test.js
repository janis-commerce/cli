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
	sourcePath,
	sortableFields,
	availableFilters
}) => {

	const apiPath = `/api/${kebabcase(entity)}`;

	const apiTitle = startcase(`${entity}-list-api`);
	const apiName = apiTitle.replace(/ /g, '');

	const modelName = startcase(`${entity}-model`).replace(/ /g, '');

	const sourceRelativePath = path.relative(path.dirname(getTestFilePath(testPath)), getSourceFilePath(sourcePath));
	const modelRelativePath = path.relative(path.dirname(getTestFilePath(testPath)), getModelFilePath(entity));

	return `'use strict';

const ApiTest = require('@janiscommerce/api-test');

const ${apiName} = require('${sourceRelativePath}');
const ${modelName} = require('${modelRelativePath}');

describe('${apiTitle}', () => {

	const ${entity} = {
		${fields.map(f => `${f}: ${getFieldSampleValue(f)}`).join(',\n\t\t')}
	};

	const ${entity}Formatted = {
		${fields.map(f => `${f}: ${getFieldSampleValue(f)}`).join(',\n\t\t')}
	};

	ApiTest(${apiName}, '${apiPath}', [
		{
			description: 'Should pass the correct params to the model',
			request: {},
			response: {},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype, 'get');
				${modelName}.prototype.get.resolves([]);
			},
			after: (response, sandbox) => {
				sandbox.assert.calledOnce(${modelName}.prototype.get);
				sandbox.assert.calledWithExactly(${modelName}.prototype.get, {
					page: 1,
					limit: 60
				});
			}
		},
		{
			description: 'Should succeed with a 200 and an empty array if no ${entity}s are found',
			request: {},
			response: {
				code: 200,
				body: []
			},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype, 'get');
				${modelName}.prototype.get.resolves([]);
			}
		},
		{
			description: 'Should succeed with a 200 and an array with formatted ${entity}s if ${entity}s are found',
			request: {},
			response: {
				code: 200,
				body: [{ ...${entity}Formatted }],
				headers: {
					'x-janis-total': 1
				}
			},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype, 'get');
				${modelName}.prototype.get.resolves([{ ...${entity} }]);

				sandbox.stub(${modelName}.prototype, 'getTotals');
				${modelName}.prototype.getTotals.returns({ total: 1 });
			}
		}
	]);

	describe('Filtering', () => {

		const filters = [
			${availableFilters.map(f => `['${f}', 'foo', 'foo', '${f}']`).join(',\n\t\t\t')}
		];

		ApiTest(${apiName}, '${apiPath}', filters.map(([field, data, queryValue, internalName]) => ({
			description: \`Should pass the \${field} filter to the model\`,
			request: {
				data: {
					filters: {
						[field]: data
					}
				}
			},
			response: {},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype, 'get');
				${modelName}.prototype.get.resolves([]);
			},
			after: (response, sandbox) => {
				sandbox.assert.calledOnce(${modelName}.prototype.get);
				sandbox.assert.calledWithExactly(${modelName}.prototype.get, {
					page: 1,
					limit: 60,
					filters: {
						[internalName || field]: queryValue
					}
				});
			}
		})));
	});

	describe('Sorting', () => {

		const sorting = [
			${sortableFields.map(f => `'${f}'`).join(',\n\t\t\t')}
		];

		ApiTest(${apiName}, '${apiPath}', sorting.map(field => ({
			description: \`Should pass the \${field} sort field to the model\`,
			request: {
				data: {
					sortBy: field
				}
			},
			response: {},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype, 'get');
				${modelName}.prototype.get.resolves([]);
			},
			after: (response, sandbox) => {
				sandbox.assert.calledOnce(${modelName}.prototype.get);
				sandbox.assert.calledWithExactly(${modelName}.prototype.get, {
					page: 1,
					limit: 60,
					order: {
						[field]: 'asc'
					}
				});
			}
		})));

		ApiTest(${apiName}, '${apiPath}', [
			{
				description: 'Should pass the sort direction to the model',
				request: {
					data: {
						sortBy: sorting[0],
						sortDirection: 'desc'
					}
				},
				response: {},
				before: sandbox => {
					sandbox.stub(${modelName}.prototype, 'get');
					${modelName}.prototype.get.resolves([]);
				},
				after: (response, sandbox) => {
					sandbox.assert.calledOnce(${modelName}.prototype.get);
					sandbox.assert.calledWithExactly(${modelName}.prototype.get, {
						page: 1,
						limit: 60,
						order: {
							[sorting[0]]: 'desc'
						}
					});
				}
			}
		]);
	});
});
`;
};
