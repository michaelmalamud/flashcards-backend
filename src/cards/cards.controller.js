const cardsService = require("./cards.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const hasProperties = require("../errors/hasProperties");
const cards = require("../db/fixtures/cards");

const hasRequiredProperties = hasProperties("front", "back", "deck_id");

const VALID_PROPERTIES = ["front", "back", "deck_id"]

async function cardExists(req, res, next) {
    const { cardId } = req.params; 
    const card = await cardsService.read(cardId);
    if (!card) {
        return next ({
            status: 404,
            message: `Card with id ${cardId} does not exist`
        })
    }
    res.locals.card = card;
    next();
}

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

async function read (req, res) {
    res.json(await cardsService.read(res.locals.card.id))
}
async function destroy (req, res) {
    await cardsService.destroy(res.locals.card.id);
    res.sendStatus(204);
}
async function create(req, res) {
    res.status(201).json(await cardsService.create(req.body.data))
}

async function list(req, res) {
    res.json(await cardsService.list(req.query.deckId))
}
module.exports = { list: asyncErrorBoundary(list),
                   read: [cardExists, asyncErrorBoundary(read)],
                   create: [hasRequiredProperties, hasOnlyValidProperties, create],
                   delete: [asyncErrorBoundary(cardExists), asyncErrorBoundary(destroy)]
                  }