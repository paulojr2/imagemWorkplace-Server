const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetaSenhaSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  valCodigo: {
    type: String,
    required: true,
  },
  bloqueioHora: {
    type: Date,
    expires: 600,//Código expira em 1 hora
  }
});

const ResetaSenha = mongoose.model("resetaSenha", resetaSenhaSchema);

module.exports = ResetaSenha;