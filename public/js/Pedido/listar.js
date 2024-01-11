document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnExportarExcel").addEventListener('click', exportarExcel);

    document.getElementById("btnPesquisar").addEventListener('click', filtrarTabela);

    function exportarExcel() {

        var wb = XLSX.utils.table_to_book(document.getElementById("tabelaPedidos"));
        XLSX.writeFile(wb, "RelatorioPedidos.xlsx");
    }

    function montarPedidos(lista) {

        let htmlBody = `<tbody>`;

        lista.forEach(function(value, index) {
            htmlBody += `<tr>
                            <td>${value.pedidoId}</td>
                            <td>${value.produtoNome}</td>
                            <td>${value.pedidoItemQuantidade}</td>
                            <td>${value.pedidoItemPreco}</td>
                            <td>${value.pedidoItemPreco * value.pedidoItemQuantidade}</td>
                        </tr>`;
        })

        htmlBody += `</tbody>`;

        document.querySelector("#tabelaPedidos > tbody").innerHTML = htmlBody;
    }

    function filtrarTabela() {

        var criterioBusca = document.querySelector('input[name="criterioBusca"]:checked').value;
        var termoBusca = document.getElementById("inputBusca").value;

        //fazer fetch para o backend;

        fetch('/pedido/filtrar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({criterio: criterioBusca, termo: termoBusca}) 
        })
        .then(r => {
            return r.json();
        })
        .then(r => {
            if(r.lista.length > 0) {
                montarPedidos(r.lista);
            }
            else{
                alert("Nenhum pedido encontrado para a filtragem");
            }
        })
        .catch( e => {
            console.error(e);
        })
    }
})