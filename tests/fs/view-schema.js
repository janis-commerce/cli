'use strict';

const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');
const childProcess = require('child_process');

const {
	writeSchema,
	openSchema
} = require('../../lib/fs/view-schema');

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

	describe('View Schema', () => {

		describe('writeSchema()', () => {
			it('Should write the correct file with the content', async () => {
				await writeSchema('myEntity', 'myPage', 'content');

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'view-schemas', 'my-entity/my-page.yml'), 'content');
			});
		});

		describe('openSchema()', () => {
			it('Should open the correct file', async () => {

				await openSchema('myEntity', 'myPage', 'content');

				sinon.assert.calledOnce(childProcess.spawn);
				sinon.assert.calledWithExactly(childProcess.spawn, 'xdg-open', [path.join(cwd, 'view-schemas', 'my-entity/my-page.yml')], {
					detached: true
				});
			});
		});

	});
});
