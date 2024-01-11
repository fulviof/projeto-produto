const UsuarioModel = require("../models/usuarioModel");


class Autenticacao {

    async verificaUsuarioLogado(req, res, next) {
        if(req.headers.cookie != undefined && 
            req.headers.cookie.includes('usuarioLogado')) {
                let id = req.cookies.usuarioLogado;
                let usuario = new UsuarioModel();
                usuario = await usuario.obterUsuario(id);
                if(usuario.usuAtivo == 'S'){
                    res.locals.usuarioLogado = usuario;
                    next();
                }
                else
                    res.redirect('/login');
        }
        else{
            res.redirect("/login");
        }
    }

    async verificaUsuarioLogadoAdmin(req, res, next) {
        if(req.headers.cookie != undefined && 
            req.headers.cookie.includes('usuarioLogado')) {
                let id = req.cookies.usuarioLogado;
                let usuario = new UsuarioModel();
                usuario = await usuario.obterUsuario(id);
                if(usuario.usuAtivo == 'S' && usuario.perId == 1){
                    res.locals.usuarioLogado = usuario;
                    next();
                }
                else
                    res.redirect('/login');
        }
        else{
            res.redirect("/login");
        }
    }
}

module.exports = Autenticacao;