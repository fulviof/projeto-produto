

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById("btnEntrar").addEventListener('click', autenticar);
    function autenticar() {

        let email = document.querySelector("#email").value;
        let senha = document.querySelector("#senha").value;

        if(email != "" && senha != ""){

            let body = {
                email: email,
                senha: senha 
            }

            fetch('/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }).then(function(r) {
                return r.json()
            }).then(function(r) {
                if(r.status == true){
                    window.location.href = "/";
                }
                else{
                    document.getElementById("msgRetorno").innerHTML = '<div class="alert alert-danger">'+ r.msg +'</div>';
                }
            })

        }
        else{
            alert("Usuário/Senha inválidos!");
        }
    }
})