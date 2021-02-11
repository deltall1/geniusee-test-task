import * as jwt from 'jsonwebtoken';

export const authMiddleware = (event) => {
    const authHeader = event.headers.Authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        return null;
    }

    try {
        const user = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
        return {user}
    } catch (err) {
        return null
    }
}
