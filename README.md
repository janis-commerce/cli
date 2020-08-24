# cli

[![Build Status](https://travis-ci.org/janis-commerce/cli.svg?branch=master)](https://travis-ci.org/janis-commerce/cli)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/cli/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/cli?branch=master)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Fcli.svg)](https://www.npmjs.com/package/@janiscommerce/cli)

A CLI application to improve JANIS development experience

## Installation
```sh
npm install @janiscommerce/cli
```

Or to install it globally
```sh
npm install -g @janiscommerce/cli
```

## Functionality
Each command will create and configure all the necessary files. Then they will be opened with your preferred editor.

**Important** Some properties cannot be generated automatically so they need to be adjusted manually.

## Environment

This package, as all of the @janiscommerce ecosystem, is aware of the `MS_PATH` env variable. Remember to set it first in case you need it, for example: `MS_PATH=src janis-cli create-api`.

## Usage

`janis-cli <command> [...args]`

```
Commands:
  janis-cli create-api-get         Create a new API Get
  janis-cli create-api-list        Create a new API List
  janis-cli create-api-post        Create a new API Post
  janis-cli create-api-put         Create a new API Put
  janis-cli create-api             Create a new API
  janis-cli create-crud            Create an entity CRUD operations
  janis-cli create-event-listener  Create a new Event Listener
```

To get more information about command arguments, just run `janis-cli <command> --help`.

Every missing argument will be prompted in an interactive way.

## Example
```bash
$ janis-cli create-api-get -s my-service

# The missing argument 'entity' will be prompted
```
