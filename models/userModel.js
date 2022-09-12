const Joi = require('joi');

const User = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().min(8).required(),
    password: Joi.string().required(),
    telephone_number: Joi.string().min(10),
    location: Joi.string(),
    category: Joi.string(),
});

// const ServiceProvider = User.keys({
//     service_title: Joi.string().required(),
//     description: Joi.string().required(),
// });

module.exports = User;
