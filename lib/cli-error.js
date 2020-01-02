'use strict';

class CliError extends Error {

	static get codes() {
		return {
			// your errors here...
		};

	}

	constructor(err, code) {
		super(err.message || err);
		this.code = code;
		this.name = 'CliError';
	}
}

module.exports = CliError;
