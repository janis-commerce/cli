'use strict';

const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');

const open = require('../../lib/wrappers/open');

const {
	writeViewSchema,
	openSchema
} = require('../../lib/fs/view-schema');

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

	describe('View Schema', () => {

		describe('writeSchema()', () => {
			it('Should write the correct file with the content', async () => {
				await writeViewSchema('myEntity', 'myPage', 'content');

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'view-schemas', 'my-entity', 'my-page.yml'), 'content');
			});

			it('Should not write the file if it already exists', async () => {

				fs.pathExists.resolves(true);

				await writeViewSchema('myEntity', 'myPage', 'content');

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'view-schemas', 'my-entity', 'my-page.yml'));

				sinon.assert.notCalled(fs.outputFile);
			});
		});

		describe('openSchema()', () => {
			it('Should open the correct file', async () => {

				await openSchema('myEntity', 'myPage', 'content');

				sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'view-schemas', 'my-entity', 'my-page.yml'));
			});
		});

	});
});
