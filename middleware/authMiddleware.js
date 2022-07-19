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
            req.user = await getUser(decoded.user_id);

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

const protect_admin = async (req, res, next) => {
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
            const result = await db.query(
                'SELECT * FROM admin JOIN users ON users.id = admin.user_id WHERE user_id = $1',
                [decoded.user_id]
            );
            // if admin is found let continue
            if (result.rows[0]) {
                req.user = result.rows[0];
                next();
            } else {
                res.status(401);
                throw new Error('Not authorized');
            }
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not admin authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};

const getUser = async (user_id) => {
    const is_service_provider = await db.query(
        'SELECT * FROM service_provider WHERE user_id = $1',
        [user_id]
    );
    if (is_service_provider.rows[0]) {
        // join service_provider and users
        const result = await db.query(
            'SELECT * FROM service_provider JOIN users ON users.id = service_provider.user_id WHERE users.id = $1',
            [user_id]
        );
        return _.pick(result.rows[0], [
            'id',
            'service_title',
            'description',
            'first_name',
            'last_name',
            'email',
            'location',
        ]);
    } else {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [
            user_id,
        ]);
        return _.pick(result.rows[0], [
            'id',
            'first_name',
            'last_name',
            'email',
            'location',
        ]);
    }
};
module.exports = { protect, protect_admin };
