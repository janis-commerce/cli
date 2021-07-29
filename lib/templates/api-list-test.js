'use strict';

const path = require('path');
const startcase = require('lodash.startcase');
const kebabcase = require('lodash.kebabcase');

const { getFilePath: getSourceFilePath } = require('../fs/api-source');
const { getFilePath: getTestFilePath } = require('../fs/api-test');
const { getFilePath: getModelFilePath } = require('../fs/model');

const { getFieldSampleValue, booleanRegexp, numberRegexp, dateRegexp } = require('../utils');

const getFilterCase = filterName => {

	if(filterName === 'name') {
		return [
			`['${filterName}', 'bar', { value: 'bar', type: 'search' }, '${filterName}']`
		];
	}

	if(filterName.match(booleanRegexp)) {
		return [
			`['${filterName}', '1', true, '${filterName}']`,
			`['${filterName}', 'true', true, '${filterName}']`,
			`['${filterName}', '0', false, '${filterName}']`,
			`['${filterName}', 'false', false, '${filterName}']`
		];
	}

	if(filterName.match(numberRegexp)) {
		return [
			`['${filterName}', '10', 10, '${filterName}']`,
			`['${filterName}', 10, 10, '${filterName}']`
		];
	}

	if(filterName.match(dateRegexp)) {
		return [
			`['${filterName}', '2020-08-24T22:11:00.000Z', new Date('2020-08-24T22:11:00.000Z'), '${filterName}']`
		];
	}

	return [`['${filterName}', ${getFieldSampleValue(filterName)}, ${getFieldSampleValue(filterName)}, '${filterName}']`];
};

const getFilterCases = filterNames => {
	return filterNames.map(filterName => getFilterCase(filterName)).flat();
};

module.exports = ({
	entity,
	entityPlural,
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

	const sampleData = fields.map(f => {
		const sampleValue = getFieldSampleValue(f);
		return `${f}: ${sampleValue}`;
	}).join(',\n\t\t');

	const filterCases = getFilterCases(availableFilters);

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
			description: 'Should succeed with a 200 and an empty array if no ${entityPlural} are found',
			request: {},
			response: {
				code: 200,
				body: [],
				headers: { 'x-janis-total': 0 }
			},
			before: sinon => {
				sinon.stub(${modelName}.prototype, 'get')
					.resolves([]);
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(${modelName}.prototype.get, {
					page: 1,
					limit: 60
				});
			}
		},
		{
			description: 'Should succeed with a 200 and an array with formatted ${entityPlural} if ${entityPlural} are found',
			request: {},
			response: {
				code: 200,
				body: [{ ...${entity}Formatted }],
				headers: { 'x-janis-total': 1 }
			},
			before: sinon => {
				sinon.stub(${modelName}.prototype, 'get')
					.resolves([{ ...${entity} }]);

				sinon.stub(${modelName}.prototype, 'getTotals')
					.resolves({ total: 1 });
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(${modelName}.prototype.get, {
					page: 1,
					limit: 60
				});

				sinon.assert.calledOnceWithExactly(${modelName}.prototype.getTotals);
			}
		}
	]);

	describe('Filtering', () => {

		const filters = [
			${filterCases.join(',\n\t\t\t')}
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
			response: {
				code: 200,
				body: [],
				headers: { 'x-janis-total': 0 }
			},
			before: sinon => {
				sinon.stub(${modelName}.prototype, 'get')
					.resolves([]);
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(${modelName}.prototype.get, {
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
			response: {
				code: 200,
				body: [],
				headers: { 'x-janis-total': 0 }
			},
			before: sinon => {
				sinon.stub(${modelName}.prototype, 'get')
					.resolves([]);
			},
			after: (response, sinon) => {
				sinon.assert.calledOnceWithExactly(${modelName}.prototype.get, {
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
				response: {
					code: 200,
					body: [],
					headers: { 'x-janis-total': 0 }
				},
				before: sinon => {
					sinon.stub(${modelName}.prototype, 'get')
						.resolves([]);
				},
				after: (response, sinon) => {
					sinon.assert.calledOnceWithExactly(${modelName}.prototype.get, {
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
