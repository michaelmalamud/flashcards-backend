const decksService = require("./decks.service");

const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties("name", "description");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = ["name", "description"]

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter(
      (field) => !VALID_PROPERTIES.includes(field)
    );
  
    if (invalidFields.length) {
      return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
      });
    }
    next();
  }

async function deckExists(req, res, next) {
    const { deckId } = req.params;
    res.locals.deckId = deckId;
    const deck = await decksService.read(deckId);
    if (deck) {
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

async function create (req, res) {
    const data = await decksService.create(req.body.data);
    res.status(201).json({data})
}
async function list(req, res) {
    if (req.query._embed === "cards") {
    let decks = await decksService.listDecks();
    let cards = await decksService.listCards();
    const mapped = decks.map((deck) => ({ ...deck, cards: cards.filter((card) => card.deck_id === deck.id) }))
    res.json({data: mapped})
    }
    else {
        res.json({data: await decksService.listDecks()});
    }
}
module.exports = {
    list: asyncErrorBoundary(list),
    delete: [asyncErrorBoundary(deckExists), asyncErrorBoundary(destroy)],
    create: [hasRequiredProperties, asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(create)],
}