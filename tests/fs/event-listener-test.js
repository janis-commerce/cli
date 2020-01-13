'use strict';

const assert = require('assert');
const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');
const childProcess = require('child_process');

const {
	writeTest,
	getFilePath,
	openTest
} = require('../../lib/fs/event-listener-test');

describe('FS', () => {

	const cwd = '/var/www/root-path';

	before(() => {
		sinon.stub(fs);
		sinon.stub(process, 'cwd')
			.returns(cwd);
		sinon.stub(childProcess, 'spawn');
	});

	afterEach(() => {
		sinon.resetHistory();
	});

	after(() => {
		sinon.restore();
	});

	describe('Event Listener Test', () => {

		describe('writeTest()', () => {
			it('Should write the correct file with the content', async () => {
				await writeTest('my-service', 'my-entity', 'myEvent', 'content');

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'tests/event-listeners', 'my-service', 'my-entity', 'my-event.js'), 'content');
			});
		});

		describe('getFilePath()', () => {
			it('Should return the correct file path', async () => {
				const filePath = await getFilePath('my-service', 'my-entity', 'myEvent', 'content');

				assert.strictEqual(filePath, path.join(cwd, 'tests/event-listeners', 'my-service', 'my-entity', 'my-event.js'));
			});
		});

		describe('openTest()', () => {
			it('Should open the correct file', async () => {

				await openTest('my-service', 'my-entity', 'myEvent');

				sinon.assert.calledOnce(childProcess.spawn);
				sinon.assert.calledWithExactly(childProcess.spawn, 'xdg-open', [
					path.join(cwd, 'tests/event-listeners', 'my-service', 'my-entity', 'my-event.js')
				], {
					detached: true
				});
			});
		});

	});
});
