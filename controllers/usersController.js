const db = require('../db')
const bcrypt = require('bcryptjs');

// @desc    GET all users
// @route   GET /api/v1/users/
// @access  Protected
const getUsers = async (req, res) => {
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
};

// @desc    CREATE user
// @route   POST /api/v1/user/
// @access  Public
const createUser = async (req, res) => {
    const { first_name, last_name, email, password, telephone_number, location } = req.body;

    // check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rows[0]) {
        res.status(400);
        throw new Error("user exists");
    }

    try {
        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const results = await db.query(
            'INSERT INTO users (first_name, last_name, email, password, telephone_number, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [first_name, last_name, email, hashedPassword, telephone_number, location]
        );
        res.status(201).json({
            status: 'success',
            data: results.rows[0],
        });
    } catch (e) {
        res.status(400)
        throw new Error(e);
    }
};

// @desc    Authenticate and Login a User
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // check if user exists
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (!result.rows[0]) {
        res.status(400);
        throw new Error("test user");
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
};

module.exports = {getUsers, createUser, loginUser};