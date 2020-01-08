'use strict';

const sinon = require('sinon');
const yargs = require('yargs');

describe('Cli', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Should include the commands dir, require one of them, show help and process cli arguments', () => {

		const argvStub = sinon.stub();

		sinon.stub(yargs, 'commandDir').returnsThis();
		sinon.stub(yargs, 'demandCommand').returnsThis();
		sinon.stub(yargs, 'help').returnsThis();
		sinon.stub(yargs, 'argv').get(argvStub);

		require('../lib/cli'); // eslint-disable-line

		sinon.assert.calledOnce(yargs.commandDir);
		sinon.assert.calledWithExactly(yargs.commandDir, './commands', {
			recurse: true
		});

		sinon.assert.calledOnce(yargs.demandCommand);
		sinon.assert.calledWithExactly(yargs.demandCommand);

		sinon.assert.calledOnce(yargs.help);
		sinon.assert.calledWithExactly(yargs.help);

		sinon.assert.calledOnce(argvStub);
	});

});
