const jwt = require('jsonwebtoken');
const db = require('../db');
const _ = require('lodash');

// customer auth middleware
const protect = async (req, res, next) => {
    // check req for token and if token is valid, get user
    const user_id = getUserIdFromToken(req);
    req.user = await getUser(user_id);
    next();
};
const protect_customer = async (req, res, next) => {
    // check req for token and if token is valid, get user
    const user_id = getUserIdFromToken(req);
    // check if user is a customer
    const is_customer = await db.query(
        'SELECT * FROM customer WHERE user_id = $1',
        [user_id]
    );
    if (is_customer.rows[0]) {
        req.user = await getUser(user_id);
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized, not a customer');
    }
};
// service provider auth middleware
const protect_service_provider = async (req, res, next) => {
    const user_id = getUserIdFromToken(req);
    // check if user is a service provider
    const is_service_provider = await db.query(
        'SELECT * FROM service_provider WHERE user_id = $1',
        [user_id]
    );
    if (is_service_provider.rows[0]) {
        req.user = await getUser(user_id);
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized, not a service provider');
    }
};
// admin auth middleware
const protect_admin = async (req, res, next) => {
    const user_id = getUserIdFromToken(req);
    // check if user is an admin
    const is_admin = await db.query(
        'SELECT * FROM admin JOIN users ON users.id = admin.user_id WHERE users.id = $1',
        [user_id]
    );
    if (is_admin.rows[0]) {
        req.user = is_admin.rows[0];
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized, not a service provider');
    }
};

// check req for token and if token is valid, get user
const getUserIdFromToken = (req) => {
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

            // Get user_id from the token
            return decoded.user_id;
        } catch (error) {
            throw new Error('Not authorized, Authorization token is invalid');
        }
    } else {
        throw new Error('Not authorized, Authorization token is missing');
    }
};
// get customer or service provider from user_id
const getUser = async (user_id) => {
    // check if user is a service provider
    const result = await db.query(
        'SELECT * FROM service_provider JOIN users ON users.id = service_provider.user_id WHERE users.id = $1',
        [user_id]
    );
    if (result.rows[0]) {
        return _.pick(result.rows[0], [
            'id',
            'service_title',
            'description',
            'first_name',
            'last_name',
            'email',
            'location',
            'category',
            'telephone_number',
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

module.exports = {
    protect,
    protect_admin,
    protect_service_provider,
    protect_customer,
};
