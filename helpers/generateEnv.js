const generateEnv = () => {
    return `# Server configuration
PORT=8080
JWT_SECRET="your_jwt_secret_here"
DATABASE_URL="your_prisma_database_url"

`;
};

module.exports = {
    generateEnv
};
