const CategoriaModel = require("../models/categoriaModel");
const MarcaModel = require("../models/marcaModel");
const ProdutoModel = require("../models/produtoModel");
const fs = require('fs');

class ProdutoController {

    async listarView(req, res) {
        let prod = new ProdutoModel();
        let lista = await prod.listarProdutos();
        res.render('produto/listar', {lista: lista});
    }

    async excluirProduto(req, res){
        var ok = true;
        if(req.body.codigo != "") {
            let produto = new ProdutoModel();
            ok = await produto.excluir(req.body.codigo);
        }
        else{
            ok = false;
        }

        res.send({ok: ok});
    }
    async cadastrarProduto(req, res){
        var ok = true;
        if(req.body.codigo != "" && req.body.nome != "" && req.body.quantidade != "" && 
        req.body.quantidade  != '0' && req.body.marca != '0' && req.body.categoria  != '0' &&
        req.body.preco > '0' && req.file != null) {
            let produto = new ProdutoModel(0, 
                req.body.codigo, req.body.nome, 
                req.body.quantidade, 
                req.body.categoria, 
                req.body.marca, "", "", req.body.preco, req.file.filename);

            ok = await produto.gravar();
        }
        else{
            ok = false;
        }

        res.send({ ok: ok })
    }

    async alterarView(req, res){
        let produto = new ProdutoModel();
        let marca = new MarcaModel();
        
        let categoria = new CategoriaModel();
        if(req.params.id != undefined && req.params.id != ""){
            produto = await produto.buscarProduto(req.params.id);
        }

        let listaMarca = await marca.listarMarcas();
        let listaCategoria = await categoria.listarCategorias();
        res.render("produto/alterar", {produtoAlter: produto, listaMarcas: listaMarca, listaCategorias: listaCategoria});
    }

    async alterarProduto(req, res) {
        var ok = true;
        if(req.body.codigo != "" && req.body.nome != "" && req.body.quantidade != "" && req.body.quantidade  != '0' && req.body.marca != '0' && req.body.categoria  != '0' && req.body.preco > '0') {

            let imagem = null;
            if(req.file != undefined) {
                imagem = req.file.filename;
                let produtoOld = new ProdutoModel();
                produtoOld = await produtoOld.buscarProduto(req.body.id);
                if(produtoOld.possuiImagem == true){
                    //verifica se existe
                    if(fs.existsSync(global.RAIZ_PROJETO  + "/public/" + produtoOld.produtoImagem) == true)
                        //realiza a deleção da imagem do nosso diretório
                        fs.unlinkSync(global.RAIZ_PROJETO  + "/public/" + produtoOld.produtoImagem);
                }
            }

            let produto = new ProdutoModel(req.body.id, req.body.codigo, req.body.nome, req.body.quantidade, req.body.categoria, req.body.marca, "", "", req.body.preco, imagem);

            ok = await produto.gravar();
        }
        else{
            ok = false;
        }

        res.send({ ok: ok })
    }

    async obterProduto(req, res) {
        if(req.params.id != null){
            let produto = new ProdutoModel();
            produto = await produto.buscarProduto(req.params.id);

            if(produto != null) {
                let produtoJson = {
                    id: produto.produtoId,
                    nome: produto.produtoNome,
                    preco: produto.produtoPreco,
                    imagem: produto.produtoImagem,
                    quantidade: 1
                }

                res.send({ok: true, produto: produtoJson});
            }
            else{
                res.send({ok: false, msg: "Produto não encontrado"});
            }
        }
        else {
            res.send({ok: false, msg: "Parâmetro inválidos"})
        }
    }

    async cadastroView(req, res) {

        let listaMarcas = [];
        let listaCategorias = [];

        let marca = new MarcaModel();
        listaMarcas = await marca.listarMarcas();

        let categoria = new CategoriaModel();
        listaCategorias = await categoria.listarCategorias();

        res.render('produto/cadastro', { listaMarcas: listaMarcas, listaCategorias: listaCategorias });
    }
}

module.exports = ProdutoController;