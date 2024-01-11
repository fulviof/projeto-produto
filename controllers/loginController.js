const UsuarioModel = require("../models/usuarioModel")


class LoginController {

    indexView(req, res){
        res.render('login/index', {layout: 'login/index'})
    }

    logout(req, res) {
        res.clearCookie("usuarioLogado");
        res.redirect("/login");
    }

    async autenticar(req, res){
        if(req.body.email != undefined && req.body.senha != undefined){
            let usuario = new UsuarioModel();
            usuario = await usuario.autenticarUsuario(req.body.email, req.body.senha);
            if(usuario != null){
                res.cookie("usuarioLogado", usuario.usuId);
                res.send({status: true, msg: "Autenticação realizada com sucesso"})
            }
            else{
                res.send({status: false, msg: "Credenciais inválidas"})
            }
        }
        else{
            res.send({status: false, msg: "Credenciais inválidas"})
        }
    }

}

module.exports = LoginController