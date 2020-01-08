'use strict';

const assert = require('assert');
const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');
const childProcess = require('child_process');

const {
	writeSource,
	getFilePath,
	openSource
} = require('../../lib/fs/event-listener-source');

describe('FS', () => {

	const cwd = '/var/www/root-path';

	beforeEach(() => {
		sinon.stub(fs);
		sinon.stub(process, 'cwd')
			.returns(cwd);
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('Event Listener Source', () => {

		context('Without MS_PATH env var', () => {
			describe('writeSource()', () => {
				it('Should write the correct file with the content', async () => {
					await writeSource('myEntity', 'myEvent', 'content');

					sinon.assert.calledOnce(fs.outputFile);
					sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'event-listeners', 'my-entity', 'my-event.js'), 'content');
				});
			});

			describe('getFilePath()', () => {
				it('Should return the correct file path', async () => {
					const filePath = await getFilePath('myEntity', 'myEvent', 'content');

					assert.strictEqual(filePath, path.join(cwd, 'event-listeners', 'my-entity', 'my-event.js'));
				});
			});

			describe('openSource()', () => {
				it('Should open the correct file', async () => {

					sinon.stub(childProcess, 'spawn');

					await openSource('myEntity', 'myEvent');

					sinon.assert.calledOnce(childProcess.spawn);
					sinon.assert.calledWithExactly(childProcess.spawn, 'xdg-open', [path.join(cwd, 'event-listeners', 'my-entity', 'my-event.js')], {
						detached: true
					});
				});
			});
		});

		context('With MS_PATH env var', () => {

			let env;

			before(() => {
				env = { ...process.env };
				process.env.MS_PATH = 'src';
			});

			after(() => {
				process.env = env;
			});

			describe('writeSource()', () => {
				it('Should write the correct file with the content', async () => {
					await writeSource('myEntity', 'myEvent', 'content');

					sinon.assert.calledOnce(fs.outputFile);
					sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'src/event-listeners', 'my-entity', 'my-event.js'), 'content');
				});
			});

			describe('getFilePath()', () => {
				it('Should return the correct file path', async () => {
					const filePath = await getFilePath('myEntity', 'myEvent', 'content');

					assert.strictEqual(filePath, path.join(cwd, 'src/event-listeners', 'my-entity', 'my-event.js'));
				});
			});

			describe('openSource()', () => {
				it('Should open the correct file', async () => {

					sinon.stub(childProcess, 'spawn');

					await openSource('myEntity', 'myEvent');

					sinon.assert.calledOnce(childProcess.spawn);
					sinon.assert.calledWithExactly(childProcess.spawn, 'xdg-open', [path.join(cwd, 'src/event-listeners', 'my-entity', 'my-event.js')], {
						detached: true
					});
				});
			});
		});

	});
});
