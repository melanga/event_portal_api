const db = require('../db');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');
const _ = require('lodash');
const User = require('../models/userModel');

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

    // @desc    GET all customers
    // @route   GET /api/v1/users/customers/
    // @access  Protected
    static async getCustomers(req, res) {
        try {
            // get all customers
            const results = await db.query(
                'SELECT * FROM customer JOIN users ON customer.user_id = users.id'
            );
            const customers = results.rows;
            res.status(200).json({
                status: 'success',
                results: customers.length,
                data: customers,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    GET all service providers
    // @route   GET /api/v1/users/service_providers/
    // @access  Protected
    static async getServiceProviders(req, res) {
        try {
            // get all customers
            const results = await db.query(
                'SELECT * FROM service_provider JOIN users ON service_provider.user_id = users.id'
            );
            const service_providers = results.rows;
            res.status(200).json({
                status: 'success',
                results: service_providers.length,
                data: service_providers,
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
        const { error } = User.validate(
            _.omit(req.body, ['service_title', 'description', 'is_customer']),
            {
                abortEarly: false,
            }
        );
        if (!error) {
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
                    await db.query(
                        'INSERT INTO customer (user_id) VALUES ($1) RETURNING *',
                        [results.rows[0].id]
                    );
                } else {
                    await db.query(
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
        } else {
            res.status(400);
            throw error;
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
            throw new Error('user does not exist');
        }

        const user = result.rows[0];
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwtGenerator(user.id);
            res.status(201).json({
                status: 'success',
                data: _.omit(user, ['password', 'created_at', 'updated_at']),
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
        res.status(200).json({ status: 'success', data: req.user });
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
                await db.query(
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

    // @desc    DELETE user
    // @route   DELETE /api/v1/user/:id
    // @access  Private
    static async deleteUser(req, res) {
        try {
            // delete user
            const results = await db.query(
                'DELETE FROM users WHERE id = $1 RETURNING *',
                [req.params.id]
            );
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
