'use strict';

const path = require('path');
const startcase = require('lodash.startcase');

const { getFilePath: getSourceFilePath } = require('../fs/event-listener-source');
const { getFilePath: getTestFilePath } = require('../fs/event-listener-test');

const defaultCases = (mustHaveClient, mustHaveId) => {
	const cases = [
		mustHaveClient ? `
		{
			description: 'Should return 400 if the event has no client',
			session: true,
			event: {
				...validEvent,
				client: undefined
			},
			responseCode: 400
		}` : '',
		mustHaveId ? `
		{
			description: 'Should return 400 if the event has no ID',
			session: ${mustHaveClient ? 'true' : 'false'},
			event: {
				...validEvent,
				id: undefined
			},
			responseCode: 400
		}` : ''
	]
		.filter(Boolean)
		.join(',');

	return cases ? `${cases},` : cases;
};
module.exports = ({
	service,
	entity,
	event,
	mustHaveClient,
	mustHaveId
}) => {

	const apiTitle = startcase(`${service}-${entity}-${event}-listener`);
	const apiName = apiTitle.replace(/ /g, '');

	const sourceRelativePath = path.relative(path.dirname(getTestFilePath(service, entity, event)), getSourceFilePath(service, entity, event));

	return `'use strict';

const EventListenerTest = require('@janiscommerce/event-listener-test');

const ${apiName} = require('${sourceRelativePath.replace(/\.js$/, '')}');

describe('${apiTitle}', async () => {

	const validEvent = {
		service: '${service}',
		entity: '${entity}',
		event: '${event}'${mustHaveClient ? `,
		client: 'defaultClient'` : ''}${mustHaveId ? `,
		id: '5ddd38fbfd60ad001118dbec'` : ''}
	};

	await EventListenerTest(${apiName}.handler, [${defaultCases(mustHaveClient, mustHaveId)}
		{
			description: 'Should return 200 if no errors ocur',
			session: ${mustHaveClient ? 'true' : 'false'},
			event: { ...validEvent },
			responseCode: 200
		}
	]);
});
`;
};
