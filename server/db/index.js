const mongoose = require('mongoose');

function connect() {
  mongoose
    .connect(`mongodb://${process.env.DB_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Connected to mongodb://${process.env.DB_URI}`);
    })
    .catch(err => {
      console.error('Database connection error.', err);
    });
}

class Database {
  constructor() {
    connect();
  }
}

module.exports = new Database();
