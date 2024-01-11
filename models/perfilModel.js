const Database = require('../db/database')

const conexao = new Database();

class PerfilModel {

    #perfilId;
    #perfilDescricao;

    get perfilId() {
        return this.#perfilId;
    }

    set perfilId(perfilId){
        this.#perfilId = perfilId;
    }

    get perfilDescricao(){
        return this.#perfilDescricao;
    }

    set perfilDescricao(perfilDescricao) {
        this.#perfilDescricao = perfilDescricao;
    }


    constructor(perfilId, perfilDescricao) {
        this.#perfilId = perfilId;
        this.#perfilDescricao = perfilDescricao;
    }


    async listarPerfil() {

        let sql = "select * from tb_perfil";

        let rows = await conexao.ExecutaComando(sql);

        let listaPerfil = []

        if(rows.length > 0) {

            for(let i = 0; i< rows.length; i++) {
                listaPerfil.push(new PerfilModel(rows[i]["per_id"], rows[i]["per_descricao"]))
            }
        }

        return listaPerfil;

    }

}

module.exports = PerfilModel;