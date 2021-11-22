const environment = process.env.ENVIRONMENT || 'development'
const config = require('../server/node/knexfile.js')[environment];
const knex = require('knex')(config);

module.exports = knex;