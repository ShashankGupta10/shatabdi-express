const generatePackageJson = (projectName, language, orm) => {
    const dependencies = {
        "express": "^4.17.1",
        "bcrypt": "^5.0.1",
        "jsonwebtoken": "^8.5.1",
        "dotenv": "16.4.5"
    };

    if (orm === 'Prisma') {
        dependencies["@prisma/client"] = "5.13.0";
    } else if (orm === 'Mongoose') {
        dependencies["mongoose"] = "8.4.0";
    }

    const devDependencies = {
        "nodemon": "^2.0.7"
    };

    if (language === 'TypeScript') {
        devDependencies["typescript"] = "^4.3.5";
        devDependencies["@types/express"] = "^4.17.11";
        devDependencies["@types/bcrypt"] = "5.0.2";
        devDependencies["@types/jsonwebtoken"] = "9.0.6";
        devDependencies["@types/node"] = "^14.14.31";
        devDependencies["ts-node"] = "^10.0.0";
        devDependencies["ts-node-dev"] = "^1.1.8";
        if (orm === 'Prisma') {
            devDependencies["prisma"] = "5.13.0";
        }
        if (orm === "Mongoose") {
            devDependencies["@types/mongoose"] = "^0.0.0"
        }
    }

    const packageJson = {
        name: projectName,
        version: "1.0.0",
        main: `app.${language === 'TypeScript' ? 'ts' : 'js'}`,
        scripts: {
            start: "node app.js",
            dev: "nodemon app.js"
        },
        dependencies,
        devDependencies
    };

    if (language === 'TypeScript') {
        packageJson.scripts.build = "tsc";
        packageJson.scripts.start = "ts-node app.ts";
        packageJson.scripts.dev = "tsc -b && nodemon dist/app.js";
    }

    return JSON.stringify(packageJson, null, 2);
}

module.exports = {
    generatePackageJson
}
