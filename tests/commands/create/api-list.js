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
} = require('../../../lib/commands/create/api-list');

describe('Commands', () => {

	describe('Create API List', () => {

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
			it('Should export the create-api-list command', () => {
				assert.strictEqual(command, 'create-api-list');
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
				sinon.assert.calledTwice(yargs.option);
				sinon.assert.calledWithExactly(yargs.option.getCall(0), 'service', {
					alias: 's',
					description: sinon.match.string,
					type: 'string'
				});
				sinon.assert.calledWithExactly(yargs.option.getCall(1), 'entity', {
					alias: 'e',
					description: sinon.match.string,
					type: 'string'
				});
				sinon.assert.calledOnce(yargs.help);
			});
		});

		describe('handler', () => {

			it('Should write and open all the files', async () => {

				fs.pathExists.resolves(false);

				prompts.inject(['my-service', 'productImage', [{
					ApiKey: [],
					ApiSecret: [],
					JanisClient: []
				}], ['id', 'status'], ['status'], ['id']]);

				await handler({});

				sinon.assert.callCount(fs.pathExists, 4);
				sinon.assert.callCount(fs.outputFile, 8);
				sinon.assert.callCount(childProcess.spawn, 8);
			});

			it('Should open but not write existing files that should not be overriden', async () => {

				fs.pathExists.resolves(true);
				fs.readFile.resolves('[]');

				prompts.inject(['my-service', 'productImage', [{
					ApiKey: [],
					ApiSecret: [],
					JanisClient: []
				}], ['id', 'status'], ['status'], ['id']]);

				await handler({});

				sinon.assert.callCount(fs.pathExists, 4);
				sinon.assert.callCount(fs.outputFile, 5);
				sinon.assert.callCount(childProcess.spawn, 8);
			});

			it('Should write and open all the files (without security)', async () => {

				fs.pathExists.resolves(false);

				prompts.inject(['my-service', 'productImage', [], ['id', 'status'], ['status'], ['id']]);

				await handler({});

				sinon.assert.callCount(fs.pathExists, 4);
				sinon.assert.callCount(fs.outputFile, 8);
				sinon.assert.callCount(childProcess.spawn, 8);
			});
		});
	});
});
