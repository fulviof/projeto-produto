const PedidoItemModel = require("../models/pedidoItemModel");
const PedidoModel = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");


class LojaController {

    async lojaView(req, res) {
        let produto = new ProdutoModel();
        let listaProdutos = await produto.listarProdutos();
        res.render('loja/index', {layout: 'loja/index', listaProdutos: listaProdutos, msg: "Mensagem TESTE"});
    }

    async gravarPedido(req, res) {
        let listaProdutos = req.body.listaProdutos;
        if(listaProdutos != null && listaProdutos.length > 0) {
            let pedido = new PedidoModel();
            await pedido.gravar();
            //iterar a lista de itens para gravar cada um deles
            for(let i = 0; i < listaProdutos.length; i++) {
                let pedidoItem = new PedidoItemModel(0, pedido.pedidoId, listaProdutos[i].id, listaProdutos[i].quantidade, listaProdutos[i].preco);

                await pedidoItem.gravar();
            }
            res.send({msg: "Pedido gravado com sucesso!", ok: true});
        }
        else{
            res.send({msg: "Nenhum produto adicionado ao carrinho!", ok: false});
        }
    }
}

module.exports = LojaController;