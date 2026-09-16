// Senha padrão para acessar o app (Você pode alterar a senha na linha abaixo)
const SENHA_ACESSO = "123456";

function validarSenha() {
    const senhaDigitada = document.getElementById("passwordInput").value;
    const errorElement = document.getElementById("loginError");

    if (senhaDigitada === SENHA_ACESSO) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("appScreen").style.display = "block";
        errorElement.innerText = "";
    } else {
        errorElement.innerText = "Senha incorreta! Tente novamente.";
    }
}

function logout() {
    document.getElementById("passwordInput").value = "";
    document.getElementById("loginScreen").style.display = "flex";
    document.getElementById("appScreen").style.display = "none";
}

function gerarEEnviarOrcamento(event) {
    event.preventDefault();

    const nome = document.getElementById("clientName").value;
    let telefone = document.getElementById("clientPhone").value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const modelo = document.getElementById("deviceModel").value;
    const servico = document.getElementById("serviceDetails").value;
    const valor = document.getElementById("totalValue").value;
    const prazo = document.getElementById("deliveryDeadline").value;

    // Monta a mensagem formatada para o cliente
    const mensagem = 
`Olá *${nome}*! 👋
Aqui é da assistência técnica. Segue o orçamento para o seu aparelho:

📲 *Aparelho:* ${modelo}
🛠️ *Serviço:* ${servico}
💰 *Valor:* R$ ${valor}
⏱️ *Prazo de entrega:* ${prazo}

Podemos aprovar o serviço para dar início?`;

    // Converte a mensagem para o formato de link Web
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Cria o link direto do WhatsApp
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=55${telefone}&text=${mensagemCodificada}`;

    // Abre o WhatsApp direto com a mensagem pronta
    window.open(urlWhatsApp, '_blank');
}
