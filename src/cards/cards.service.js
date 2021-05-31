const knex = require("../db/connection");

function read(cardId) {
    return knex("cards")
    .where({id: cardId})
    .first();
}
function destroy(cardId) {
    return knex("cards")
    .where({id: cardId})
    .del();
}
function create(card) {
    return knex("cards")
    .insert(card)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}
function list(deckId) {
    return knex("cards")
    .where({deck_id: deckId})
    .select("*");
}

module.exports= { list, create, destroy, read }