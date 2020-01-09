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
} = require('../../lib/fs/api-source');

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

	describe('API Source', () => {

		context('Without MS_PATH env var', () => {
			describe('writeSource()', () => {
				it('Should write the correct file with the content', async () => {
					await writeSource('/some/path', 'content');

					sinon.assert.calledOnce(fs.outputFile);
					sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'api', 'some/path.js'), 'content');
				});
			});

			describe('getFilePath()', () => {
				it('Should return the correct file path', async () => {
					const filePath = await getFilePath('/some/path', 'content');

					assert.strictEqual(filePath, path.join(cwd, 'api', 'some/path.js'));
				});
			});

			describe('openSource()', () => {
				it('Should write the correct file with the content', async () => {

					await openSource('/some/path');

					sinon.assert.calledOnce(childProcess.spawn);
					sinon.assert.calledWithExactly(childProcess.spawn, 'xdg-open', [path.join(cwd, 'api', 'some/path.js')], {
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
					await writeSource('/some/path', 'content');

					sinon.assert.calledOnce(fs.outputFile);
					sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'src/api', 'some/path.js'), 'content');
				});
			});

			describe('getFilePath()', () => {
				it('Should return the correct file path', async () => {
					const filePath = await getFilePath('/some/path', 'content');

					assert.strictEqual(filePath, path.join(cwd, 'src/api', 'some/path.js'));
				});
			});

			describe('openSource()', () => {
				it('Should open the correct file', async () => {

					await openSource('/some/path');

					sinon.assert.calledOnce(childProcess.spawn);
					sinon.assert.calledWithExactly(childProcess.spawn, 'xdg-open', [path.join(cwd, 'src/api', 'some/path.js')], {
						detached: true
					});
				});
			});
		});

	});
});
