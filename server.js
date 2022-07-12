const express = require('express');
require('express-async-errors');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorMiddleware');
// initialize express app
const app = express();
// define the port
const port = process.env.PORT || 3001;

app.use(express.json());
// initialize routes
app.use('/api/v1/users', require('./routes/usersRoutes'));
app.use('/api/v1/events', require('./routes/eventRoutes'));

// override default error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});
