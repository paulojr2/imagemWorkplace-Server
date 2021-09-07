const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userBlockSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  tentativas: {
      type: Number,
      default: 0,
  },
  bloqueado: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserBlock = mongoose.model("userblock", userBlockSchema);

module.exports = UserBlock;