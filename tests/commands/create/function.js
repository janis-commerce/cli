'use strict';

const assert = require('assert');
const sinon = require('sinon');
const yargs = require('yargs');

const YAML = require('yamljs');
const fs = require('fs-extra');

const prompts = require('prompts');

const {
	command,
	describe: commandDescribe,
	builder,
	handler
} = require('../../../lib/commands/create/function');

const ReportModule = require('../../../lib/report');

describe('Commands', () => {

	describe('Create Function', () => {

		const cwd = '/var/www/root-path';

		before(() => {
			sinon.stub(fs);
			sinon.stub(YAML, 'load');

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
			it('Should export the create-function command', () => {
				assert.strictEqual(command, 'create-function');
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
				sinon.assert.calledWithExactly(yargs.option, 'functionName', {
					alias: 'f',
					description: sinon.match.string,
					type: 'string'
				});
				sinon.assert.calledOnce(yargs.help);
			});
		});

		describe('handler', () => {

			it('Should write and open all the files (with payload)', async () => {

				fs.pathExists.resolves(false);

				prompts.inject(['PublishProducts', true, 'publish-products', true, true]);

				await handler({});

				sinon.assert.callCount(fs.outputFile, 3);
			});

			it('Should write and open all the files (without payload)', async () => {

				fs.pathExists.resolves(false);

				prompts.inject(['PublishProducts', true, 'publish-products', false]);

				await handler({});

				sinon.assert.callCount(fs.outputFile, 3);
			});

			it('Should write and open all the files (with default path)', async () => {

				fs.pathExists.resolves(false);

				prompts.inject(['PublishProducts', false, false]);

				await handler({});

				sinon.assert.callCount(fs.outputFile, 3);
			});

			it('Should open but not write existing files that should not be overriden', async () => {

				fs.pathExists.resolves(true);
				fs.readFile.resolves('[]');
				YAML.load.resolves([]);

				prompts.inject(['PublishProducts', true, 'publish-products', true, true]);

				await handler({});

				sinon.assert.callCount(fs.outputFile, 3);
			});
		});
	});
});
