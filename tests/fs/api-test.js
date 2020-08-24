'use strict';

const assert = require('assert');
const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');

const open = require('../../lib/wrappers/open');

const {
	writeTest,
	getFilePath,
	openTest
} = require('../../lib/fs/api-test');

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

	describe('API Test', () => {

		describe('writeTest()', () => {
			it('Should write the correct file with the content', async () => {
				await writeTest('/some/path', 'content');

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'tests/api', 'some/path.js'), 'content');
			});
		});

		describe('getFilePath()', () => {
			it('Should return the correct file path', async () => {
				const filePath = await getFilePath('/some/path', 'content');

				assert.strictEqual(filePath, path.join(cwd, 'tests/api', 'some/path.js'));
			});
		});

		describe('openTest()', () => {
			it('Should open the correct file', async () => {

				await openTest('/some/path');

				sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'tests/api', 'some/path.js'));
			});
		});

	});
});
