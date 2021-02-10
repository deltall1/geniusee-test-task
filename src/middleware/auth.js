const {validateToken} = require("../services/cognito");

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === '') {
        req.user = null;
        return next();
    }

    try {
        const payload = await validateToken(token);

        if (!payload) {
            req.user = null;
            return next();
        }
        req.user = {
            id: payload.sub,
            email: payload.email,
        }
        next();
    } catch (err) {
        req.user = null;
        return next();
    }
}