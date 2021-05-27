const knex = require("../db/connection");

function destroy(deckId) {
    return knex("decks as d")
    .where({ id: deckId })
    .del();
}
function listDecks(){
    return knex("decks as d")
    .select("*");
}

function listCards() {
    return knex("cards as c")
    .select("*")
}

module.exports = { listDecks, listCards, destroy }