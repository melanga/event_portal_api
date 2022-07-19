const db = require('../db');

// @desc    GET service_providers events
// @route   GET /api/v1/service_providers/:id/events
// @access  Protected
const getServiceProviderEvents = async (req, res) => {
    try {
        // join service_provider_event table with event table
        const result = await db.query(
            'SELECT * FROM event INNER JOIN service_provider_event ON event.id = service_provider_event.event_id WHERE service_provider_event.service_provider_id = $1',
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
