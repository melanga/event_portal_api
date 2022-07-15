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
}

module.exports = RequirementController;
