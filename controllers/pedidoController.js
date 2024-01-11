const PedidoItemModel = require("../models/pedidoItemModel");


class PedidoController {

    async listar(req, res) {
        let pedidoItem = new PedidoItemModel();
        let lista = await pedidoItem.listar();

        res.render('pedido/listar', {lista: lista});
    }

    async filtrar(req, res) {    
        let pedidoItem = new PedidoItemModel();
        let termo = req.body.termo == "" ? null : req.body.termo;
        let lista = await pedidoItem.filtrarPedidos(req.body.criterio, termo);

        let listaJson = [];

        lista.forEach(function(value, index) {
            listaJson.push(value.toJSON());
        })

        res.send({lista: listaJson});
    }

}

module.exports = PedidoController;