'use strict';

const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');

const open = require('../../lib/wrappers/open');

const {
	writeSchema,
	openSchema
} = require('../../lib/fs/function-schema');

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

	describe('Function Schema', () => {

		const baseDir = 'schemas/src';

		describe('writeSchema()', () => {
			it('Should write the correct file with the content (with user defined path)', async () => {
				await writeSchema('PublishProducts', 'PublishProducts', 'content');

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, baseDir, 'PublishProducts', 'PublishProducts.yml'), 'content');
			});

			it('Should write the correct file with the content (with default path)', async () => {
				await writeSchema('', 'PublishProducts', 'content');

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, baseDir, 'PublishProducts.yml'), 'content');
			});
		});

		describe('openSchema()', () => {
			it('Should open the correct file (with user defined path)', async () => {

				await openSchema('PublishProducts', 'PublishProducts', 'content');

				sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, baseDir, 'PublishProducts', 'PublishProducts'));
			});

			it('Should open the correct file (with default path)', async () => {

				await openSchema('', 'PublishProducts', 'content');

				sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, baseDir, 'PublishProducts'));
			});
		});
	});
});
