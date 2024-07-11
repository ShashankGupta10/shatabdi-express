#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { generatePrismaSchema } = require('./../helpers/generatePrisma');
const { generateUserController } = require('./../helpers/generateController');
const { generatePackageJson } = require('./../helpers/generatePackageJson');
const { generateApp } = require('./../helpers/generateApp');
const { generateAuthRouter } = require('./../helpers/generateAuthRouter');
const { generateEnv } = require('./../helpers/generateEnv');

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

    // Copy base template
    if (answers.language === 'JavaScript') {
        const baseTemplatePath = path.join(__dirname, '../templates/base');
        fs.copySync(baseTemplatePath, projectPath);
    } else if (answers.language === 'TypeScript') {
        const tsTemplatePath = path.join(__dirname, '../templates/base-ts');
        fs.copySync(tsTemplatePath, projectPath);
    }

    // Copy ORM specific template
    if (answers.orm === 'Mongoose') {
        const ormPath = path.join(__dirname, `../templates/orm/mongoose/models${answers.language === 'TypeScript' ? '-ts' : ''}`);
        fs.copySync(ormPath, projectPath);
    } else if (answers.orm === 'Prisma') {
        const ormPath = path.join(__dirname, '../templates/orm/prisma');
        fs.copySync(ormPath, projectPath);
        const prismaSchemaPath = path.join(projectPath, '/prisma/schema.prisma');
        const prismaSchemaContent = generatePrismaSchema(answers.database);
        fs.writeFileSync(prismaSchemaPath, prismaSchemaContent);
    }

    // Generate app file
    const appPath = path.join(projectPath, `app${answers.language === 'TypeScript' ? '.ts' : '.js'}`);
    const appContent = generateApp(answers.orm, answers.language);
    fs.writeFileSync(appPath, appContent);

    // Generate user controller
    const controllerPath = path.join(projectPath, `/controllers/user.controller.${answers.language === 'TypeScript' ? 'ts' : 'js'}`);
    const controllerContent = generateUserController(answers.language, answers.orm);
    fs.writeFileSync(controllerPath, controllerContent);

    // Generate auth router
    const authRouterPath = path.join(projectPath, `/routes/auth.${answers.language === 'TypeScript' ? 'ts' : 'js'}`);
    const authRouterContent = generateAuthRouter(answers.language);
    fs.writeFileSync(authRouterPath, authRouterContent);

    // Generate package.json
    const packageJsonPath = path.join(projectPath, '/package.json');
    const packageJsonContent = generatePackageJson(answers.projectName, answers.language, answers.orm);
    fs.writeFileSync(packageJsonPath, packageJsonContent);

    // Generate .env file
    const envPath = path.join(projectPath, '/.env');
    const envContent = generateEnv();
    fs.writeFileSync(envPath, envContent);

    // Initialize git repository if requested
    if (answers.initGit) {
        require('child_process').execSync('git init', { cwd: projectPath });
    }

    require('child_process').execSync('npm install husky --save-dev', { cwd: projectPath });
    require('child_process').execSync('npx husky init', { cwd: projectPath });
    const huskyDir = path.join(projectPath, '.husky');
    const preCommitPath = path.join(huskyDir, 'pre-commit');
    fs.writeFileSync(preCommitPath, '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\nnpm run lint\n', 'utf-8');
    
    // Make the pre-commit hook executable
    fs.chmodSync(preCommitPath, '755');
    // require('child_process').execSync('npx husky add .husky/pre-commit "npm run lint"', { cwd: projectPath });
    console.log('Husky has been initialized and a pre-commit hook has been added.');

    require('child_process').execSync('npx npm-check-updates -u', { cwd: projectPath });

    console.log(chalk.greenBright(`Project ${answers.projectName} setup complete.`));
    console.log(chalk.greenBright(`Language: ${answers.language}`));
    console.log(chalk.greenBright(`ORM selected: ${answers.orm}`));
    console.log(chalk.greenBright(`Git repository initialized: ${answers.initGit}`));
    if (answers.orm === 'Prisma' && answers.database === 'SQLite') {
        console.log('Follow the following instructions:');
        console.log(chalk.greenBright('RUN npm install'));
        console.log(chalk.greenBright('ADD the database file path and JWT_SECRET in the .env file in the root directory'));
        console.log(chalk.greenBright('RUN prisma migrate'));
        console.log(chalk.greenBright('RUN prisma generate'));
    }
});
