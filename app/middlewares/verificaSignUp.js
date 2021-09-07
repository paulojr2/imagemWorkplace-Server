const db = require("../models");
const User = db.user;

verificaEmailDuplicado = (req, res, next) => {

  User.findOne({
    email: req.body.email
  }).exec((err, user) => {

    if (err) return res.status(500).send({ message: err });
    if (user) return res.status(400).send({ message: "Email já existe!" });

    next();
  });
};

const verificaSignUp = {
  verificaEmailDuplicado
};

module.exports = verificaSignUp;