const db = require('../db');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');

class UserController {
    // @desc    GET all users
    // @route   GET /api/v1/users/
    // @access  Protected
    static async getUsers(req, res) {
        try {
            const results = await db.query('SELECT * FROM users');
            const users = results.rows;
            res.status(200).json({
                status: 'success',
                results: users.length,
                data: users,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    CREATE user
    // @route   POST /api/v1/user/
    // @access  Public
    static async createUser(req, res) {
        const {
            first_name,
            last_name,
            email,
            password,
            telephone_number,
            location,
            is_customer,
            service_title,
            description,
        } = req.body;

        // check if user exists
        const userExists = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows[0]) {
            res.status(400);
            throw new Error('user already exists');
        }

        try {
            // Hashing the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const results = await db.query(
                'INSERT INTO users (first_name, last_name, email, password, telephone_number, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                    first_name,
                    last_name,
                    email,
                    hashedPassword,
                    telephone_number,
                    location,
                ]
            );

            if (is_customer) {
                const insert_customer = await db.query(
                    'INSERT INTO customer (user_id) VALUES ($1) RETURNING *',
                    [results.rows[0].id]
                );
            } else {
                const insert_service_provider = await db.query(
                    'INSERT INTO service_provider (user_id,service_title, description) VALUES ($1, $2, $3) RETURNING *',
                    [results.rows[0].id, service_title, description]
                );
            }

            const token = jwtGenerator(results.rows[0].id);
            res.status(201).json({
                status: 'success',
                data: results.rows[0],
                token: token,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    Authenticate and Login a User
    // @route   POST /api/users/login
    // @access  Public
    static async loginUser(req, res) {
        const { email, password } = req.body;

        // check if user exists
        const result = await db.query('SELECT * FROM users WHERE email = $1', [
            email,
        ]);

        if (!result.rows[0]) {
            res.status(400);
            throw new Error('test user');
        }

        const user = result.rows[0];
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwtGenerator(user.id);
            res.status(201).json({
                status: 'success',
                data: user,
                token: token,
            });
        } else {
            res.status(400);
            throw new Error('Invalid password');
        }
    }

    // @desc    Get user data
    // @route   GET /api/v1/users/me
    // @access  Private
    static async getMe(req, res) {
        // if user is a service provider get service provider data
        try {
            const results = await db.query(
                'SELECT * FROM service_provider WHERE user_id = $1',
                [req.user.id]
            );
            const service_provider_data = results.rows[0];
            if (service_provider_data) {
                res.status(200).json({
                    status: 'success',
                    service_provider_data: service_provider_data,
                    user_data: req.user,
                });
            } else {
                res.status(200).json({
                    status: 'success',
                    user_data: req.user,
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    // @desc    UPDATE user
    // @route   PUT /api/v1/user/
    // @access  Private
    static async updateUser(req, res) {
        const {
            first_name,
            last_name,
            email,
            telephone_number,
            location,
            is_customer,
            service_title,
            description,
        } = req.body;

        try {
            // update user details
            const results = await db.query(
                'UPDATE users SET first_name = $1, last_name = $2, email=$3, telephone_number=$4, updated_at=now(), location=$5 WHERE id=$6 RETURNING *',
                [
                    first_name,
                    last_name,
                    email,
                    telephone_number,
                    location,
                    req.user.id,
                ]
            );

            if (!is_customer) {
                // update service provider description & service title
                const insert_service_provider = await db.query(
                    'UPDATE service_provider SET description = $1,service_title=$2 WHERE user_id=$3 RETURNING *',
                    [description, service_title, req.user.id]
                );
            }

            res.status(201).json({
                status: 'success',
                data: results.rows[0],
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }
}
module.exports = UserController;
