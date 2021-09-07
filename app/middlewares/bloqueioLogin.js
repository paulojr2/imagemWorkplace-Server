const db = require("../models");
const User = db.user;
const UserBlock = db.userBlock;
var bcrypt = require("bcryptjs");
var tentativasBloqueio = 5;

module.exports.bloqueia = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("Email não cadastrado");

        const bloqueio = await UserBlock.findOne({ userId: user._id })
        if  (bloqueio == null ? undefined : bloqueio.bloqueado) return res.status(401).send( { message: "Usuário Está Bloqueado" })

        if (!bcrypt.compareSync(req.body.password, user.password)) {//Senha Incorreta

            if (!bloqueio) {
                await new UserBlock({
                    userId: user._id,
                    tentativas: 1,
                    bloqueado: false,
                }).save()
            }
            else {
                if (bloqueio.tentativas == tentativasBloqueio - 1) {
                    await bloqueio.updateOne({ tentativas: ++bloqueio.tentativas, bloqueado: true });
                    return res.status(401).send({ message: "Excedeu 5 Tentativas Incorretas.\nUsuário Bloqueado"});
                }
                await bloqueio.updateOne({ tentativas: ++bloqueio.tentativas });
            }
        }

        next();

    } catch (error) {
        console.log(error)
        res.status(400).send("Um Erro Ocorreu");
    }

};

