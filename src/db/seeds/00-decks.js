const decks = require("../fixtures/decks");

exports.seed = function(knex) {
      return knex
      .raw("TRUNCATE TABLE decks RESTART IDENTITY CASCADE")
      .then(function() {
        return knex("decks").insert(decks);
      })
}
