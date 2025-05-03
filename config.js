require("dotenv").config();

const dbURI = process.env.MONGO_URI || 'mongodb://localhost/db';

module.exports = {
    dbURI
}
