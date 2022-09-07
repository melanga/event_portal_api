const express = require('express');
const db = require('../db');
const _ = require('lodash');

const router = express.Router();
// get all categories
router.route('/').get(async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM category');
        const categories = results.rows.map((sp) =>
            _.pick(sp, ['name', 'icon_url'])
        );
        res.status(200).json({
            status: 'success',
            results: categories.length,
            data: categories,
        });
    } catch (e) {
        res.status(400);
        throw new Error(e);
    }
});

module.exports = router;
