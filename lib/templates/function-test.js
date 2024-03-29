'use strict';

const { getFilePath } = require('../fs/function-source');

module.exports = ({
	functionPath,
	functionName
}) => {

	return `'use strict';

const sinon = require('sinon');

const { handler: ${functionName} } = require('${getFilePath(functionPath, functionName)}');

describe('Function ${functionName}', () => {

	afterEach(() => {
		sinon.restore();
	});

	context('When event is invalid', () => {

		beforeEach(() => {
			// Some spies maybe?
		});

		afterEach(() => {
			// Some notCalled maybe?
		});
	});

	context('When event is valid', () => {

		const validEvent = {};
	});
});
`;
};
