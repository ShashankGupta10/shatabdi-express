#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require("chalk");
const { generatePrismaSchema } = require('./../helpers/generatePrisma');
const { generateUserController } = require('./../helpers/generateController');
const { generatePackageJson } = require('../helpers/generatePackageJson');
const { generateApp } = require('../helpers/generateApp');

const questions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'What is the name of your project?'
    },
    {
        type: 'list',
        name: 'language',
        message: 'Which language would you like to use?',
        choices: ['JavaScript', 'TypeScript']
    },
    {
        type: 'list',
        name: 'orm',
        message: 'Select ORM / ODM',
        choices: ['Mongoose', 'Prisma']
    },
    {
        type: 'list',
        name: 'database',
        message: 'Select database provider',
        choices: ['SQLite', 'MySQL', 'Postgres'],
        when: (answers) => answers.orm === 'Prisma'
    },
    {
        type: 'confirm',
        name: 'initGit',
        message: 'Should we initialize a git repository?',
        default: true
    }
];

inquirer.prompt(questions).then(answers => {
    const projectPath = path.join(process.cwd(), answers.projectName);
    fs.mkdirSync(projectPath);

    if (answers.language === "JavaScript") {
        const baseTemplatePath = path.join(__dirname, '../templates/base');
        fs.copySync(baseTemplatePath, projectPath);
    }

    if (answers.language === 'TypeScript') {
        const tsTemplatePath = path.join(__dirname, '../templates/base-ts');
        fs.copySync(tsTemplatePath, projectPath);
    }

    const ormPath = path.join(__dirname, `../templates/orm/${answers.orm.toLowerCase()}/models${answers.language === "TypeScript" ? "-ts" : ""}`);
    fs.copySync(ormPath, projectPath);
    if (answers.orm === 'Prisma') {
        const prismaSchemaPath = path.join(projectPath, 'prisma/schema.prisma');
        const prismaSchemaContent = generatePrismaSchema(answers.database);
        fs.writeFileSync(prismaSchemaPath, prismaSchemaContent);
    }

    const appPath = path.join(projectPath, `app${answers.language === "TypeScript" ? ".ts": ".js"}`)
    const appContent = generateApp(answers.orm, answers.language)
    fs.writeFileSync(appPath, appContent)

    const controllerPath = path.join(projectPath, `/controllers/user.controller.${answers.language === 'TypeScript' ? 'ts' : 'js'}`);
    const controllerContent = generateUserController(answers.language, answers.orm);
    fs.writeFileSync(controllerPath, controllerContent);

    const packageJsonPath = path.join(projectPath, '/package.json');
    const packageJson = generatePackageJson(answers.projectName, answers.language, answers.orm)
    fs.writeFileSync(packageJsonPath, packageJson)

    if (answers.initGit) {
        require('child_process').execSync('git init', { cwd: projectPath });
    }

    require('child_process').execSync('npx npm-check-updates -u', { cwd: projectPath });

    console.log(chalk.greenBright(`Project ${answers.projectName} setup complete.`));
    console.log(chalk.greenBright(`Language: ${answers.language}`));
    console.log(chalk.greenBright(`ORM selected: ${answers.orm}`));
    console.log(chalk.greenBright(`Git repository initialized: ${answers.initGit}`));
    if (answers.orm === "Prisma" && answers.database === "SQLite") {
        console.log("Follow the following instructions:")
        console.log(chalk.greenBright("RUN npm install"));
        console.log(chalk.greenBright("RUN prisma generate"));
        console.log(chalk.greenBright("ADD the database file path and JWT_SECRET in the .env file in the root directory"));
        console.log(chalk.greenBright("RUN prisma migrate"));
    }
});