'use strict';

module.exports = ({
	functionName,
	hasClient,
	hasPayload
}) => {

	const getBaseLambda = (payload, client) => (!payload && 'Lambda') || (!client && 'LambdaWithPayload') || 'LambdaWithClientAndPayload';

	return `'use strict';

const { Handler, ${getBaseLambda(hasPayload, hasClient)} } = require('@janiscommerce/lambda');

class ${functionName} extends ${getBaseLambda(hasPayload, hasClient)} {

	async process() {
		// Process something
	}
}

module.exports.handler = (...args) => Handler.handle(${functionName}, ...args);
`;
};
