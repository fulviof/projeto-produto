const Database = require('../db/database');

const banco = new Database();

class PedidoItemModel {

    #pedidoItemId;
    #pedidoId;
    #produtoId;
    #produtoNome;
    #pedidoItemQuantidade;
    #pedidoItemPreco;

    get pedidoItemId() {
        return this.#pedidoItemId;
    }
    set pedidoItemId(pedidoItemId){
        this.#pedidoItemId = pedidoItemId;
    }
    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId) {
        this.#pedidoId = pedidoId;
    }
    get produtoId() {
        return this.#produtoId;
    }
    set produto(produtoId) {
        this.#produtoId = produtoId;
    }
    get pedidoItemQuantidade() {
        return this.#pedidoItemQuantidade;
    }
    set pedidoItemQuantidade(pedidoItemQuantidade) {
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
    }
    get pedidoItemPreco() {
        return this.#pedidoItemPreco;
    }
    set pedidoItemPreco(pedidoItemPreco) {
        this.#pedidoItemPreco = pedidoItemPreco;
    }

    get produtoNome() {
        return this.#produtoNome;
    }
    set produtoNome(produtoNome) {
        this.#produtoNome = produtoNome;
    }

    constructor(pedidoItemId, pedidoId, produtoId, pedidoItemQuantidade, pedidoItemPreco, produtoNome) {
        this.#pedidoItemId = pedidoItemId;
        this.#pedidoId = pedidoId;
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
        this.#produtoId = produtoId;
        this.#pedidoItemPreco = pedidoItemPreco;
        this.#produtoNome = produtoNome;
    }

    async listar() {
        let sql = `select * from tb_pedido p 
        inner join tb_pedidoitens i on p.ped_id = i.ped_id
        inner join tb_produto pr on i.prd_id = pr.prd_id order by p.ped_id`;

        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for(let i = 0; i < rows.length; i++) {
            let item = rows[i];
            let pedidoItem = new PedidoItemModel(item['pit_id'], item['ped_id'], item['prd_id'], item['pit_quantidade'], item['pit_preco'], item['prd_nome']);

            lista.push(pedidoItem);
        }

        return lista;
    }

    async filtrarPedidos(criterioBusca, termoBusca) {

        let sqlWhere = "";
        if(criterioBusca == "numpedido" && termoBusca != null){
            sqlWhere = ` where p.ped_id = ${termoBusca} `;
        }
        if(criterioBusca == "nomeproduto" && termoBusca != null) {
            sqlWhere = ` where pr.prd_nome like '%${termoBusca}%' `;
        }

        let sql = `select * from tb_pedido p 
                    inner join tb_pedidoitens i on p.ped_id = i.ped_id
                    inner join tb_produto pr on i.prd_id = pr.prd_id
                    ${sqlWhere} `;

        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for(let i =0; i<rows.length; i++) {
            let item = rows[i];
            let pedidoItem = new PedidoItemModel(item['pit_id'], item['ped_id'], item['prd_id'], item['pit_quantidade'], item['pit_preco'], item['prd_nome']);

            lista.push(pedidoItem);
        }
        return lista;
    }

    async gravar() {

        let sql = "insert into tb_pedidoitens (ped_id, prd_id, pit_quantidade, pit_preco) values (?,?,?,?)";
        let valores = [this.#pedidoId, this.#produtoId, this.#pedidoItemQuantidade, this.#pedidoItemPreco];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    toJSON() {
        return {
            "pedidoId": this.#pedidoId,
            "pedidoItemId": this.#pedidoItemId,
            "pedidoItemPreco": this.#pedidoItemPreco,
            "pedidoItemQuantidade": this.#pedidoItemQuantidade,
            "produtoId":  this.#produtoId,
            "produtoNome": this.#produtoNome
        }
    }
}

module.exports = PedidoItemModel;