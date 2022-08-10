const db = require('../db');

class RequirementController {
    // @desc    GET requirements
    // @route   GET /api/v1/requirements
    // @access  Protected
    static async getRequirements(req, res) {
        const { event_id } = req.body;

        try {
            const results = await db.query(
                'SELECT * FROM requirement WHERE event_id = $1',
                [event_id]
            );
            const requirements = results.rows[0];
            res.status(200).json({
                status: 'success',
                results: requirements.length,
                data: requirements,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    CREATE requirements
    // @route   POST /api/v1/requirements
    // @access  Protected
    static async createRequirement(req, res) {
        const { title, description, event_id, category } = req.body;

        try {
            const results = await db.query(
                'INSERT INTO requirement (title, description, event_id, category) VALUES ($1, $2, $3, $4) RETURNING *',
                [title, description, event_id, category]
            );
            const requirement = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: requirement,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    UPDATE requirements
    // @route   PUT /api/v1/requirements/:id
    // @access  Protected
    // TODO implement cannot update after bidding is done
    static async updateRequirement(req, res) {
        const { title, description, category } = req.body;

        try {
            const results = await db.query(
                'UPDATE requirement SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING *',
                [title, description, category, req.params.id]
            );
            const requirement = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: requirement,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    DELETE requirements
    // @route   DELETE /api/v1/requirements/:id
    // @access  Protected
    static async deleteRequirement(req, res) {
        try {
            const results = await db.query(
                'DELETE FROM requirement WHERE id = $1 RETURNING *',
                [req.params.id]
            );
            const deleted_requirement = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: deleted_requirement,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    GET event requirements bidding
    // @route   GET /api/v1/requirements/:id/bidding
    // @access  Protected_Customer
    static async getEventRequirementBidding(req, res) {
        try {
            const results = await db.query(
                'SELECT * FROM requirement INNER JOIN requirement_bidding ON requirement.id = requirement_bidding.requirement_id WHERE requirement.event_id = $1',
                [req.params.id]
            );
            const requirements = results.rows;
            res.status(200).json({
                status: 'success',
                results: requirements.length,
                data: requirements,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    CREATE event requirements bidding
    // @route   POST /api/v1/requirements/:id/bidding
    // @access  Protected_ServiceProvider
    static async createEventRequirementBidding(req, res) {
        const { requirement_id, service_provider_id, price } = req.body;

        try {
            const results = await db.query(
                'INSERT INTO requirement_bidding (requirement_id, service_provider_id, price) VALUES ($1, $2, $3) RETURNING *',
                [requirement_id, service_provider_id, price]
            );
            const requirement_bidding = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: requirement_bidding,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }
    // @desc    UPDATE event requirements bidding
    // @route   PUT /api/v1/requirements/:id/bidding
    // @access  Protected_ServiceProvider
    static async updateEventRequirementBidding(req, res) {
        const { price } = req.body;

        try {
            const results = await db.query(
                'UPDATE requirement_bidding SET price = $1 WHERE id = $2 RETURNING *',
                [price, req.params.id]
            );
            const requirement_bidding = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: requirement_bidding,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }

    // @desc    DELETE event requirements bidding
    // @route   DELETE /api/v1/requirements/:id/bidding
    // @access  Protected_ServiceProvider
    static async deleteEventRequirementBidding(req, res) {
        try {
            const results = await db.query(
                'DELETE FROM requirement_bidding WHERE id = $1 RETURNING *',
                [req.params.id]
            );
            const deleted_requirement_bidding = results.rows[0];
            res.status(200).json({
                status: 'success',
                data: deleted_requirement_bidding,
            });
        } catch (e) {
            res.status(400);
            throw new Error(e);
        }
    }
}

module.exports = RequirementController;
