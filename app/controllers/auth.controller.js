const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Email = require("../utils/email");
const Token = require("../models/token.model")
const ResetaSenha = require("../models/resetaSenha.model")

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

  var user = new User();

  try {
    user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      tipo: req.body.tipo,
      documento: req.body.documento,
      nome: req.body.nome,
      endereco: req.body.endereco
    });
  }
  catch (error) {
    return res.status(500).send({ message: "Não Foi Possível Realizar o Cadastro." });
  };

  user.save(async (err, user) => {

    if (err) return res.status(500).send({ message: "Não Foi Possível Realizar o Cadastro." });
    if (user) {

      res.send({ message: "Usuário Registrado com Sucesso!\n Foi Enviado um Email Para Validação." });

      let token = await new Token({
        userId: user._id,
        token: require("crypto").randomBytes(32).toString("hex"),
      }).save();

      const link = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
      const message = `Segue link para validação de email. \n ${link}`
      await Email(user.email, "Validação de Email - Imagem WorkPlace", message);
      return;
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec((err, user) => {
      if (err) returnres.status(500).send({ message: err });
      if (!user) return res.status(404).send({ message: "Usuário não encontrado." });
      if (user.status == "pendente") return res.status(401).send({ message: "Email não Validado." });

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(403).send({ accessToken: null, message: "Senha Inválida!" });

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      return res.status(200).send({
        id: user._id,
        email: user.email,
        accessToken: token
      });
    });
};

exports.esqueciSenha = async (req, res) => {
  User.findOne({ email: req.body.email })
    .exec(async (err, user) => {
      if (err) return res.status(500).send({ message: err });
      if (!user) return res.status(404).send({ message: "Usuário não encontrado." });
      if (user.status == "pendente") return res.status(401).send({ message: "Email não Validado." });

      const valCodigo = Math.random().toString(36).slice(-8);
      const message = `${process.env.BASE_URL}/reseta-senha/${user.id}/ \n Código de Validação ${valCodigo}`;
      await Email(user.email, "Verify Email", message);
      await new ResetaSenha({ userId: user.id, valCodigo: valCodigo, bloqueioHora: Date.now() }).save();

      return res.status(200).send({ message: "Email Enviado." })

    });

};

exports.validaCodigoSenha = async (req, res) => {
  ResetaSenha.findOne({ userId: req.body.id })
    .exec(async (err, user) => {
      if (err) return res.status(500).send({ message: err });
      if (!user) return res.status(404).send({ message: "Usuário não encontrado." });
      if (user.valCodigo == req.body.valCodigo) return res.status(200).send({ message: "Código Validado" });
    });

};
