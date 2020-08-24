'use strict';

const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');

const open = require('../../lib/wrappers/open');

const {
	writeSchema,
	writeSchemaIfDoesNotExist,
	openSchema
} = require('../../lib/fs/api-schema');

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

	describe('API Schema', () => {

		describe('writeSchema()', () => {
			it('Should write the correct file with the content', async () => {
				await writeSchema('/some/path', 'content');

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'schemas/src/public/api', 'some/path.yml'), 'content');
			});
		});

		describe('writeSchemaIfDoesNotExist()', () => {
			it('Should not write the file if it already exists', async () => {

				fs.pathExists.resolves(true);

				await writeSchemaIfDoesNotExist('/some/path', 'content');

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'schemas/src/public/api', 'some/path.yml'));

				sinon.assert.notCalled(fs.outputFile);
			});

			it('Should write the correct file with the content if does not exist', async () => {

				fs.pathExists.resolves(false);

				await writeSchemaIfDoesNotExist('/some/path', 'content');

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'schemas/src/public/api', 'some/path.yml'));

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'schemas/src/public/api', 'some/path.yml'));
			});
		});

		describe('openSchema()', () => {
			it('Should open the correct file', async () => {

				await openSchema('/some/path');

				sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'schemas/src/public/api', 'some/path.yml'));
			});
		});

	});
});
