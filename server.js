const express = require('express');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});
