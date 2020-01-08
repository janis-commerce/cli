'use strict';

const prompts = require('prompts');

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
			return fieldName.match(/^(is|has)/) ? 'true' : '\'bar\'';
	}
};

module.exports.getFieldSampleStruct = fieldName => {

	if(fieldName.match(/^(is|has)/))
		return '\'boolean\'';

	if(fieldName.match(/(qty|quantity)/i))
		return '\'number\'';

	return '\'string\'';
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

	const pendingOptions = [];

	options.forEach(option => {
		if(typeof currentData[option.name] !== 'undefined')
			return;

		pendingOptions.push(option);
	});

	if(!pendingOptions.length)
		return currentData;

	const newData = await prompts(pendingOptions, {
		onCancel: () => {
			process.exit(0);
		}
	});

	return {
		...currentData,
		...newData
	};
};
