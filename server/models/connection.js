const mongoose = require('mongoose');

function connect() {
  mongoose.Promise = global.Promise;

  const options = {
    useNewUrlParser: true,
  };

  mongoose
    .connect(
      process.env.DB_URI,
      options,
    )
    .then(() => console.log('Connected to Database.'))
    .catch(error => console.error(`DB Connection error: ${error.message}`));

  return mongoose.connection;
}

module.exports = connect;
