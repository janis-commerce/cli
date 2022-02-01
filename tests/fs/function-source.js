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
						await writeSource('PublishProducts', 'publish-products', 'content');

						sinon.assert.calledOnce(fs.outputFile);
						sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'lambda', 'publish-products', 'publish-products.js'), 'content');
					});
				});

				describe('getFilePath()', () => {
					it('Should return the correct file path', async () => {
						const filePath = await getFilePath('PublishProducts', 'publish-products', 'content');

						assert.strictEqual(filePath, path.join(cwd, 'lambda', 'publish-products', 'publish-products.js'), 'content');
					});
				});

				describe('openSource()', () => {
					it('Should open the correct file', async () => {

						await openSource('PublishProducts', 'publish-products', 'content');

						sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'lambda', 'publish-products', 'publish-products.js'));
					});
				});
			});

			context('with default path', () => {
				describe('writeSource()', () => {
					it('Should write the correct file with the content', async () => {
						await writeSource('', 'publish-products', 'content');

						sinon.assert.calledOnce(fs.outputFile);
						sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'lambda', 'publish-products.js'), 'content');
					});
				});

				describe('getFilePath()', () => {
					it('Should return the correct file path', async () => {
						const filePath = await getFilePath('', 'publish-products', 'content');

						assert.strictEqual(filePath, path.join(cwd, 'lambda', 'publish-products.js'), 'content');
					});
				});

				describe('openSource()', () => {
					it('Should open the correct file', async () => {

						await openSource('', 'publish-products', 'content');

						sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'lambda', 'publish-products.js'));
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
						await writeSource('PublishProducts', 'publish-products', 'content');

						sinon.assert.calledOnce(fs.outputFile);
						sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'src/lambda', 'publish-products', 'publish-products.js'), 'content');
					});
				});

				describe('getFilePath()', () => {
					it('Should return the correct file path', async () => {
						const filePath = await getFilePath('PublishProducts', 'publish-products', 'content');

						assert.strictEqual(filePath, path.join(cwd, 'src/lambda', 'publish-products', 'publish-products.js'));
					});
				});

				describe('openSource()', () => {
					it('Should open the correct file', async () => {

						await openSource('PublishProducts', 'publish-products', 'content');

						sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'src/lambda', 'publish-products', 'publish-products.js'));
					});
				});
			});

			context('with default path', () => {
				describe('writeSource()', () => {
					it('Should write the correct file with the content', async () => {
						await writeSource('', 'publish-products', 'content');

						sinon.assert.calledOnce(fs.outputFile);
						sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'src/lambda', 'publish-products.js'), 'content');
					});
				});

				describe('getFilePath()', () => {
					it('Should return the correct file path', async () => {
						const filePath = await getFilePath('', 'publish-products', 'content');

						assert.strictEqual(filePath, path.join(cwd, 'src/lambda', 'publish-products.js'));
					});
				});

				describe('openSource()', () => {
					it('Should open the correct file', async () => {

						await openSource('', 'publish-products', 'content');

						sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'src/lambda', 'publish-products.js'));
					});
				});
			});
		});
	});
});
