const db = require('../db');

// @desc    GET customer's events
// @route   GET /api/v1/customers/:id/events
// @access  Protected
const getCustomerEvents = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM event WHERE customer_id = $1',
            [req.params.id]
        );
        const events = result.rows;
        res.status(200).json({
            status: 'success',
            results: events.length,
            data: events,
        });
    } catch (e) {
        res.status(400);
        throw new Error(e);
    }
};

module.exports = {
    getCustomerEvents,
};
