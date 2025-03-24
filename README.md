# ts-api [![Version](https://img.shields.io/badge/Version-v2.1.0-blue.svg)](https://semver.org)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)

## Quality report
[Sonarcloud](https://sonarcloud.io/project/overview?id=vinjatovix_ts-api)

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)

[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=bugs)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=vinjatovix_ts-api&metric=coverage)](https://sonarcloud.io/summary/new_code?id=vinjatovix_ts-api)

## License
This project is licensed under the MIT License.

See [LICENSE](LICENSE.md) for details.

## Changelog
[CHANGELOG](https://github.com/vinjatovix/ts-api/releases)

---
---
# Installation
## Prerequisites

- Node.js version = 20.x,22.x
- npm version >= 10.1.0

A `.tool-versions` file is provided to easily work with [asdf](https://asdf-vm.com/)


1. Clone the repository:
  ```bash
  git clone https://github.com/vinjatovix/ts-api.git
  cd ts-api
  ```

2. Install dependencies:
  ```bash
  npm install
  ```
## Usage
Please rename `.env_example` to `.env` And full-fill the variables if needed.
### Run in dev mode
Run the development server:
```bash
npm run dev
```
### Run the build
You can build and run it locally with:
```bash
npm run start:local
```
Or just with:
```bash
npm run docker:local
```
## Setup Persistence
1. Starts the mongo db
```bash
npm run docker:mongo
```
2. Provisioning the db
Provisioning the local mongo with cloud `$ENV` data
```bash
npm run restoreDB $ENV password
```
Or restore previous dumped data.
```bash
npm run restoreDump $ENV
```
> Note this will only work if previous data for such `$ENV` was dumped and restored before
---
---
# Api First
**Please, update the `openApi.yaml` if you need to make critical changes related to your task/issues.**

A nice postman collection is provided for you ready to work with in `./doc/postman/collection`.

**Remember to update and add it to your PR.**

**We are working to automate this doc with swagger**

## Testing
### ATDD
We encourage ATDD flow in development phase.
Cucumber and jest are ready to work in this repo.
1. For acceptance tests
```bash
npm run test:features
```
2. In development
For unit tests
```bash
npm run test:unit
```
3. Full tests routines
```bash
npm run test
```
> Note this gathers full coverage info
---
---
# Prepare release
This repository uses semver, `$RELEASE_TYPE` could be major, minor or patch.
```bash
npm run prepare-release $RELEASE_TYPE
```
---
---
# Npm Scripts resume
- build: Clean the previous build, transpile TypeScript, and copy necessary files to the dist directory.
- check-dependencies: Check for circular dependencies in the source code using madge.
- dev: Run the application in development mode using ts-node-dev.
- docker:local: Build the Docker image and start the application using Docker Compose.
- docker:mongo: Set up the local mongo docker.
- prepare-release: Accepts major, minor, patch. Updates release files, commit and push the new tag.
- restoreDB: Requires an ENV and a password for restore in local mongo docker some cloud DB
- restoreDump: Accepts an ENV for restore a previously dumped ENV db stores in the local mongo docker.
- start: Start the transpiled build in the deployment server.
- start:local: Start the transpiled application in the local environment.
- test: Run both unit and feature tests.
- test:features: Run feature tests using Cucumber.js.
- test:unit: Run unit tests using Jest.
---
---
# Contributing
Feel free to contribute to this project but keep in mind the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)

Open an issue or create a [pull request](https://github.com/vinjatovix/ts-api/pulls).
### Bugs and Issues
Please report [bugs](https://github.com/vinjatovix/ts-api/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=), [issues](https://github.com/vinjatovix/ts-api/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=) or [Report a vulnerability](https://github.com/vinjatovix/ts-api/security/advisories/new) at GitHub [Issues](https://github.com/vinjatovix/ts-api/issues).
### Repository
https://github.com/vinjatovix/ts-api
### Author
[Vinjatovix](https://github.com/vinjatovix)

---
---
# Dependencies
See [`package.json`](package.json) for a list of dependencies and their versions.

For more details, visit the project homepage.
