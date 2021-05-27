const decksService = require("./decks.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    if (req.query._embed === "cards") {
    let decks = await decksService.listDecks();
    let cards = await decksService.listCards();
    const mapped = decks.map((deck) => ({ ...deck, cards: cards.filter((card) => card.deck_id === deck.id) }))
    res.json({data: mapped})
    }
}
module.exports = {
    list: asyncErrorBoundary(list)
}