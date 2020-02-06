# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
