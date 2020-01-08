'use strict';

const assert = require('assert');
const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');
const childProcess = require('child_process');

const {
	writeModelIfDoesNotExist,
	getFilePath,
	openModel
} = require('../../lib/fs/model');

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

	describe('Model Source', () => {

		context('Without MS_PATH env var', () => {
			describe('writeModelIfDoesNotExist()', () => {
				it('Should not write the file if it already exists', async () => {

					fs.pathExists.resolves(true);

					await writeModelIfDoesNotExist('myEntity', 'content');

					sinon.assert.calledOnce(fs.pathExists);
					sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'models', 'my-entity.js'));

					sinon.assert.notCalled(fs.outputFile);
				});

				it('Should write the correct file with the content if does not exist', async () => {

					fs.pathExists.resolves(false);

					await writeModelIfDoesNotExist('myEntity', 'content');

					sinon.assert.calledOnce(fs.pathExists);
					sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'models', 'my-entity.js'));

					sinon.assert.calledOnce(fs.pathExists);
					sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'models', 'my-entity.js'));
				});
			});

			describe('getFilePath()', () => {
				it('Should return the correct file path', async () => {
					const filePath = await getFilePath('myEntity', 'content');

					assert.strictEqual(filePath, path.join(cwd, 'models', 'my-entity.js'));
				});
			});

			describe('openModel()', () => {
				it('Should open the correct file', async () => {

					sinon.stub(childProcess, 'spawn');

					await openModel('myEntity');

					sinon.assert.calledOnce(childProcess.spawn);
					sinon.assert.calledWithExactly(childProcess.spawn, 'xdg-open', [path.join(cwd, 'models', 'my-entity.js')], {
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

			describe('writeModelIfDoesNotExist()', () => {
				it('Should not write the file if it already exists', async () => {

					fs.pathExists.resolves(true);

					await writeModelIfDoesNotExist('myEntity', 'content');

					sinon.assert.calledOnce(fs.pathExists);
					sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'src/models', 'my-entity.js'));

					sinon.assert.notCalled(fs.outputFile);
				});

				it('Should write the correct file with the content if does not exist', async () => {

					fs.pathExists.resolves(false);

					await writeModelIfDoesNotExist('myEntity', 'content');

					sinon.assert.calledOnce(fs.pathExists);
					sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'src/models', 'my-entity.js'));

					sinon.assert.calledOnce(fs.pathExists);
					sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'src/models', 'my-entity.js'));
				});
			});

			describe('getFilePath()', () => {
				it('Should return the correct file path', async () => {
					const filePath = await getFilePath('myEntity', 'content');

					assert.strictEqual(filePath, path.join(cwd, 'src/models', 'my-entity.js'));
				});
			});

			describe('openModel()', () => {
				it('Should open the correct file', async () => {

					sinon.stub(childProcess, 'spawn');

					await openModel('myEntity');

					sinon.assert.calledOnce(childProcess.spawn);
					sinon.assert.calledWithExactly(childProcess.spawn, 'xdg-open', [path.join(cwd, 'src/models', 'my-entity.js')], {
						detached: true
					});
				});
			});
		});

	});
});
