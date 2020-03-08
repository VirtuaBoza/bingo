require('dotenv').config();
require('./db');
const morgan = require('morgan');
const app = require('./api');
app.use(morgan('combined'));
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
