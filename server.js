const express = require('express');
require('express-async-errors');
require('dotenv').config();
const cors = require('cors');

const { errorHandler } = require('./middleware/errorMiddleware');
// initialize express app
const app = express();
app.use(cors());
app.use(express.static('public'));
// define the port
const port = process.env.PORT || 3001;
// json parser
app.use(express.json());
// initialize routes
app.use('/api/v1/users', require('./routes/usersRoutes'));
app.use('/api/v1/events', require('./routes/eventRoutes'));
app.use('/api/v1/requirements', require('./routes/requirementRoutes'));
app.use('/api/v1/service_providers', require('./routes/serviceProviderRoutes'));
app.use('/api/v1/customers', require('./routes/customerRoutes'));
app.use('/api/v1/category', require('./routes/categoryRoutes'));
app.use('/api/v1/upload', require('./routes/uploadRoutes'));

// override default error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});
