require("dotenv").config();

const dbURI = process.env.MONGO_URI || 'mongodb://localhost/db';
const apiUrl = process.env.API_URL || 'http://localhost:3000/api';

module.exports = {
    dbURI,
    apiUrl
}
