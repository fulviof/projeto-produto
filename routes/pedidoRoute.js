const express = require('express');
const PedidoController = require('../controllers/pedidoController');

class PedidoRoute {

    #router;

    get router() {
        return this.#router;
    }
    constructor() {
        this.#router = express.Router();

        let ctrl = new PedidoController();

        this.#router.get('/', ctrl.listar);
        this.#router.post('/filtrar', ctrl.filtrar);
    }
}

module.exports = PedidoRoute;