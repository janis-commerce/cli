'use strict';

const assert = require('assert');
const sinon = require('sinon');
const yargs = require('yargs');

const prompts = require('prompts');

const {
	command,
	describe: commandDescribe,
	builder,
	handler
} = require('../../../lib/commands/create/crud');

const apiList = require('../../../lib/commands/create/api-list');
const apiGet = require('../../../lib/commands/create/api-get');
const apiPost = require('../../../lib/commands/create/api-post');
const apiPut = require('../../../lib/commands/create/api-put');

const ReportModule = require('../../../lib/report');

describe('Commands', () => {

	describe('Create CRUD', () => {

		before(() => {
			sinon.stub(apiList, 'handler');
			sinon.stub(apiGet, 'handler');
			sinon.stub(apiPost, 'handler');
			sinon.stub(apiPut, 'handler');

			sinon.stub(yargs, 'option').returnsThis();
			sinon.stub(yargs, 'help').returnsThis();

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
			it('Should export the create-crud command', () => {
				assert.strictEqual(command, 'create-crud');
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

				prompts.inject(['my-service', 'productImage', 'productImages', 'full', ['id', 'status'], ['status'], ['id'], true]);

				await handler({});

				const expectedOptions = {
					service: 'my-service',
					entity: 'productImage',
					entityPlural: 'productImages',
					auth: 'full',
					fields: ['id', 'status'],
					sortableFields: ['status'],
					availableFilters: ['id'],
					addViews: true
				};

				sinon.assert.calledOnce(apiList.handler);
				sinon.assert.calledWithExactly(apiList.handler, expectedOptions);

				sinon.assert.calledOnce(apiGet.handler);
				sinon.assert.calledWithExactly(apiGet.handler, expectedOptions);

				sinon.assert.calledOnce(apiPost.handler);
				sinon.assert.calledWithExactly(apiPost.handler, expectedOptions);

				sinon.assert.calledOnce(apiPut.handler);
				sinon.assert.calledWithExactly(apiPut.handler, expectedOptions);
			});

			it('Should write and open all the files (without security)', async () => {

				prompts.inject(['my-service', 'productImage', 'productImages', 'none', ['id', 'status'], ['status'], ['id'], false]);

				await handler({});

				const expectedOptions = {
					service: 'my-service',
					entity: 'productImage',
					entityPlural: 'productImages',
					auth: 'none',
					fields: ['id', 'status'],
					sortableFields: ['status'],
					availableFilters: ['id'],
					addViews: false
				};

				sinon.assert.calledOnce(apiList.handler);
				sinon.assert.calledWithExactly(apiList.handler, expectedOptions);

				sinon.assert.calledOnce(apiGet.handler);
				sinon.assert.calledWithExactly(apiGet.handler, expectedOptions);

				sinon.assert.calledOnce(apiPost.handler);
				sinon.assert.calledWithExactly(apiPost.handler, expectedOptions);

				sinon.assert.calledOnce(apiPut.handler);
				sinon.assert.calledWithExactly(apiPut.handler, expectedOptions);
			});
		});
	});
});
