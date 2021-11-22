// Update with your config settings.
require("dotenv").config();

module.exports = {

  development: {
    client: "mysql",
    connection: {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      password:process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds'
    }
  },

  staging: {
    
  },

  production: {
    
  }

};