#!/usr/bin/env node

'use strict';

// eslint-disable-next-line
require('yargs')
	.commandDir('./commands', {
		recurse: true
	})
	.demandCommand()
	.help()
	.argv;
