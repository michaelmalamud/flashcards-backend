const knex = require("../db/connection");

function read(deckId) {
    return knex("decks")
    .where({ id: deckId })
    .first();
}

function destroy(deckId) {
    return knex("decks as d")
    .where({ id: deckId })
    .first()
    .del();
}

function create(deck) {
    return knex("decks")
    .insert(deck)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function listDecks(){
    return knex("decks as d")
    .select("*");
}

function listCards() {
    return knex("cards as c")
    .select("*")
}

module.exports = { listDecks, listCards, destroy, create, read }