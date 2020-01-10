'use strict';

const assert = require('assert');
const sinon = require('sinon');
const yargs = require('yargs');

const fs = require('fs-extra');
const childProcess = require('child_process');

const prompts = require('prompts');

const {
	command,
	describe: commandDescribe,
	builder,
	handler
} = require('../../../lib/commands/create/api');

describe('Commands', () => {

	describe('Create API', () => {

		const cwd = '/var/www/root-path';

		before(() => {
			sinon.stub(fs);

			sinon.stub(yargs, 'option').returnsThis();
			sinon.stub(yargs, 'help').returnsThis();

			sinon.stub(process, 'cwd').returns(cwd);

			sinon.stub(childProcess, 'spawn');
		});

		afterEach(() => {
			sinon.resetHistory();
		});

		after(() => {
			sinon.restore();
		});

		describe('command', () => {
			it('Should export the create-api command', () => {
				assert.strictEqual(command, 'create-api');
			});
		});

		describe('describe', () => {
			it('Should export a string to describe the command', () => {
				assert.strictEqual(typeof commandDescribe, 'string');
			});
		});

		describe('builder', () => {
			it('Should set the command options and help', async () => {
				await builder(yargs);
				sinon.assert.callCount(yargs.option, 4);
				sinon.assert.calledWithExactly(yargs.option.getCall(0), 'path', {
					alias: 'p',
					description: sinon.match.string,
					type: 'string'
				});
				sinon.assert.calledWithExactly(yargs.option.getCall(1), 'method', {
					alias: 'm',
					description: sinon.match.string,
					type: 'string'
				});
				sinon.assert.calledWithExactly(yargs.option.getCall(2), 'janis-namespace', {
					alias: 'ns',
					description: sinon.match.string,
					type: 'string'
				});
				sinon.assert.calledWithExactly(yargs.option.getCall(3), 'janis-method', {
					alias: 'mt',
					description: sinon.match.string,
					type: 'string'
				});
				sinon.assert.calledOnce(yargs.help);
			});
		});

		describe('handler', () => {

			it('Should write and open all the files', async () => {

				prompts.inject(['/product-image', 'get', 'list', 'product-image', 'list', [{
					ApiKey: [],
					ApiSecret: [],
					JanisClient: []
				}]]);

				await handler({});

				sinon.assert.callCount(fs.outputFile, 3);
				sinon.assert.callCount(childProcess.spawn, 3);
			});

			it('Should write and open all the files (without security)', async () => {

				prompts.inject(['/product-image', 'get', 'list', 'product-image', 'list', []]);

				await handler({});

				sinon.assert.callCount(fs.outputFile, 3);
				sinon.assert.callCount(childProcess.spawn, 3);
			});

			it('Should write and open all the files (with path params)', async () => {

				prompts.inject(['/product-image/{id}', 'get', 'get', 'product-image', 'get', []]);

				await handler({});

				sinon.assert.callCount(fs.outputFile, 3);
				sinon.assert.callCount(childProcess.spawn, 3);
			});
		});
	});
});
