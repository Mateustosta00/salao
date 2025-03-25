document.addEventListener("DOMContentLoaded", function () {
    const inputNome = document.getElementById("nome");
    const inputContato = document.getElementById("contato");

    // Permitir apenas letras no nome
    inputNome.addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
    });

    // Formatar número de telefone automaticamente
    inputContato.addEventListener("input", function () {
        let numero = this.value.replace(/\D/g, ""); // Remove tudo que não for número

        if (numero.length > 11) {
            numero = numero.slice(0, 11); // Limita a 11 dígitos
        }

        let formatado = "";

        if (numero.length > 10) {
            formatado = `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
        } else if (numero.length > 6) {
            formatado = `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;
        } else if (numero.length > 2) {
            formatado = `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
        } else if (numero.length > 0) {
            formatado = `(${numero}`;
        }

        this.value = formatado;
    });

    // Função para validar o número antes de enviar o formulário
    document.querySelector("form").addEventListener("submit", function (event) {
        let numero = inputContato.value.replace(/\D/g, ""); // Remove tudo que não for número

        if (numero.length < 10) { // Verifica se o número tem menos de 10 dígitos
            alert("Por favor, insira um número de telefone válido com pelo menos 10 dígitos.");
            event.preventDefault(); // Impede o envio do formulário
        }
    });

    // Função para enviar os dados para a API
    function enviarParaAPI(dados) {
        console.log("Enviando dados para a API:", dados);  // Log dos dados enviados
        return fetch("https://api.sheetmonkey.io/form/whTmJwpAgsbiNvMMCf3YR8", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
    }
    // Redirecionar para a página result.html após clicar no botão "Enviar"
    document.getElementById("submitBtn").addEventListener("click", function () {
        let numero = inputContato.value.replace(/\D/g, ""); // Remove tudo que não for número
        let nome = inputNome.value.trim();
        let data = document.getElementById("data").value; // Pode adicionar mais campos conforme necessário
        let hora = document.getElementById("hora").value;

        // Verifica se todos os campos estão preenchidos corretamente
        if (numero.length >= 10 && nome !== "" && data !== "" && hora !== "") {
            // Monta o objeto com os dados a serem enviados para a API
            const dados = {
                nome: nome,
                contato: numero,
                data: data,
                hora: hora
            };

            // Envia os dados para a API
            enviarParaAPI(dados)
                .then(resposta => {
                    console.log("Dados enviados com sucesso:", resposta);
                    // Após o sucesso, redireciona para result.html
                    window.location.href = "result.html";
                })
                .catch(erro => {
                    console.error("Erro ao enviar os dados para a API:", erro);
                    alert("Houve um erro ao enviar os dados. Tente novamente.");
                });
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    });

    // Calcular data e hora
    $(function () {
        $("#data").datepicker({
            minDate: 0, // Não permite selecionar datas passadas
            maxDate: "+1M", // Permite selecionar no máximo 1 mês à frente
            dateFormat: "dd/mm/yy", // Formato da data
            showOtherMonths: true,
            selectOtherMonths: true,
            onSelect: function (dateText, inst) {
                $('#hora').prop('disabled', false);  // Habilita o campo de hora
            }
        });

        $('#hora').on('change', function () {
            const selectedTime = this.value;
            console.log('Hora escolhida:', selectedTime);
        });

        $('#hora').prop('disabled', true);  // Desabilita a seleção de hora inicialmente
    });
});
