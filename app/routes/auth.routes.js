const controller = require("../controllers/auth.controller");
const validaEmail = require("../middlewares/validaEmail");
const verificaSignUp = require("../middlewares/verificaSignUp");
const bloqueioLogin = require("../middlewares/bloqueioLogin")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Cadastro
  app.post("/api/auth/signup", [ verificaSignUp.verificaEmailDuplicado], controller.signup);

  //Login
  app.post("/api/auth/signin", [ bloqueioLogin.bloqueia], controller.signin);

  //Esqueci a senha
  app.post("/api/auth/esqueci-minha-senha", controller.esqueciSenha)

  //Validação Cadastro
  app.get("/user/verify/:id/:token", [validaEmail.valida]);

  //Validação Código Senha
  app.get("/api/auth/validaCodigoSenha/:id", controller.validaCodigoSenha);

};