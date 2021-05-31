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

function update(updatedDeck) {
    return knex("decks as d")
    .where({ id: updatedDeck.id })
    .update(updatedDeck, "*");
}
function listDecks(){
    return knex("decks as d")
    .select("*");
}

function listDecksWithCards() {
    return knex("cards as c")
    .join("decks as d", "c.deck_id", "d.id")
    .select("*");
}

module.exports = { listDecks, listDecksWithCards, destroy, create, update, read }