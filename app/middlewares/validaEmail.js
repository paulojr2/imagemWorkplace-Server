const db = require("../models");
const User = db.user;
const Token = db.token;

module.exports.valida = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Link Inválido");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("Link Inválido");

    await User.updateOne({ _id: user._id, status: "ativo" });
    await Token.findByIdAndRemove(token._id);

    res.writeHead(301, { Location: process.env.CLIENT_URL });
    res.end();
    return;

  } catch (error) {
    res.status(400).send("Um Erro Ocorreu");
  }

};

