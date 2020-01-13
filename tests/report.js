'use strict';

const path = require('path');

const sinon = require('sinon');
const childProcess = require('child_process');

const Table = require('cli-table');

const ReportModule = require('../lib/report');

describe('Report', () => {

	const cwd = '/var/www/root-path';

	before(async () => {
		sinon.spy(Table.prototype, 'push');
		sinon.stub(ReportModule.Report, 'consoleLog');
		sinon.stub(process, 'cwd').returns(cwd);
		sinon.stub(childProcess, 'spawn');

		// To flush the reports
		await ReportModule.Report.finish();
		sinon.resetHistory();
	});

	afterEach(() => {
		sinon.resetHistory();
	});

	after(() => {
		sinon.restore();
	});

	it('Should not console log anything if no reports have been added', async () => {
		await ReportModule.Report.finish();
		sinon.assert.notCalled(ReportModule.Report.consoleLog);
	});

	it('Should push and print one report if it is added first', async () => {

		ReportModule.Report.add(ReportModule.reportEvents.FILE_CREATED, 'my-file-path.json');
		await ReportModule.Report.finish();

		sinon.assert.calledOnce(Table.prototype.push);
		sinon.assert.calledWithExactly(Table.prototype.push, [ReportModule.reportEvents.FILE_CREATED, 'my-file-path.json']);

		sinon.assert.calledOnce(ReportModule.Report.consoleLog);
	});

	it('Should not open any file if no events', async () => {
		await ReportModule.Report.finish();
		sinon.assert.notCalled(childProcess.spawn);
	});

	it('Should not open any file if no events of FILE_NEEDS_CHANGES ocurred', async () => {
		ReportModule.Report.add(ReportModule.reportEvents.FILE_CREATED, 'my-file-path.json');
		await ReportModule.Report.finish();
		sinon.assert.notCalled(childProcess.spawn);
	});

	it('Should only open the files with FILE_NEEDS_CHANGES events', async () => {

		ReportModule.Report.add(ReportModule.reportEvents.FILE_CREATED, 'my-file-path.json');
		ReportModule.Report.add(ReportModule.reportEvents.FILE_NEEDS_CHANGES, 'my-file-path.js');
		ReportModule.Report.add(ReportModule.reportEvents.FILE_NEEDS_CHANGES, '/var/www/path/to/my-other-file-path.yml');
		await ReportModule.Report.finish();

		sinon.assert.calledOnce(Table.prototype.push);
		sinon.assert.calledWithExactly(Table.prototype.push,
			[ReportModule.reportEvents.FILE_CREATED, 'my-file-path.json'],
			[ReportModule.reportEvents.FILE_NEEDS_CHANGES, 'my-file-path.js'],
			[ReportModule.reportEvents.FILE_NEEDS_CHANGES, '/var/www/path/to/my-other-file-path.yml']
		);

		sinon.assert.calledTwice(childProcess.spawn);
		sinon.assert.calledWithExactly(childProcess.spawn.getCall(0), 'xdg-open', [path.join(cwd, 'my-file-path.js')], {
			detached: true
		});
		sinon.assert.calledWithExactly(childProcess.spawn.getCall(1), 'xdg-open', ['/var/www/path/to/my-other-file-path.yml'], {
			detached: true
		});
	});

});
