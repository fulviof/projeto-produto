const Database = require('../db/database');

const banco = new Database();

class PedidoModel {
    #pedidoId;
    #pedidoData;

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId) {
        this.#pedidoId = pedidoId;
    }

    get pedidoData() {
        return this.#pedidoData;
    }
    set pedidoData(pedidoData) {
        this.#pedidoData = pedidoData;
    }

    constructor(pedidoId, pedidoData) {
        this.#pedidoId = pedidoId;
        this.#pedidoData = pedidoData;
    }


    async gravar() {
        let sql = "insert into tb_pedido (ped_data) values(now())";

        let pedidoId = await banco.ExecutaComandoLastInserted(sql);

        this.#pedidoId = pedidoId;
    }
}
module.exports = PedidoModel;