const router = require("express").Router();
const controller = require("./decks.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:deckId").delete(controller.delete).all(methodNotAllowed);

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;