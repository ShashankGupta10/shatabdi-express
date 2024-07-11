const authMiddleware = async (req, res, next) => {
    const jwt_token = req.headers.authorization.split(" ")[1]
    console.log(jwt_token);
}

module.exports = {
    authMiddleware
}