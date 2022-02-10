'use strict';

module.exports = ({
	functionName,
	hasClient,
	hasPayload
}) => {

	const typeLambda = (payload, client) => (!payload && 'Lambda') || (!client && 'LambdaWithPayload') || 'LambdaWithClientAndPayload';

	return `'use strict';

const { Handler, ${typeLambda(hasPayload, hasClient)} } = require('@janiscommerce/lambda');

class ${functionName} extends ${typeLambda(hasPayload, hasClient)} {

	async process() {
		// Process something
	}
}

module.exports.handler = (...args) => Handler.handle(${functionName}, ...args);
`;
};
