const decksService = require("./decks.service");

const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties("name", "description");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const reduceProperties = require("../utils/reduceProperties");

const VALID_PROPERTIES = ["name", "description", "cards"]

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
    const deck = await decksService.read(deckId);
    if (deck) {
        res.locals.deck = deck;
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

async function update (req, res) {
    if (req.query._embed === "cards") {
    let cards = await decksService.listCards();
    const deckCards = cards.filter((card) => card.deck_id === res.locals.deckId)
    const deckUpdate = {...req.body.data, id: res.locals.deck.id, cards: deckCards}
    const updated = await decksService.update(deckUpdate);
    console.log(updated);
    res.json()
    }
}

async function list(req, res) {
    if (req.query._embed === "cards") {
    let decks = await decksService.listDecksWithCards();
    const reduceDecks = reduceProperties("id", {
        deck_id: ["cards", null, "deck_id"],
        front: ["cards", null, "front"],
        back: ["cards", null, "back"]
    })
    // decks.map((deck) => {...deck, cards: }
    // let cards = await decksService.listCards();
    //const mapped = decks.map((deck) => ({ ...deck, cards: cards.filter((card) => card.deck_id === deck.id) }))
    res.json({data: reduceDecks(decks)})
    }
    else {
        res.json({data: await decksService.listDecks()});
    }
}

async function read(req, res) {
    if (req.query._embed === "cards") {
    let { deck: data } = res.locals;
    res.json({data})
    }
}
module.exports = {
    list: asyncErrorBoundary(list),
    delete: [asyncErrorBoundary(deckExists), asyncErrorBoundary(destroy)],
    read: [asyncErrorBoundary(deckExists), asyncErrorBoundary(read)],
    update: [hasOnlyValidProperties, asyncErrorBoundary(deckExists), asyncErrorBoundary(update)],
    create: [hasRequiredProperties, hasOnlyValidProperties, asyncErrorBoundary(create)],
}