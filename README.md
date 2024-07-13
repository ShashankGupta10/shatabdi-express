
# Shatabdi Express 🚂

An unopinionated Express.js starter template npm package that provides flexibility for developers to choose their preferred database, ORM, and language (JavaScript or TypeScript). It also includes configurations for CI pipeline, Docker, and authentication right out of the box.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Authentication](#authentication)
- [CI Pipeline](#ci-pipeline)
- [Docker](#dockerfile)
- [Husky](#husky)
- [Contributing](#contributing)
- [License](#license)

## Features

- Language Choice: Choose between JavaScript and TypeScript.
- Database Options: Supports various databases (e.g., MongoDB, PostgreSQL, MySQL, etc.).
- ORM Options: Integrates with popular ORMs (e.g., Mongoose, Sequelize, TypeORM, etc.).
- Authentication: Pre-configured authentication setup.
- CI Pipeline: Ready-to-use CI configuration with GitHub Actions.
- Docker Support: Docker configuration for easy containerization.

## Installation

### Using npm:
`npm install shatabdi-express`

### Using Yarn:
`yarn add shatabdi-express`

### Using pnpm:
`pnpm add shatabdi-express`

## Usage

Run the setup command to initialize your project:

`npx shatabdi-express`

Follow the prompts to choose your preferred language, database, and ORM.


## Authentication

Authentication is pre-configured using JWT. You can extend or modify the authentication logic as needed.



## CI Pipeline

The CI pipeline is configured using GitHub Actions. You can find the configuration file in .github/workflows.

- BUILD.yml: Contains the CI check if the project builds successfully.
- LINTING_AND_FORMATTING.yml: Contains the CI check to ensure the project is linted and formatted correctly.

## Dockerfile

Docker is already setup with this project. Make sure docker is installed on your system is running. You can run the following commands to spin up this project using docker. 

- `docker build -t my-express-app .`
- `docker run -p 8080:8080 my-express-app`

## Husky

Husky is also preconfigured with this application and you can change the config of husky which uses eslint and prettier as a starter in the root package.json

## Contributing

Contributions are welcome! Please follow these steps to contribute:

- Fork the repository.
- Create a new branch (git checkout -b "username/issue-name").
- Make your changes.
- Commit your changes (git commit -m 'Appropriate message').
- Push to the branch (git push origin "username/issue-name").
- Create a Pull Request.

## License

This project is licensed under the MIT License.