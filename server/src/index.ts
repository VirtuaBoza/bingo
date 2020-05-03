require('dotenv').config();
import express from 'express';
import hasuraProxy from './hasuraProxy';
import router from './router';
const app = express();

app.use('/graphql', hasuraProxy);
app.use('/api', router);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
