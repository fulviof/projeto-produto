const express = require('express');
const multer = require('multer');
const ProdutoController = require('../controllers/produtoController');
const Autenticacao = require('../middlewares/autenticacao');

class ProdutoRoute {

    #router;
    get router() {
        return this.#router;
    }
    set router(router) {
        this.#router = router
    }

    constructor() {
        this.#router = express.Router();

        let storage = multer.diskStorage({
            destination: function(req, res, cb) {
                cb(null, 'public/img/Produtos');
            },
            filename: function(req, file, cb) {
                var ext = file.originalname.split(".")[1];
                cb(null, Date.now().toString() + "." + ext);
            }
        })

        let auth = new Autenticacao();
        let upload = multer({storage});
        let ctrl = new ProdutoController();
        this.#router.get('/', auth.verificaUsuarioLogado, ctrl.listarView);
        this.#router.get('/obter/:id', ctrl.obterProduto);
        this.#router.get('/cadastro', auth.verificaUsuarioLogadoAdmin, ctrl.cadastroView);
        this.#router.post("/cadastro", auth.verificaUsuarioLogadoAdmin, upload.single("inputImagem"), ctrl.cadastrarProduto);
        this.#router.post("/excluir", auth.verificaUsuarioLogadoAdmin, ctrl.excluirProduto);
        this.#router.get("/alterar/:id", auth.verificaUsuarioLogadoAdmin, ctrl.alterarView);
        this.#router.post("/alterar", auth.verificaUsuarioLogadoAdmin, upload.single('inputImagem'), ctrl.alterarProduto);
    }
}

module.exports = ProdutoRoute;