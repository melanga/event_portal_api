const db = require('../db');
const { Client } = require('@googlemaps/google-maps-services-js');

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

const getMapDetails = async (req, res) => {
    const client = new Client({});

    client
        .elevation({
            params: {
                locations: [{ lat: 45, lng: -110 }],
                key: 'AIzaSyASHXReGmFGVi14z1C-Se9vjLc7pqlTAcw',
            },
            timeout: 1000, // milliseconds
        })
        .then((r) => {
            console.log(r.data.results[0].elevation);
            res.status(200).json({
                status: 'success',
                data: r.data.results[0].elevation,
            });
        })
        .catch((e) => {
            console.log(e.response.data.error_message);
            res.status(400).json({
                status: 'fail',
                message: e.response.data.error_message,
            });
        });
};

module.exports = {
    getCustomerEvents,
    getMapDetails,
};
