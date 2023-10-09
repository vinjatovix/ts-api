# ts-api [![Version](https://img.shields.io/badge/Version-v1.2.0-blue.svg)](https://semver.org)
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

See [LICENSE](https://github.com/vinjatovix/ts-api/blob/main/LICENSE.md) for details.

## Changelog
Check current release [CHANGELOG](https://github.com/vinjatovix/ts-api/releases)
## Prerequisites

- Node.js version >= 18.2.1
- npm version >= 8.19.2

A `.tool-versions` file is provided to easily work with [asdf](https://asdf-vm.com/)

## Installation

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

1. Run the development server:
```bash
npm run dev
```

2. You can build and run with:
```bash
npm run start:local
```

3. Or just with:
```bash
npm run docker
```

Access the API at http://localhost:PORT.

## Prepare release
This repository uses semver, `$RELEASE_TYPE` could be major, minor or patch.
```bash
npm run prepare-release $RELEASE_TYPE
```

## Npm Scripts
- build: Clean the previous build, transpile TypeScript, and copy necessary files to the dist directory.
- check-dependencies: Check for circular dependencies in the source code using madge.
- dev: Run the application in development mode using ts-node-dev.
- docker: Build the Docker image and start the application using Docker Compose.
- start: Start the transpiled build in the deployment server.
- start:local: Start the transpiled application in the local environment.
- prepare-release: accepts major, minor, patch. Updates release files, commit and push the new tag.
- test: Run both unit and feature tests.
- test:features: Run feature tests using Cucumber.js.
- test:unit: Run unit tests using Jest.

## Contributing
Feel free to contribute to this project.

Open an issue or create a [pull request](https://github.com/vinjatovix/ts-api/pulls).
### Bugs and Issues
Please report [bugs](https://github.com/vinjatovix/ts-api/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=), [issues](https://github.com/vinjatovix/ts-api/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=) or [Report a vulnerability](https://github.com/vinjatovix/ts-api/security/advisories/new) at GitHub [Issues](https://github.com/vinjatovix/ts-api/issues).

## Repository
Type: Git

URL: https://github.com/vinjatovix/ts-api
## Author
[Vinjatovix](https://github.com/vinjatovix)

## Dependencies
See [`package.json`](https://github.com/vinjatovix/ts-api/blob/main/package.json) for a list of dependencies and their versions.

For more details, visit the project homepage.
