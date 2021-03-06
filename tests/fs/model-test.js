'use strict';

const assert = require('assert');
const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');

const open = require('../../lib/wrappers/open');

const {
	writeTestIfDoesNotExist,
	getFilePath,
	openTest
} = require('../../lib/fs/model-test');

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

	describe('Model Test', () => {

		describe('writeTestIfDoesNotExist()', () => {
			it('Should not write the file if it already exists', async () => {

				fs.pathExists.resolves(true);

				await writeTestIfDoesNotExist('myEntity', 'content');

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'tests/models', 'my-entity.js'));

				sinon.assert.notCalled(fs.outputFile);
			});

			it('Should write the correct file with the content if does not exist', async () => {

				fs.pathExists.resolves(false);

				await writeTestIfDoesNotExist('myEntity', 'content');

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'tests/models', 'my-entity.js'));

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'tests/models', 'my-entity.js'));
			});
		});

		describe('getFilePath()', () => {
			it('Should return the correct file path', async () => {
				const filePath = await getFilePath('myEntity', 'content');

				assert.strictEqual(filePath, path.join(cwd, 'tests/models', 'my-entity.js'));
			});
		});

		describe('openTest()', () => {
			it('Should open the correct file', async () => {

				await openTest('myEntity');

				sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'tests/models', 'my-entity.js'));
			});
		});

	});
});
