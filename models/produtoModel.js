const Database = require('../db/database');
const fs = require('fs');
const conexao = new Database();
class ProdutoModel {

    #produtoId;
    #produtoCodigo;
    #produtoNome;
    #produtoQuantidade;
    #categoriaId;
    #categoriaNome;
    #marcaId;
    #marcaNome;
    #produtoPreco;
    #produtoImagem;
    #possuiImagem;

    get produtoId() { return this.#produtoId; } set produtoId(produtoId) {this.#produtoId = produtoId;}
    get produtoCodigo() { return this.#produtoCodigo; } set produtoCodigo(produtoCodigo) {this.#produtoCodigo = produtoCodigo;}
    get produtoNome() { return this.#produtoNome; } set produtoNome(produtoNome) {this.#produtoNome = produtoNome;}
    get produtoQuantidade() { return this.#produtoQuantidade; } set produtoQuantidade(produtoQuantidade) {this.#produtoQuantidade = produtoQuantidade;}
    get categoriaId() { return this.#categoriaId; } set categoriaId(categoriaId) {this.#categoriaId = categoriaId;}
    get categoriaNome() { return this.#categoriaNome; } set categoriaNome(categoriaNome) {this.#categoriaNome = categoriaNome;}
    get marcaId() { return this.#marcaId; } set marcaId(marcaId) {this.#marcaId = marcaId;}
    get marcaNome() { return this.#marcaNome; } set marcaNome(marcaNome) {this.#marcaNome = marcaNome;}
    get produtoPreco() { return this.#produtoPreco; } set produtoPreco(produtoPreco) {this.#produtoPreco = produtoPreco;}
    get produtoImagem() { return this.#produtoImagem; } set produtoImagem(produtoImagem) {this.#produtoImagem = produtoImagem;}
    get possuiImagem() {
        return this.#possuiImagem;
    }
    set possuiImagem(possuiImagem) {
        this.#possuiImagem = possuiImagem;
    }

    constructor(produtoId, produtoCodigo, produtoNome, produtoQuantidade, categoriaId, marcaId, categoriaNome, marcaNome, produtoPreco, produtoImagem) {
        this.#produtoId = produtoId;
        this.#produtoCodigo = produtoCodigo;
        this.#produtoNome = produtoNome;
        this.#produtoQuantidade = produtoQuantidade;
        this.#categoriaId = categoriaId;
        this.#categoriaNome = categoriaNome;
        this.#marcaId = marcaId;
        this.#marcaNome = marcaNome;
        this.#produtoPreco = produtoPreco;
        this.#produtoImagem = produtoImagem;
    }

    async excluir(codigo){
        let sql = "delete from tb_produto where prd_id = ?"
        let valores = [codigo];

        var result = await conexao.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async gravar() {
        if(this.#produtoId == 0){
            let sql = "insert into tb_produto (prd_cod, prd_nome, prd_quantidade, cat_id, mar_id, prd_preco, prd_imagem) values (?, ?, ?, ?, ?, ?, ?)";

            let valores = [this.#produtoCodigo, this.#produtoNome, this.#produtoQuantidade, this.#categoriaId, this.#marcaId, this.#produtoPreco, this.#produtoImagem];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
        else{
            //alterar
            let sql = "";
            let valores = [];

            //tratamento para a alteração de imagens
            if(this.#produtoImagem != null) {
                sql = "update tb_produto set prd_cod = ?, prd_nome = ?, prd_quantidade= ?, cat_id = ?, mar_id = ?, prd_preco = ?, prd_imagem = ? where prd_id = ?";

                valores = [this.#produtoCodigo, this.#produtoNome, this.#produtoQuantidade, this.#categoriaId, this.#marcaId, this.#produtoPreco, this.#produtoImagem, this.#produtoId];
            }
            else {
                sql = "update tb_produto set prd_cod = ?, prd_nome = ?, prd_quantidade= ?, cat_id = ?, mar_id = ?, prd_preco = ? where prd_id = ?";

                valores = [this.#produtoCodigo, this.#produtoNome, this.#produtoQuantidade, this.#categoriaId, this.#marcaId, this.#produtoPreco, this.#produtoId];
            }

            return await conexao.ExecutaComandoNonQuery(sql, valores) > 0;
        }
    }

    async buscarProduto(id){
        let sql = 'select * from tb_produto where prd_id = ?';
        let valores = [id];
        var rows = await conexao.ExecutaComando(sql, valores);
        let produto = null;

        if(rows.length > 0) {
            var row = rows[0];

            let imagem = "";
            let possuiImagem = false;
            if(row["prd_imagem"] != null) {
                imagem = global.CAMINHO_IMG_PRODUTO + row["prd_imagem"];
                if(!fs.existsSync(global.RAIZ_PROJETO + "/public/" + imagem)){
                    imagem = global.CAMINHO_IMG_PRODUTO + "Produto-sem-foto.png";
                }
                else {
                    possuiImagem = true;
                }
                
            }
            else{
                imagem = global.CAMINHO_IMG_PRODUTO + "Produto-sem-foto.png";
            }

            produto = new ProdutoModel(row['prd_id'], 
            row['prd_cod'], row['prd_nome'], row['prd_quantidade'], 
            row['cat_id'], row['mar_id'], "", "", row["prd_preco"], imagem);

            produto.possuiImagem = possuiImagem;

        }

        return produto;
    }

    async listarProdutos() {

        let sql = 'select * from tb_produto p inner join tb_categoria c on p.cat_id = c.cat_id inner join tb_marca m on p.mar_id = m.mar_id';
        
        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];

        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){
                var row = rows[i];

                let imagem = "";
                if(row["prd_imagem"] != null) {
                    imagem = global.CAMINHO_IMG_PRODUTO + row["prd_imagem"];
                    if(!fs.existsSync(global.RAIZ_PROJETO + "/public/" + imagem)){
                        imagem = global.CAMINHO_IMG_PRODUTO + "Produto-sem-foto.png";
                    }
                }
                else{
                    imagem = global.CAMINHO_IMG_PRODUTO + "Produto-sem-foto.png";
                }

                listaRetorno.push(new ProdutoModel(row['prd_id'], 
                row['prd_cod'], row['prd_nome'], row['prd_quantidade'], 
                row['cat_id'], row['mar_id'], row['cat_nome'], row['mar_nome'], row["prd_preco"].replace('.', ','), imagem));
            }
        }

        return listaRetorno;
    }

}

module.exports = ProdutoModel;