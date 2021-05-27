const knex = require("../db/connection");

function listDecks(){
    return knex("decks as d")
    .select("*");
}

function listCards() {
    return knex("cards as c")
    .select("*")
}

module.exports = { listDecks, listCards }