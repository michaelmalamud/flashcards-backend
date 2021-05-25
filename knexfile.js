require("dotenv").config();
const { DATABASE_URL } = process.env;

module.exports = {

  development: {
    client: 'postgres',
    connection: DATABASE_URL,
  },
};
