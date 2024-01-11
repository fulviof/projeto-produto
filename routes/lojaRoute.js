const express = require('express');
const LojaController = require('../controllers/lojaController');

class LojaRoute {

    #router;

    get router() {
        return this.#router;
    }
    constructor() {
        this.#router = express.Router();

        let ctrl = new LojaController();

        this.#router.get('/', ctrl.lojaView);
        this.#router.post('/gravar-pedido', ctrl.gravarPedido);
    }
}

module.exports = LojaRoute;