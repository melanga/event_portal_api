const jwt = require('jsonwebtoken');
const db = require('../db');
const _ = require('lodash');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Get user from the token
            const result = await db.query('SELECT * FROM users WHERE id = $1', [
                decoded.user_id,
            ]);

            req.user = _.pick(result.rows[0], [
                'id',
                'first_name',
                'last_name',
                'email',
                'location',
            ]);
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};

module.exports = protect;
