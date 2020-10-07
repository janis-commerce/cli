'use strict';

const prompts = require('prompts');

const booleanRegexp = /^(is|has|can|should)[A-Z0-9]/;
module.exports.booleanRegexp = booleanRegexp;

const numberRegexp = /(qty|quantity)/i;
module.exports.numberRegexp = numberRegexp;

const dateRegexp = /(^date)|([a-z0-9]Date([A-Z0-9]*)?$)/;
module.exports.dateRegexp = dateRegexp;

const userRegexp = /(^user)|([a-z0-9]User([A-Z0-9]*)?$)/;
module.exports.userRegexp = userRegexp;

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
		case 'userCreated':
			return '\'5dea9fc691240d00084083f9\'';
		case 'userModified':
			return '\'5dea9fc691240d0008408301\'';
		default:
			if(fieldName.match(numberRegexp))
				return 10;

			if(fieldName.match(dateRegexp))
				return `'${(new Date().toISOString())}'`;

			return fieldName.match(booleanRegexp) ? true : '\'bar\'';

	}
};

module.exports.getFieldSampleDescription = () => {
	return 'ADD A DESCRIPTION';
};

module.exports.getFieldSampleStruct = fieldName => {

	if(fieldName.match(booleanRegexp))
		return 'boolean';

	if(fieldName.match(numberRegexp))
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
			before: sinon => {
				sinon.stub(${modelName}.prototype);
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
