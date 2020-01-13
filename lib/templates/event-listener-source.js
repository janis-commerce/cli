'use strict';

const startcase = require('lodash.startcase');

module.exports = ({
	service,
	entity,
	event,
	mustHaveClient,
	mustHaveId
}) => {

	const apiName = startcase(`${service}-${entity}-${event}-listener`).replace(/ /g, '');

	return `'use strict';

const {
	EventListener,
	ServerlessHandler
} = require('@janiscommerce/event-listener');

const logger = require('lllog')();

class ${apiName} extends EventListener {

	get mustHaveClient() {
		return ${mustHaveClient};
	}

	get mustHaveId() {
		return ${mustHaveId};
	}

	async process() {
		// Your code goes here
		logger.info('Event received');
	}

}

module.exports.handler = (...args) => ServerlessHandler.handle(${apiName}, ...args);
`;
};
