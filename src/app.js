
const express = require("express");

const errorHandler = require("./errors/errorHandler");

const notFound = require("./errors/notFound");

const decksRouter = require("./decks/decks.router");

const cardsRouter = require("./cards/cards.router");

const app = express();

app.use(express.json());

app.use("/decks", decksRouter)

app.use("/cards", cardsRouter)

app.use(notFound);

app.use(errorHandler);

module.exports = app;