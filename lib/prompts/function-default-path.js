'use strict';

module.exports = {
	type: 'select',
	name: 'functionDefaultPath',
	message: 'Select a function path',
	choices: [
		{ title: 'Default', description: '/src/lambda/{FunctionName}.js', value: false },
		{ title: 'Other', description: 'Add a new path: /src/lambda/{path}/{FunctionName}.js', value: true }
	],
	initial: 0
};
