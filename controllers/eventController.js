const db = require('../db');
const _ = require('lodash');

class EventController {
    // @desc    GET a user's all events
    // @route   GET /api/v1/events/
    // @access  Protected
    static async getEvents(req, res) {
        const { customer_id } = req.body;

        try {
            const results = await db.query(
                'SELECT * FROM event WHERE customer_id = $1',
                [customer_id]
            );
            const events = results.rows;
            res.status(200).json({
                status: 'success',
                results: events.length,
                data: events,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    GET an event
    // @route   GET /api/v1/events/:id
    // @access  Protected
    static async getAEvent(req, res) {
        try {
            const results = await db.query(
                'SELECT * FROM event WHERE id = $1',
                [req.params.id]
            );
            const event = results.rows[0];
            if (!event) {
                res.status(404).json({
                    status: 'fail',
                    message: 'Event not found',
                });
            } else {
                res.status(200).json({
                    status: 'success',
                    data: event,
                });
            }
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    CREATE an event
    // @route   POST /api/v1/events/
    // @access  Protected
    static async createEvent(req, res) {
        const { name, description, location, date, category, customer_id } =
            req.body;
        if (req.user.id === customer_id) {
            try {
                const results = await db.query(
                    'INSERT INTO event (name, description, location, date, category, customer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [name, description, location, date, category, customer_id]
                );
                const created_event = results.rows[0];
                res.status(200).json({
                    status: 'success',
                    data: created_event,
                });
            } catch (e) {
                res.status(400);
                throw new Error(e);
            }
        } else {
            res.status(400);
            throw new Error('invalid user id from the token');
        }
    }

    // @desc    UPDATE an event
    // @route   PUT /api/v1/events/:id
    // @access  Protected
    static async updateEvent(req, res) {
        const { name, description, location, date, category } = req.body;
        // no need to check for event existence since it is already checked in the frontend
        try {
            const results = await db.query(
                'UPDATE event SET name=$1, description=$2, location=$3, date=$4, category=$5, updated_at=now() WHERE id=$6 RETURNING *',
                [name, description, location, date, category, req.params.id]
            );
            const updated_event = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: updated_event,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    DELETE an event
    // @route   DELETE /api/v1/events/:id
    // @access  Protected
    static async deleteEvent(req, res) {
        try {
            const results = await db.query(
                'DELETE FROM event WHERE id=$1 RETURNING *',
                [req.params.id]
            );
            const deleted_event = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: deleted_event,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    GET event's all service_providers
    // @route   GET /api/v1/events/:id/service_providers
    // @access  Protected
    static async getEventServiceProviders(req, res) {
        try {
            const results = await db.query(
                'SELECT * from users INNER JOIN service_provider_event ON users.id = service_provider_event.service_provider_id WHERE event_id = $1',
                [req.params.id]
            );
            const service_providers = results.rows.map((sp) =>
                _.omit(sp, ['password', 'id', 'created_at', 'updated_at'])
            );
            res.status(200).json({
                status: 'success',
                data: service_providers,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    Add service_provider to an event
    // @route   PUT /api/v1/events/:event_id/service_providers/:service_provider_id
    // @access  Protected
    static async putEventServiceProvider(req, res) {
        const { event_id, service_provider_id } = req.body;
        try {
            const results = await db.query(
                'INSERT INTO service_provider_event (event_id, service_provider_id) VALUES ($1,$2) RETURNING *',
                [event_id, service_provider_id]
            );
            const added_service_provider = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: added_service_provider,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    Delete service_provider from an event
    // @route   DELETE /api/v1/events/:event_id/service_providers/:service_provider_id
    // @access  Protected
    static async deleteEventServiceProvider(req, res) {
        const { event_id, service_provider_id } = req.params;
        try {
            const results = await db.query(
                'DELETE FROM service_provider_event WHERE event_id = $1 AND service_provider_id = $2 RETURNING *',
                [event_id, service_provider_id]
            );
            const deleted_service_provider = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: deleted_service_provider,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    UPDATE c_confirmed of an event
    // @route   PUT /api/v1/events/:event_id/service_providers/:service_provider_id/c_confirmed
    // @access  Protected
    static async updateEventServiceProviderCConfirmed(req, res) {
        const { c_confirmed } = req.body;
        const { event_id, service_provider_id } = req.params;
        try {
            const results = await db.query(
                'UPDATE service_provider_event SET c_confirmed=$1, c_confirmed_at=now() WHERE event_id=$2 AND service_provider_id=$3 RETURNING *',
                [c_confirmed, event_id, service_provider_id]
            );
            const updated_service_provider = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: updated_service_provider,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    UPDATE sp_confirmed of an event
    // @route   PUT /api/v1/events/:event_id/service_providers/:service_provider_id/sp_confirmed
    // @access  Protected
    static async updateEventServiceProviderSPConfirmed(req, res) {
        const { sp_confirmed } = req.body;
        const { event_id, service_provider_id } = req.params;
        try {
            const results = await db.query(
                'UPDATE service_provider_event SET sp_confirmed=$1, sp_confirmed_at=now() WHERE event_id=$2 AND service_provider_id=$3 RETURNING *',
                [sp_confirmed, event_id, service_provider_id]
            );
            const updated_service_provider = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: updated_service_provider,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }
}

module.exports = EventController;
