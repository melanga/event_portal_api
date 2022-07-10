const db = require('../db');
const bcrypt = require('bcryptjs');

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
                    'INSERT INTO service_provider (user_id, description) VALUES ($1, $2) RETURNING *',
                    [results.rows[0].id, description]
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
            res.status(201).json({
                status: 'success',
                data: user,
            });
        } else {
            res.status(400);
            throw new Error('Invalid password');
        }
    }
}
module.exports = UserController;
