const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`Connected to mongodb://${process.env.DB_URI}`);
});
