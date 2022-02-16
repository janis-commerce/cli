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
} = require('../../lib/fs/function-source');

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

	describe('Function Source', () => {

		context('Without MS_PATH env var', () => {
			context('with user defined path', () => {
				describe('writeSource()', () => {
					it('Should write the correct file with the content', async () => {
						await writeSource('PublishProducts', 'PublishProducts', 'content');

						sinon.assert.calledOnce(fs.outputFile);
						sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'lambda', 'PublishProducts', 'PublishProducts.js'), 'content');
					});
				});

				describe('getFilePath()', () => {
					it('Should return the correct file path', async () => {
						const filePath = await getFilePath('PublishProducts', 'PublishProducts', 'content');

						assert.strictEqual(filePath, path.join(cwd, 'lambda', 'PublishProducts', 'PublishProducts.js'), 'content');
					});
				});

				describe('openSource()', () => {
					it('Should open the correct file', async () => {

						await openSource('PublishProducts', 'PublishProducts', 'content');

						sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'lambda', 'PublishProducts', 'PublishProducts.js'));
					});
				});
			});

			context('with default path', () => {
				describe('writeSource()', () => {
					it('Should write the correct file with the content', async () => {
						await writeSource('', 'PublishProducts', 'content');

						sinon.assert.calledOnce(fs.outputFile);
						sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'lambda', 'PublishProducts.js'), 'content');
					});
				});

				describe('getFilePath()', () => {
					it('Should return the correct file path', async () => {
						const filePath = await getFilePath('', 'PublishProducts', 'content');

						assert.strictEqual(filePath, path.join(cwd, 'lambda', 'PublishProducts.js'), 'content');
					});
				});

				describe('openSource()', () => {
					it('Should open the correct file', async () => {

						await openSource('', 'PublishProducts', 'content');

						sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'lambda', 'PublishProducts.js'));
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

			context('with user defined path', () => {
				describe('writeSource()', () => {
					it('Should write the correct file with the content', async () => {
						await writeSource('PublishProducts', 'PublishProducts', 'content');

						sinon.assert.calledOnce(fs.outputFile);
						sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'src/lambda', 'PublishProducts', 'PublishProducts.js'), 'content');
					});
				});

				describe('getFilePath()', () => {
					it('Should return the correct file path', async () => {
						const filePath = await getFilePath('PublishProducts', 'PublishProducts', 'content');

						assert.strictEqual(filePath, path.join(cwd, 'src/lambda', 'PublishProducts', 'PublishProducts.js'));
					});
				});

				describe('openSource()', () => {
					it('Should open the correct file', async () => {

						await openSource('PublishProducts', 'PublishProducts', 'content');

						sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'src/lambda', 'PublishProducts', 'PublishProducts.js'));
					});
				});
			});

			context('with default path', () => {
				describe('writeSource()', () => {
					it('Should write the correct file with the content', async () => {
						await writeSource('', 'PublishProducts', 'content');

						sinon.assert.calledOnce(fs.outputFile);
						sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'src/lambda', 'PublishProducts.js'), 'content');
					});
				});

				describe('getFilePath()', () => {
					it('Should return the correct file path', async () => {
						const filePath = await getFilePath('', 'PublishProducts', 'content');

						assert.strictEqual(filePath, path.join(cwd, 'src/lambda', 'PublishProducts.js'));
					});
				});

				describe('openSource()', () => {
					it('Should open the correct file', async () => {

						await openSource('', 'PublishProducts', 'content');

						sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'src/lambda', 'PublishProducts.js'));
					});
				});
			});
		});
	});
});
