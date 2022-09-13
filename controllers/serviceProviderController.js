const db = require('../db');
const _ = require('lodash');

// @desc    GET service_provider details
// @route   GET /api/v1/service_providers/:id
// @access  Private
const getServiceProvider = async (req, res) => {
    try {
        // join service_provider_event table with event table
        const result = await db.query(
            'SELECT * FROM service_provider sp JOIN users u ON sp.user_id = u.id WHERE sp.user_id = $1',
            [req.params.id]
        );
        const events = _.omit(result.rows[0], [
            'created_at',
            'updated_at',
            'password',
            'id',
        ]);

        res.status(200).json({
            status: 'success',
            data: events,
        });
    } catch (e) {
        res.status(400);
        throw new Error(e);
    }
};

// @desc    GET service_providers events
// @route   GET /api/v1/service_providers/:id/events
// @access  Protected
const getServiceProviderEvents = async (req, res) => {
    try {
        // join service_provider_event table with event table
        const result = await db.query(
            'SELECT * FROM event e INNER JOIN service_provider_event spe ON e.id = spe.event_id JOIN users u ON u.id = e.customer_id WHERE spe.service_provider_id = $1',
            [req.params.id]
        );
        const events = result.rows.map((sp) =>
            _.omit(sp, [
                'created_at',
                'updated_at',
                'password',
                'category',
                'id',
                'telephone_number',
            ])
        );
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
                'id',
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
        // join service_provider and users and filter by location and category
        const result = await db.query(
            'SELECT * FROM service_provider sp JOIN users u on sp.user_id = u.id WHERE u.location = $1 OR sp.category = $2',
            [location, category]
        );

        const service_providers = result.rows.map((sp) =>
            _.pick(sp, [
                'id',
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
                'id',
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

// @desc    GET service provider bids
// @route   GET /api/v1/service_provider/:id/bids
// @access  Private
const getServiceProviderBids = async (req, res) => {
    const { location, category } = req.body;
    try {
        const results = await db.query(
            'SELECT r.id, r.title, r.description, r.event_id, e.name, e.customer_id, u.first_name, u.last_name FROM requirement r JOIN event e on r.event_id = e.id JOIN users u on e.customer_id = u.id WHERE e.location = $1 OR u.location=$1 AND e.category = $2',
            [location, category]
        );
        const bids = results.rows.map((sp) =>
            _.omit(sp, [
                'created_at',
                'updated_at',
                'password',
                'email',
                'telephone_number',
            ])
        );
        res.status(200).json({
            status: 'success',
            results: bids.length,
            data: bids,
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
    getServiceProviderBids,
    getServiceProvider,
};
