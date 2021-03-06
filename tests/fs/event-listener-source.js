'use strict';

const assert = require('assert');
const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');

const open = require('../../lib/wrappers/open');

const {
	writeSource,
	getFilePath,
	openSource
} = require('../../lib/fs/event-listener-source');

describe('FS', () => {

	const cwd = '/var/www/root-path';

	before(() => {
		sinon.stub(fs);
		sinon.stub(process, 'cwd')
			.returns(cwd);
		sinon.stub(open, 'openFile');
	});

	afterEach(() => {
		sinon.resetHistory();
	});

	after(() => {
		sinon.restore();
	});

	describe('Event Listener Source', () => {

		context('Without MS_PATH env var', () => {
			describe('writeSource()', () => {
				it('Should write the correct file with the content', async () => {
					await writeSource('my-service', 'my-entity', 'myEvent', 'content');

					sinon.assert.calledOnce(fs.outputFile);
					sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'event-listeners', 'my-service', 'my-entity', 'my-event.js'), 'content');
				});
			});

			describe('getFilePath()', () => {
				it('Should return the correct file path', async () => {
					const filePath = await getFilePath('my-service', 'my-entity', 'myEvent', 'content');

					assert.strictEqual(filePath, path.join(cwd, 'event-listeners', 'my-service', 'my-entity', 'my-event.js'));
				});
			});

			describe('openSource()', () => {
				it('Should open the correct file', async () => {

					await openSource('my-service', 'my-entity', 'myEvent');

					sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'event-listeners', 'my-service', 'my-entity', 'my-event.js'));
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
					await writeSource('my-service', 'my-entity', 'myEvent', 'content');

					sinon.assert.calledOnce(fs.outputFile);
					sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'src/event-listeners', 'my-service', 'my-entity', 'my-event.js'), 'content');
				});
			});

			describe('getFilePath()', () => {
				it('Should return the correct file path', async () => {
					const filePath = await getFilePath('my-service', 'my-entity', 'myEvent', 'content');

					assert.strictEqual(filePath, path.join(cwd, 'src/event-listeners', 'my-service', 'my-entity', 'my-event.js'));
				});
			});

			describe('openSource()', () => {
				it('Should open the correct file', async () => {

					await openSource('my-service', 'my-entity', 'myEvent');

					sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'src/event-listeners', 'my-service', 'my-entity', 'my-event.js'));
				});
			});
		});

	});
});
