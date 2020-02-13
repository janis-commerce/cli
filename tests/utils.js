'use strict';

const assert = require('assert');
const sinon = require('sinon');
const prompts = require('prompts');

const {
	normalizePath,
	getFieldSampleValue,
	getFieldSampleStruct,
	ensureOptions,
	getValidationTestCase
} = require('../lib/utils');

describe('Utils', () => {

	describe('normalizePath()', () => {

		it('Should add a slash at the begining of the path', () => {
			assert.strictEqual(normalizePath('product'), '/product');
		});

		it('Should mantain only one slash at the begining of the path', () => {
			assert.strictEqual(normalizePath('/product'), '/product');
		});

		it('Should ensure only one slash at the begining of the path', () => {
			assert.strictEqual(normalizePath('//product'), '/product');
		});

		it('Should remove any slash at the end of the path', () => {
			assert.strictEqual(normalizePath('/product//'), '/product');
		});
	});

	describe('getFieldSampleValue()', () => {

		const idStringRegexp = /^'[a-f0-9]{24}'$/i;
		const dateStringRegexp = /^'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z'$/i;

		it('Should return a valid ObjectID for a field named id', () => {
			const sampleValue = getFieldSampleValue('id');
			assert(sampleValue.match(idStringRegexp));
		});

		it('Should return a status name for a field named status', () => {
			assert.strictEqual(getFieldSampleValue('status'), '\'active\'');
		});

		it('Should return a valid date for a field named dateCreated', () => {
			const sampleValue = getFieldSampleValue('dateCreated');
			assert(sampleValue.match(dateStringRegexp));
		});

		it('Should return a valid date for a field named dateModified', () => {
			const sampleValue = getFieldSampleValue('dateModified');
			assert(sampleValue.match(dateStringRegexp));
		});

		it('Should return a valid ObjectID for a field named userCreated', () => {
			const sampleValue = getFieldSampleValue('userCreated');
			assert(sampleValue.match(idStringRegexp));
		});

		it('Should return a valid ObjectID for a field named userModified', () => {
			const sampleValue = getFieldSampleValue('userModified');
			assert(sampleValue.match(idStringRegexp));
		});

		it('Should return a boolean for a field starting with \'is\'', () => {
			assert.strictEqual(getFieldSampleValue('isSomething'), true);
		});

		it('Should return a boolean for a field starting with \'has\'', () => {
			assert.strictEqual(getFieldSampleValue('hasSomething'), true);
		});

		it('Should return a a fixed value \'bar\' for every other field', () => {
			assert.strictEqual(getFieldSampleValue('unknown'), '\'bar\'');
		});
	});

	describe('getFieldSampleStruct()', () => {

		it('Should return boolean struct for a field starting with \'is\'', () => {
			assert.strictEqual(getFieldSampleStruct('isSomething'), '\'boolean\'');
		});

		it('Should return boolean struct for a field starting with \'has\'', () => {
			assert.strictEqual(getFieldSampleStruct('hasSomething'), '\'boolean\'');
		});

		it('Should return number struct for a field containing \'qty\'', () => {
			assert.strictEqual(getFieldSampleStruct('productQty'), '\'number\'');
		});

		it('Should return number struct for a field containing \'quantity\'', () => {
			assert.strictEqual(getFieldSampleStruct('quantityPicked'), '\'number\'');
		});

		it('Should return string struct for every other field', () => {
			assert.strictEqual(getFieldSampleStruct('unknown'), '\'string\'');
		});
	});

	describe('', () => {

		it('Should return a string with the test case with the given options', () => {
			assert.strictEqual(getValidationTestCase('myEntity', 'myModelName', 'myFieldName'), `		{
			description: 'Should return 400 if the required field \\'myFieldName\\' is not passed',
			request: {
				data: deleteProp(myEntity, 'myFieldName')
			},
			response: {
				code: 400
			},
			before: sandbox => {
				sandbox.stub(myModelName.prototype);
			}
		},`);
		});
	});

	describe('ensureOptions()', () => {

		afterEach(() => {
			prompts.inject([]); // Clear injected values
			sinon.restore();
		});

		const sampleCurrentData = {
			_: 'other args',
			service: 'myService'
		};

		it('Should prompt for options if current data is empty and return the result', async () => {

			prompts.inject(['bar']);

			assert.deepStrictEqual(await ensureOptions([
				{
					name: 'foo',
					type: 'text',
					message: 'What is the foo?'
				}
			], {}), {
				foo: 'bar'
			});
		});

		it('Should prompt for options if current data doesn\'t have any expected value and return the result', async () => {

			prompts.inject(['bar']);

			assert.deepStrictEqual(await ensureOptions([
				{
					name: 'foo',
					type: 'text',
					message: 'What is the foo?'
				}
			], { ...sampleCurrentData }), {
				...sampleCurrentData,
				foo: 'bar'
			});
		});

		it('Should skip options that are present in the current data, prompt the rest and return the result', async () => {

			prompts.inject(['baz']);

			const currentData = {
				...sampleCurrentData,
				foo: 'bar'
			};

			assert.deepStrictEqual(await ensureOptions([
				{
					name: 'foo',
					type: 'text',
					message: 'What is the foo?'
				},
				{
					name: 'bar',
					type: 'text',
					message: 'What is the foo?'
				}
			], { ...currentData }), {
				...currentData,
				bar: 'baz'
			});
		});

		it('Should not prompt any option if every option is in the current data and return the result', async () => {

			const currentData = {
				...sampleCurrentData,
				foo: 'bar',
				bar: 'baz'
			};

			assert.deepStrictEqual(await ensureOptions([
				{
					name: 'foo',
					type: 'text',
					message: 'What is the foo?'
				},
				{
					name: 'bar',
					type: 'text',
					message: 'What is the foo?'
				}
			], { ...currentData }), {
				...currentData
			});
		});

		it('Should not prompt any option if every option is in the current data and return the result', async () => {

			sinon.stub(process, 'exit');

			prompts.inject([new Error('User canceled')]);

			await ensureOptions([
				{
					name: 'foo',
					type: 'text',
					message: 'What is the foo?'
				}
			], {});

			sinon.assert.calledOnce(process.exit);
			sinon.assert.calledWithExactly(process.exit, 0);
		});
	});

});
