const db = require('../db');
const _ = require('lodash');

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

// @desc    add rating to service provider
// @route   POST /api/v1/service_providers/:id/rating
// @access  Protected
const add_rating = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const result = await db.query(
            'INSERT INTO service_provider_rating (service_provider_id, rating, comment) VALUES ($1, $2, $3) RETURNING *',
            [req.params.id, rating, comment]
        );
        res.status(200).json({
            status: 'success',
            data: result.rows[0],
        });
    } catch (e) {
        res.status(400);
        throw new Error(e);
    }
};

// @desc    GET service providers by search and filters
// @route   GET /api/v1/service_provider/search
// @access  Protected
const getServiceProvidersBySearch = async (req, res) => {
    try {
        const { search } = req.query;
        // const { price, rating } = filters;
        const result = await db.query(
            `SELECT * FROM service_provider sp JOIN users u on sp.user_id = u.id WHERE sp.service_title ILIKE '%${search}%' OR sp.description ILIKE '%${search}%' OR u.location ILIKE '%${search}%'`
        );
        const service_providers = result.rows.map((sp) =>
            _.pick(sp, [
                'service_title',
                'description',
                'location',
                'category',
                'first_name',
                'last_name',
                'telephone_number',
            ])
        );
        res.status(200).json({
            status: 'success',
            results: service_providers.length,
            data: service_providers,
        });
    } catch (e) {
        res.status(400);
        throw new Error(e);
    }
};

// @desc    GET service providers by filters
// @route   GET /api/v1/service_provider/filter
// @access  public
const getServiceProvidersByFilter = async (req, res) => {
    try {
        let { filters } = req.query;
        filters = JSON.parse(filters);
        const { location, category } = filters;
        // const { price, rating } = filters;
        // join service_provider and users and filter
        const result = await db.query(
            `SELECT * FROM service_provider sp JOIN users u on sp.user_id = u.id WHERE u.location LIKE '%${location}%' AND sp.category LIKE '${category}'`
        );
        const service_providers = result.rows.map((sp) =>
            _.pick(sp, [
                'service_title',
                'description',
                'location',
                'category',
                'first_name',
                'last_name',
                'telephone_number',
            ])
        );
        res.status(200).json({
            status: 'success',
            results: service_providers.length,
            data: service_providers,
        });
    } catch (e) {
        res.status(400);
        throw new Error(e);
    }
};

// @desc    GET recent service providers
// @route   GET /api/v1/service_provider/recent
// @access  Public
const getRecentServiceProviders = async (req, res) => {
    try {
        const results = await db.query(
            'SELECT * FROM service_provider JOIN users ON service_provider.user_id = users.id ORDER BY  created_at DESC LIMIT 20'
        );
        const service_providers = results.rows.map((sp) =>
            _.pick(sp, [
                'service_title',
                'description',
                'location',
                'category',
                'first_name',
                'last_name',
                'telephone_number',
            ])
        );
        res.status(200).json({
            status: 'success',
            results: service_providers.length,
            data: service_providers,
        });
    } catch (e) {
        res.status(400);
        throw new Error(e);
    }
};

module.exports = serviceProviderController = {
    getServiceProviderEvents,
    add_rating,
    getServiceProvidersBySearch,
    getRecentServiceProviders,
    getServiceProvidersByFilter,
};
