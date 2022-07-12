const db = require('../db');

class EventController {
    // @desc    GET all events
    // @route   GET /api/v1/events/
    // @access  Protected
    static async getEvents(req, res) {
        try {
            const results = await db.query('SELECT * FROM event');
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
}

module.exports = EventController;
