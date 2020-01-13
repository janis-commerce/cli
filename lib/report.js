'use strict';

const Table = require('cli-table');

const fsBase = require('./fs/base');

let reports = [];

const reportEvents = {
	FILE_CREATED: 'file-created',
	FILE_NEEDS_CHANGES: 'file-needs-changes',
	FILE_NOT_OVERRIDEN: 'file-not-overriden'
};

module.exports.reportEvents = reportEvents;

module.exports.Report = class Report {

	static add(type, filePath) {
		reports.push([type, filePath]);
	}

	static async finish() {

		if(!reports.length)
			return;

		const table = new Table({
			head: ['Event', 'File'],
			style: {
				head: ['cyan']
			}
		});

		table.push(...reports);

		this.consoleLog(`\n${table}`);

		await this.openFilesThatNeedModification();

		reports = [];
	}

	/* istanbul ignore next */
	static consoleLog(...args) {
		console.log(...args); // eslint-disable-line no-console
	}

	static openFilesThatNeedModification() {
		return Promise.all(reports
			.filter(([event]) => event === reportEvents.FILE_NEEDS_CHANGES)
			.map(([, filePath]) => fsBase.openFile(filePath)));
	}
};
