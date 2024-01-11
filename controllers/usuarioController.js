const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class UsuarioController {


    async listarView(req, res) {
        let usuario = new UsuarioModel();
        let listaUsuarios = await usuario.listarUsuarios();
        res.render('usuario/listar', {lista: listaUsuarios});
    }

    async cadastrarView(req, res) {
        let perfil = new PerfilModel();
        let listaPerfil = await perfil.listarPerfil();
        res.render('usuario/cadastrar', {listaPerfil: listaPerfil});
    }

    async alterarView(req, res) {
        if(req.params.id != undefined) {
            let usuario = new UsuarioModel();
            usuario = await usuario.obterUsuario(req.params.id)
            let perfil = new PerfilModel();
            let listaPerfil = await perfil.listarPerfil();
            res.render('usuario/alterar', {usuario: usuario, listaPerfil: listaPerfil});
        }
        else {
            res.redirect("/");
        }
        
    }

    async excluir(req, res) {
        if(req.body.id != ""){
            let usuario = new UsuarioModel();
            let result = await usuario.deletarUsuario(req.body.id);
            if(result == true)
                res.send({ok: true, msg: "Usuário excluído!"});
            else
                res.send({ok: false, msg: "Erro ao excluir usuário!"});
        }
        else{
            res.send({ok: false, msg: "Dados inválidos!"});
        }
    }

    async cadastrar(req, res) {
        if(req.body.nome != ''  && req.body.email != '' 
        && req.body.perfil != '0' && req.body.senha != "") {
            
            let usuario = new UsuarioModel(0, req.body.nome, 
            req.body.email, req.body.ativo, req.body.senha, req.body.perfil)
            
            let resultado = await usuario.gravarUsuario();

            if(resultado == true)
                res.send({ok: true, msg: "Usuário adicionado"})
            else
                res.send({ok: false, msg: "Erro ao inserir usuário"})
        }
        else{
            res.send({ok: false, msg: "Dados inválidos"})
        }
    }

    
    async alterar(req, res) {
        if(req.body.id > 0 && req.body.nome != ''  && req.body.email != '' 
        && req.body.perfil != '0' && req.body.senha != "") {
            
            let usuario = new UsuarioModel(req.body.id, req.body.nome, 
            req.body.email, req.body.ativo, req.body.senha, req.body.perfil)
            
            let resultado = await usuario.gravarUsuario();

            if(resultado == true)
                res.send({ok: true, msg: "Usuário alterado"})
            else
                res.send({ok: false, msg: "Erro ao alterar usuário"})
        }
        else{
            res.send({ok: false, msg: "Dados inválidos"})
        }
    }
}

module.exports = UsuarioController;