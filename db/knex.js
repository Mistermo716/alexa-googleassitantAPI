const enviornment = process.env.NODE_ENV || 'developement';
const config = require('../knexfile.js')[enviornment];
module.exports = require('knex')(config);
