//importando os packages instalados
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const HomeRoute = require('./routes/homeRoute');
const ProdutoRoute = require('./routes/produtoRoute');
const MarcaRoute = require('./routes/marcaRoute');
const CategoriaRoute = require('./routes/categoriaRoute');
const Autenticacao = require('./middlewares/autenticacao');
const LoginRoute = require('./routes/loginRoute');
const UsuarioRoute = require('./routes/usuarioRoute');
const LojaRoute = require('./routes/lojaRoute');
const PedidoRoute = require('./routes/pedidoRoute');
const cookieParser = require('cookie-parser');

const app = express();

//configurando a nossa pasta public como o nosso repositorio de arquivos estáticos (css, js, imagens)
app.use(express.static(__dirname + "/public"))
//configuração das nossas views para utilizar a ferramenta EJS
app.set('view engine', 'ejs');
//Configuração de onde ficará nossas views
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//configuração da nossa página de layout
app.set('layout', './layout');
app.use(expressLayouts);
app.use(cookieParser());

//definindo as rotas que o nosso sistema vai reconhecer através da url do navegador
let auth = new Autenticacao();

let loginRota = new LoginRoute();
let lojaRota = new LojaRoute();
app.use('/login', loginRota.router);
app.use('/', lojaRota.router);

let produtoRota = new ProdutoRoute();
app.use('/produto', produtoRota.router);
//Daqui pra cima é público
app.use(auth.verificaUsuarioLogado);
//Daqui pra baixo é privado
let pedidoRota = new PedidoRoute();
app.use('/pedido', pedidoRota.router);
let homeRota = new HomeRoute();
app.use('/home', homeRota.router)
let usuarioRota = new UsuarioRoute();
app.use('/usuarios', usuarioRota.router);
let marcaRota = new MarcaRoute();
app.use("/marcas", marcaRota.router);
let categoriaRota = new CategoriaRoute();
app.use("/categorias", categoriaRota.router);

global.CAMINHO_IMG_PRODUTO = "/img/Produtos/";
global.RAIZ_PROJETO = __dirname;
//ponto de inicio do nosso servidor web
const server = app.listen('5000', function() {
    console.log('Servidor web iniciado');
});
