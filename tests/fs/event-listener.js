'use strict';

const assert = require('assert');
const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');
const YAML = require('yamljs');

const open = require('../../lib/wrappers/open');

const {
	writeListener,
	openFile
} = require('../../lib/fs/event-listener');

describe('FS', () => {

	const cwd = '/var/www/root-path';

	before(() => {
		sinon.stub(fs);
		sinon.stub(process, 'cwd')
			.returns(cwd);
		sinon.stub(YAML, 'load');
		sinon.stub(open, 'openFile');
	});

	afterEach(() => {
		sinon.resetHistory();
	});

	after(() => {
		sinon.restore();
	});

	describe('Event Listener Subscription', () => {

		const listener = { namespace: 'my-entity', method: 'my-event-listener' };
		const listener2 = { namespace: 'my-entity', method: 'my-event2-listener' };

		describe('writeListener()', () => {
			it('Should reject if file content is not valid YAML', async () => {

				fs.pathExists.resolves(true);
				YAML.load.resolves('Not a valid YAML }');

				await assert.rejects(() => writeListener('my-service', 'my-entity', 'myEvent', { ...listener }));

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'events/src/my-service/my-entity.yml'));

				sinon.assert.calledOnce(YAML.load);
				sinon.assert.calledWithExactly(YAML.load, path.join(cwd, 'events/src/my-service/my-entity.yml'));

				sinon.assert.notCalled(fs.outputFile);
			});

			it('Should reject if file content is not an array', async () => {

				fs.pathExists.resolves(true);
				YAML.load.resolves({ foo: 'bar' });

				await assert.rejects(() => writeListener('my-service', 'my-entity', 'myEvent', { ...listener }));

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'events/src/my-service/my-entity.yml'));

				sinon.assert.calledOnce(YAML.load);
				sinon.assert.calledWithExactly(YAML.load, path.join(cwd, 'events/src/my-service/my-entity.yml'));

				sinon.assert.notCalled(fs.outputFile);
			});

			it('Should append the function if the file already exists', async () => {

				fs.pathExists.resolves(true);
				YAML.load.resolves([
					{
						service: 'my-service',
						entity: 'my-entity',
						event: 'myEvent',
						listeners: [listener2]
					}
				]);

				await writeListener('my-service', 'my-entity', 'myEvent', { ...listener });

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'events/src/my-service/my-entity.yml'));

				sinon.assert.calledOnce(YAML.load);
				sinon.assert.calledWithExactly(YAML.load, path.join(cwd, 'events/src/my-service/my-entity.yml'));

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'events/src/my-service/my-entity.yml'),
					YAML.stringify([
						{
							service: 'my-service',
							entity: 'my-entity',
							event: 'myEvent',
							listeners: [listener2, listener]
						}
					], Infinity, 2));
			});

			it('Should init the file if it does not exists', async () => {

				fs.pathExists.resolves(false);

				await writeListener('my-service', 'my-entity', 'myEvent', { ...listener });

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'events/src/my-service/my-entity.yml'));

				sinon.assert.notCalled(YAML.load);

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'events/src/my-service/my-entity.yml'),
					YAML.stringify([
						{
							service: 'my-service',
							entity: 'my-entity',
							event: 'myEvent',
							listeners: [listener]
						}
					], Infinity, 2));
			});
		});

		describe('openFile()', () => {
			it('Should open the correct file', async () => {

				await openFile('my-service', 'my-entity');

				sinon.assert.calledOnceWithExactly(open.openFile, path.join(cwd, 'events/src/my-service/my-entity.yml'));
			});
		});

	});
});
