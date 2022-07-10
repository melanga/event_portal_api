const jwt = require('jsonwebtoken');

const jwtGenerator = (user_id) => {
    return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d',
    });
};

module.exports = jwtGenerator;
