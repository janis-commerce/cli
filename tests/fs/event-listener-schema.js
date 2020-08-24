'use strict';

const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');

const open = require('../../lib/wrappers/open');

const {
	writeSchema,
	openSchema
} = require('../../lib/fs/event-listener-schema');

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

	describe('Event Listener Schema', () => {

		const baseDir = 'schemas/src/public/event-listeners';

		describe('writeSchema()', () => {
			it('Should write the correct file with the content', async () => {
				await writeSchema('my-service', 'my-entity', 'myEvent', 'content');

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, baseDir, 'my-service/my-entity/my-event.yml'), 'content');
			});
		});

		describe('openSchema()', () => {
			it('Should open the correct file', async () => {

				await openSchema('my-service', 'my-entity', 'myEvent', 'content');

				sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, baseDir, 'my-service/my-entity/my-event.yml'));
			});
		});

	});
});
