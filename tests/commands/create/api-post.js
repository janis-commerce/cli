'use strict';

const assert = require('assert');
const sinon = require('sinon');
const yargs = require('yargs');

const fs = require('fs-extra');

const prompts = require('prompts');

const {
	command,
	describe: commandDescribe,
	builder,
	handler
} = require('../../../lib/commands/create/api-post');

const ReportModule = require('../../../lib/report');

describe('Commands', () => {

	describe('Create API Post', () => {

		const cwd = '/var/www/root-path';

		before(() => {
			sinon.stub(fs);

			sinon.stub(yargs, 'option').returnsThis();
			sinon.stub(yargs, 'help').returnsThis();

			sinon.stub(process, 'cwd').returns(cwd);

			sinon.stub(ReportModule.Report, 'add');
			sinon.stub(ReportModule.Report, 'finish');
		});

		afterEach(() => {
			sinon.resetHistory();
		});

		after(() => {
			sinon.restore();
		});

		describe('command', () => {
			it('Should export the create-api-post command', () => {
				assert.strictEqual(command, 'create-api-post');
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

				prompts.inject(['my-service', 'productImage', 'productImages', [{
					ApiKey: [],
					ApiSecret: [],
					JanisClient: []
				}], ['id', 'status']]);

				await handler({});

				sinon.assert.callCount(fs.pathExists, 4);
				sinon.assert.callCount(fs.outputFile, 7);
			});

			it('Should open but not write existing files that should not be overriden', async () => {

				fs.pathExists.resolves(true);
				fs.readFile.resolves('[]');

				prompts.inject(['my-service', 'productImage', 'productImages', [{
					ApiKey: [],
					ApiSecret: [],
					JanisClient: []
				}], ['id', 'status']]);

				await handler({});

				sinon.assert.callCount(fs.pathExists, 4);
				sinon.assert.callCount(fs.outputFile, 4);
			});

			it('Should write and open all the files (without security)', async () => {

				fs.pathExists.resolves(false);

				prompts.inject(['my-service', 'productImage', 'productImages', [], ['id', 'status']]);

				await handler({});

				sinon.assert.callCount(fs.pathExists, 4);
				sinon.assert.callCount(fs.outputFile, 7);
			});

			it('Should write and open all the files (with view-schemas)', async () => {

				fs.pathExists.resolves(false);

				const addViewsOption = true;

				prompts.inject(['my-service', 'productImage', 'productImages', [{
					ApiKey: [],
					ApiSecret: [],
					JanisClient: []
				}], ['id', 'status'], addViewsOption]);

				await handler({});

				sinon.assert.callCount(fs.pathExists, 5);
				sinon.assert.callCount(fs.outputFile, 8);
			});
		});
	});
});
