# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.8.0] - 2022-02-16
### Added
- New `create-function` command

## [1.7.3] - 2021-10-10
### Changed
- Updates in views sections, using `StatusSelector` component
- Updated dependencies

## [1.7.2] - 2021-07-28
### Fixed
- Removed extra `.js` in require statement in model and event listener tests

## [1.7.1] - 2021-07-23
### Added
- `FullAuthorizer` or `NoClientAuthorizer` applied in serverless function
- Correct `databaseKey` _getter_ for Models and test

### Changed
- Security prompt replaced with Auth prompt

## [1.7.0] - 2021-07-23
### Changed
- Apis get, list, post and put optimized tests and sources
- Model and model tests better templates and tests

## [1.6.0] - 2020-10-07
### Added
- Header in Edit schema
- GitHub Actions for build, coverage and publish workflows

### Changed
- Names for sections in Edit and New schemas
- Reused multiple api-schemas: `schemas`, `parameters`, `responses`

## [1.5.0] - 2020-08-25
### Added
- Cross platform compatibility for opening files in mac
- API List filters will now have valueMappers
- Npm version badge added to Readme
- Numeric fields now have `type: number` set in Create and Edit schemas

### Changed
- API List filtering cases improved
- `sandbox` renamed to `sinon` in every test

### Fixed
- CLI arguments are now properly integrated
- View schemas are now reported with file extension
- Form field `status` has now a default value of `'active'`
- Performance improvements
- Documentation now mentions `MS_PATH` env var

## [1.4.1] - 2020-08-24
### Changed
- Report now prints relative paths

## [1.4.0] - 2020-07-28
### Added
- Added prompt 'Should add view-schemas' for `api-list`, `api-post`, `api-put` and `crud`
- Improoved lib organization with separated prompt files

## [1.3.0] - 2020-06-20
### Added
- `AsyncUserChip` and `UserSelector` compatibility added

### Changed
- Filter and form field for `status` improved
- Changed `superstruct` dependency to `@janiscommerce/superstruct`

### Fixed
- Models names are not suffixed with 'Model' any more
- Model test doesn't require the model with extension any more

## [1.2.0] - 2020-02-14
### Added
- Read only properties in API Schemas
- `status` enum
- Templated user filter
- Boolean filters in browses

### Changed
- API Schema types are now more accurate
- Examples are now more accurate

## [1.1.1] - 2020-02-06
### Fixed
- Now event-listeners entity and event are in dash case

## [1.1.0] - 2020-01-21
### Added
- `create-api` command added
- CRUD operations entity plural form can now be set by the user
- File creation report with events for each one
- Better known-fields filtering and data generation

### Changed
- Event listeners are now located in the following path: `event-listeners/service/entity/event.js`.
- Event listeners service added to API namespace
- Only must-change files are automatically opened now
- Models don't have a databaseKey by default any more

### Fixed
- Multi-word entities handle improved

## [1.0.0] - 2020-01-10
### Added
- Package initial version with Event listener, CRUD APIs and CRUD bundle
