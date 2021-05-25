const env = process.env.NODE_ENV || "development";
const knex = require("../../knexfile")[env];

module.exports = knex; 