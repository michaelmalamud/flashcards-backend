const cardsService = require("./cards.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties("front", "back", "deck_id");

const VALID_PROPERTIES = ["front", "back", "deck_id"]

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

async function create(req, res) {
    res.status(201).json(await cardsService.create(req.body.data))
}

async function list(req, res) {
    res.json(await cardsService.list(req.query.deckId))
}
module.exports = { list: asyncErrorBoundary(list),
                   create: [hasRequiredProperties, hasOnlyValidProperties, create]
                  }