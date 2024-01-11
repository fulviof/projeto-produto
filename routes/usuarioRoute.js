const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const Autenticacao = require('../middlewares/autenticacao');

class UsuarioRoute {

    #router;

    get router(){
        return this.#router;
    }

    constructor() {
        this.#router = express.Router();
        let ctrl = new UsuarioController();
        this.#router.get('/', ctrl.listarView);
        this.#router.get('/cadastrar', ctrl.cadastrarView);
        this.#router.post('/cadastrar', ctrl.cadastrar);
        this.#router.post('/excluir', ctrl.excluir);
        this.#router.get('/alterar/:id', ctrl.alterarView);
        this.#router.post('/alterar', ctrl.alterar);
    }
}

module.exports = UsuarioRoute