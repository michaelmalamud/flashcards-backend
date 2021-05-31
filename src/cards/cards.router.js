const router = require("express").Router();
const controller = require("./cards.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:cardId").get(controller.read).delete(controller.delete).all(methodNotAllowed);
router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);

module.exports = router;