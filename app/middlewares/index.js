const authJwt = require("./authJwt");
const verificaSignUp = require("./verificaSignUp");
const validaEmail = require("./validaEmail");
const bloqueioLogin = require("./bloqueioLogin");

module.exports = {
  authJwt,
  verificaSignUp,
  validaEmail,
  bloqueioLogin
};