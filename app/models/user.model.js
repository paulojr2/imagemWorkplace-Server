const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: String,
    password: String,
    tipo: String,
    documento: Number,
    nome: String,
    telefone: Number,
    endereco: [],
    status: {
      type: String,
      default: "pendente",
    },
  })
);

module.exports = User;