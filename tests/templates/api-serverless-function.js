'use strict';

const assert = require('assert');

const template = require('../../lib/templates/api-serverless-function');

describe('Templates', () => {
	describe('API Serverless Function', () => {

		it('Should return the serverless helper function hook without authorizer', () => {
			const result = template({
				path: '/my-custom-api',
				method: 'PATCH',
				methodAlias: 'some-method-name'
			});

			assert.deepStrictEqual(result, [
				'janis.api',
				{
					path: '/my-custom-api',
					method: 'PATCH',
					methodName: 'some-method-name',
					cors: true
				}
			]);
		});

		it('Should return the serverless helper function hook with FullAuthorizer', () => {
			const result = template({
				path: '/my-custom-api',
				method: 'PATCH',
				methodAlias: 'some-method-name',
				auth: 'full'
			});

			assert.deepStrictEqual(result, [
				'janis.api',
				{
					path: '/my-custom-api',
					method: 'PATCH',
					methodName: 'some-method-name',
					authorizer: 'FullAuthorizer',
					cors: true
				}
			]);
		});

		it('Should return the serverless helper function hook with NoClientAuthorizer', () => {
			const result = template({
				path: '/my-custom-api',
				method: 'PATCH',
				methodAlias: 'some-method-name',
				auth: 'core'
			});

			assert.deepStrictEqual(result, [
				'janis.api',
				{
					path: '/my-custom-api',
					method: 'PATCH',
					methodName: 'some-method-name',
					authorizer: 'NoClientAuthorizer',
					cors: true
				}
			]);
		});
	});
});
