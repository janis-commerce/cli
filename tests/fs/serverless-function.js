'use strict';

const assert = require('assert');
const sinon = require('sinon');

const path = require('path');
const fs = require('fs-extra');
const childProcess = require('child_process');

const {
	writeFunction,
	openFile
} = require('../../lib/fs/serverless-function');

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

	describe('Serverless Function', () => {

		const functionData = { fn: 'data' };
		const functionData2 = { fn2: 'data2' };

		describe('writeFunction()', () => {
			it('Should reject if file content is not valid JSON', async () => {

				fs.pathExists.resolves(true);
				fs.readFile.resolves('Not a valid JSON }');

				await assert.rejects(() => writeFunction({ ...functionData }));

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'serverless/functions.json'));

				sinon.assert.calledOnce(fs.readFile);
				sinon.assert.calledWithExactly(fs.readFile, path.join(cwd, 'serverless/functions.json'), 'utf8');

				sinon.assert.notCalled(fs.outputFile);
			});

			it('Should reject if file content is not an array', async () => {

				fs.pathExists.resolves(true);
				fs.readFile.resolves(JSON.stringify({ foo: 'bar' }, null, '\t'));

				await assert.rejects(() => writeFunction({ ...functionData }));

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'serverless/functions.json'));

				sinon.assert.calledOnce(fs.readFile);
				sinon.assert.calledWithExactly(fs.readFile, path.join(cwd, 'serverless/functions.json'), 'utf8');

				sinon.assert.notCalled(fs.outputFile);
			});

			it('Should append the function if the file already exists', async () => {

				fs.pathExists.resolves(true);
				fs.readFile.resolves(JSON.stringify([functionData2], null, '\t'));

				await writeFunction({ ...functionData });

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'serverless/functions.json'));

				sinon.assert.calledOnce(fs.readFile);
				sinon.assert.calledWithExactly(fs.readFile, path.join(cwd, 'serverless/functions.json'), 'utf8');

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'serverless/functions.json'),
					JSON.stringify([functionData2, functionData], null, '\t'));
			});

			it('Should init the file if it does not exists', async () => {

				fs.pathExists.resolves(false);

				await writeFunction({ ...functionData });

				sinon.assert.calledOnce(fs.pathExists);
				sinon.assert.calledWithExactly(fs.pathExists, path.join(cwd, 'serverless/functions.json'));

				sinon.assert.notCalled(fs.readFile);

				sinon.assert.calledOnce(fs.outputFile);
				sinon.assert.calledWithExactly(fs.outputFile, path.join(cwd, 'serverless/functions.json'), JSON.stringify([functionData], null, '\t'));
			});
		});

		describe('openFile()', () => {
			it('Should open the correct file', async () => {

				await openFile();

				sinon.assert.calledOnce(childProcess.spawn);
				sinon.assert.calledWithExactly(childProcess.spawn, 'xdg-open', [path.join(cwd, 'serverless/functions.json')], {
					detached: true
				});
			});
		});

	});
});
