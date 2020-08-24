'use strict';

const prompts = require('prompts');
const startcase = require('lodash.startcase');

module.exports.normalizePath = path => {
	return `/${path}`
		.replace(/^\/+/, '/')
		.replace(/\/+$/, '');
};

module.exports.getFieldSampleValue = fieldName => {
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
			if(fieldName.match(/^(qty|quantity)/))
				return 10;

			return fieldName.match(/^(is|has)/) ? true : '\'bar\'';

	}
};

module.exports.getFieldSampleDescription = (fieldName, entity) => {
	switch(fieldName) {
		case 'id':
			return `The ${startcase(entity)} ID`;
		case 'status':
			return `The ${startcase(entity)} status`;
		case 'dateCreated':
			return 'The creation date';
		case 'dateModified':
			return 'The last modification date';
		case 'userCreated':
			return 'The creation user ID';
		case 'userModified':
			return 'The last modification user ID';
		default:
			return 'ADD A DESCRIPTION';
	}
};

module.exports.getFieldSampleStruct = fieldName => {

	if(fieldName.match(/^(is|has)/))
		return 'boolean';

	if(fieldName.match(/(qty|quantity)/i))
		return 'number';

	if(fieldName.match(/(status)/i)) {
		/* eslint-disable global-require, import/no-dynamic-require */
		// return struct.enum(['active', 'inactive']);
		return 'string';
		/* eslint-enable */
	}

	return 'string';
};


module.exports.getValidationTestCase = (entity, modelName, fieldName) => {

	return `		{
			description: 'Should return 400 if the required field \\'${fieldName}\\' is not passed',
			request: {
				data: deleteProp(${entity}, '${fieldName}')
			},
			response: {
				code: 400
			},
			before: sandbox => {
				sandbox.stub(${modelName}.prototype);
			}
		},`;
};

module.exports.ensureOptions = async (options, currentData) => {

	prompts.override(currentData);

	const newData = await prompts(options, {
		onCancel: () => {
			process.exit(0);
		}
	});

	return {
		...currentData,
		...newData
	};
};

module.exports.notEmpty = value => !!value.trim();

module.exports.areLettersAndNumbers = value => !!value.match(/^[a-z0-9-]+$/);
