const decksService = require("./decks.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function deckExists(req, res, next) {
    const { deckId } = req.params;
    res.locals.deckId = deckId;
    if (res.locals.deckId) {
        return next();
    }
    next({
        status: 404,
        message: `Deck with id ${res.locals.deckId} does not exist.`
    })
}

async function destroy (req, res) {
    await decksService.destroy(res.locals.deckId);
    res.sendStatus(204);
}
async function list(req, res) {
    if (req.query._embed === "cards") {
    let decks = await decksService.listDecks();
    let cards = await decksService.listCards();
    const mapped = decks.map((deck) => ({ ...deck, cards: cards.filter((card) => card.deck_id === deck.id) }))
    res.json({data: mapped})
    }
}
module.exports = {
    list: asyncErrorBoundary(list),
    delete: [asyncErrorBoundary(deckExists), asyncErrorBoundary(destroy)]
}