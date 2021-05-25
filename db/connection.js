const env = process.env.NODE_ENV || "development";
const knex = require("../../knexfile")[env];
const knex = require("knex")(config);

module.exports = knex; 