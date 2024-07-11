const generateAuthRouter = (language) => {
    const imports = language === 'TypeScript'
        ? `import { Router } from 'express';\nimport { signup, login } from './../controllers/user.controller';`
        : `const { Router } = require('express');\nconst { signup, login } = require('./../controllers/user.controller');`;
    return `${imports}

const router = Router();

// Routes for user signup and login
router.post('/signup', signup);
router.post('/login', login);

${language === 'JavaScript' ? 'module.exports = router;' : 'export default router;'}
`;
};

module.exports = {
    generateAuthRouter
};
