const generatePrismaSchema = (database) => {
    let provider;
    let modelIdField;
    switch (database) {
        case 'SQLite':
            provider = 'sqlite';
            modelIdField = 'id    Int     @id @default(autoincrement())';
            break;
        case 'MySQL':
            provider = 'mysql';
            modelIdField = 'id    Int     @id @default(autoincrement())';
            break;
        case 'Postgres':
            provider = 'postgresql';
            modelIdField = 'id    Int     @id @default(autoincrement())';
            break;
        default:
            throw new Error('Unsupported database type');
    }

    return `
        // schema.prisma

        generator client {
            provider = "prisma-client-js"
        }

        datasource db {
            provider = "${provider}"
            url      = env("DATABASE_URL")
        }

        // Example model
        model User {
            ${modelIdField}
            email       String  @unique
            name        String
            password    String
        }
    `;
}

module.exports = {
    generatePrismaSchema
}