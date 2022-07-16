const db = require('../db');

// @desc    GET service_providers events
// @route   GET /api/v1/service_providers/:id/events
// @access  Protected
const getServiceProviderEvents = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM service_provider_event WHERE service_provider_id = $1',
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
    getServiceProviderEvents,
};
