document.addEventListener('DOMContentLoaded', function() {

    let listaProdutos = [];
    if(localStorage.getItem('carrinho') != null) {
        listaProdutos = JSON.parse(localStorage.getItem('carrinho'));
        document.getElementById("contadorCarrinho").innerText = listaProdutos.length;
    }
    
    let btnAbrirModal = document.getElementById("btnAbrirModal");

    btnAbrirModal.addEventListener('click', function() {

    })

    var myModalEl = document.getElementById('modalCarrinho')
    myModalEl.addEventListener('show.bs.modal', function (event) {
        montarCarrinho();
    })

    let botoes = document.querySelectorAll(".addCarrinho");

    botoes.forEach(function(value, index) {
        value.onclick = adicionarAoCarrinho;
    })

    let botaoGravar = document.getElementById("btnGravarPedido");

    botaoGravar.onclick = gravarPedido;

    function gravarPedido() {
        fetch('/gravar-pedido', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({listaProdutos: listaProdutos})
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            if(r.ok) {
                alert(r.msg);
                listaProdutos = [];
                localStorage.removeItem('carrinho');
                document.querySelector('[data-bs-dismiss]').click();
                document.getElementById("contadorCarrinho").innerText = 0;
            }
            else{
                alert(r.msg);
            }
        })
    }

    function onChangeInput() {
        let value = this.value;

        if(value != "" && isNaN(value) == false) {
            let id = this.dataset.id;

            if(value > 999)
                value = 999;
            else {
                if(value < 1) {
                    value = 1;
                }
            }
            atualizaValor(id, value, this);
        }
    }

    function atualizaValor(id, quantidade, botao) {
        let produto = listaProdutos.find(x => x.id == id);
        
        if(produto != null) {
            produto.quantidade = quantidade;
            produto.valor = (produto.preco * produto.quantidade).toFixed(2);
            localStorage.setItem('carrinho', JSON.stringify(listaProdutos));
            botao.parentElement.parentElement.previousElementSibling.innerText = "R$" + produto.valor;
        }
        document.getElementById("qtdeProduto-" + id).value = quantidade;

        //atualiza valor total
        let valorTotal = 0;
        listaProdutos.forEach(function(value, index) {
            valorTotal += parseFloat(value.valor);
        })
        document.getElementById("totalDoCarrinho").innerText = valorTotal.toFixed(2);
    }

    function removerProduto() {
        let id = this.dataset.id;
        listaProdutos = listaProdutos.filter(x=> x.id != id);
        localStorage.setItem('carrinho', JSON.stringify(listaProdutos));
        this.parentElement.parentElement.remove();
        document.getElementById("contadorCarrinho").innerText = listaProdutos.length;
    }

    function decrementar() {
        let id = this.dataset.id;
        let quantidade = parseInt(document.getElementById("qtdeProduto-"+id).value);
        if(quantidade > 1) 
            quantidade--;

        atualizaValor(id, quantidade, this);
    }

    function aumentar() {
        let id = this.dataset.id;
        let quantidade = parseInt(document.getElementById("qtdeProduto-"+id).value);
        if(quantidade < 999)
            quantidade++;

        atualizaValor(id, quantidade, this);
    }

    function montarCarrinho() {
        if(listaProdutos.length > 0) {
            let valorTotal = 0;
            let html = `<table class='table'>
                            <thead>
                                <tr>
                                    <th>Imagem</th>
                                    <th>Nome</th>
                                    <th>Valor Unitário</th>
                                    <th>Valor Total</th>
                                    <th>Quantidade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>`;
            for(let i = 0; i < listaProdutos.length; i++ ){
                let produto = listaProdutos[i];
                valorTotal += parseFloat(produto.valor);
                html += `
                            <tr>
                                <td><img src='${produto.imagem}' width='100'></td>
                                <td>${produto.nome}</td>
                                <td>R$${produto.preco}</td>
                                <td>R$${produto.valor}</td>
                                <td>
                                    <div style='display:flex;'>
                                        <button data-id='${produto.id}' class='btn btn-default diminuir'><i class='fas fa-minus'></i></button>
                                        <input id='qtdeProduto-${produto.id}' class='form-control qtdeProduto' data-id="${produto.id}" style='width:75px' value='${produto.quantidade}' type='number'/>
                                        <button data-id='${produto.id}' class='btn btn-default aumentar'><i class='fas fa-plus'></i></button>               
                                    </div>
                                </td>
                                <td> <button class='btn btn-outline-danger btnRemover' data-id='${produto.id}'>Remover</button> </td>
                            </tr>
                        `;
            }
            html += `</tbody>
                </table>`;

            //montar o valor total
            html += `
                    <div>
                        <h3 style='text-align:end'>Total do pedido: R$<span id="totalDoCarrinho">${valorTotal.toFixed(2)}</span></h3>
                    </div>
                    `;

            document.getElementById("corpoCarrinho").innerHTML = html; 
            let btnDiminuir = document.querySelectorAll('.diminuir');
            
            btnDiminuir.forEach(function(value, index) {
                value.onclick = decrementar;
            })

            let btnAumentar = document.querySelectorAll('.aumentar');
            btnAumentar.forEach(function(value, index){
                value.onclick = aumentar;
            })

            let btnRemover = document.querySelectorAll('.btnRemover');
            btnRemover.forEach(function(value, index) {
                value.onclick = removerProduto;
            })

            let inputQtde = document.querySelectorAll('.qtdeProduto');
            inputQtde.forEach(function(value, index) {
                value.onchange = onChangeInput;
            })
        }
        else {
            document.getElementById("corpoCarrinho").innerHTML = "<span class='alert alert-info'>Nenhum produto adicionado ao carrinho!</span>";
        }
    }

    function adicionarAoCarrinho() {
        let id = this.dataset.id;
        fetch('/produto/obter/' + id)
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            console.log(r);
            if(r.ok) {
                let produto = listaProdutos.find(x => x.id == r.produto.id);
                if(produto != null){
                    produto.quantidade++;
                    produto.valor = produto.preco * produto.quantidade;
                }                 
                else {
                    r.produto.valor = r.produto.preco;
                    listaProdutos.push(r.produto);
                }
                    
                
                localStorage.setItem('carrinho', JSON.stringify(listaProdutos));

                document.getElementById("contadorCarrinho").innerText = listaProdutos.length;
                this.innerHTML = "<i class='fas fa-check'></i> Adicionado!";

                let that = this;
                setTimeout(function() {
                    that.innerHTML = "<i class='fas fa-shopping-cart'></i> Adicionar ao carrinho";
                }, 5000);
            }
            else{
                alert("Falha ao adicionar produto ao carrinho!");
            }
        })
    }

})