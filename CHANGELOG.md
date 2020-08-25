# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
