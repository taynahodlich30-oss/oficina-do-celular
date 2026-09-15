```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "USER_SHARED_API_KEY",
  authDomain: "oficina-do-celular-73a69.firebaseapp.com",
  projectId: "oficina-do-celular-73a69",
  storageBucket: "oficina-do-celular-73a69.firebasestorage.app",
  messagingSenderId: "737244059599",
  appId: "1:737244059599:web:6baf998f0eccc168a864ba",
  measurementId: "G-KQCV93PPVS"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ordensRef = collection(db, "ordens");


const form = document.getElementById("osForm");
const lista = document.getElementById("listaOS");
const busca = document.getElementById("busca");
const statusMessage = document.getElementById("statusMessage");
const formMessage = document.getElementById("formMessage");
const salvarBtn = document.getElementById("salvarBtn");
const cancelarEdicaoBtn = document.getElementById("cancelarEdicaoBtn");
const tituloForm = document.getElementById("tituloForm");


let ordens = [];
let ordemEditando = null;


/* =========================
   SALVAR / EDITAR
========================= */

form.addEventListener("submit", async (event) => {

  event.preventDefault();

  const dados = new FormData(form);

  const ordem = {
    cliente: String(dados.get("cliente") || "").trim(),
    whatsapp: String(dados.get("whatsapp") || "").trim(),
    aparelho: String(dados.get("aparelho") || "").trim(),
    imei: String(dados.get("imei") || "").trim(),
    defeito: String(dados.get("defeito") || "").trim(),
    observacoes: String(dados.get("observacoes") || "").trim(),
    acessorios: String(dados.get("acessorios") || "").trim(),
    valor: dados.get("valor") ? Number(dados.get("valor")) : 0,
    entrega: String(dados.get("entrega") || "")
  };


  formMessage.textContent = "Salvando...";
  formMessage.className = "message";


  try {

    /* EDITANDO UMA OS EXISTENTE */

    if (ordemEditando) {

      await updateDoc(
        doc(db, "ordens", ordemEditando),
        ordem
      );

      formMessage.textContent = "✅ Ordem de serviço atualizada!";
      formMessage.className = "message success";

      sairDaEdicao();

      return;
    }


    /* CRIANDO UMA NOVA OS */

    await addDoc(ordensRef, {
      ...ordem,
      status: "Recebido",
      criadoEm: serverTimestamp()
    });


    form.reset();

    formMessage.textContent = "✅ Ordem de serviço criada!";
    formMessage.className = "message success";

  } catch (error) {

    console.error(error);

    formMessage.textContent =
      "❌ Erro ao salvar. Verifique o Firebase.";

    formMessage.className = "message error";
  }

});


/* =========================
   EDITAR OS
========================= */

window.editarOS = function(id) {

  const ordem = ordens.find(item => item.id === id);

  if (!ordem) return;


  ordemEditando = id;

  form.cliente.value = ordem.cliente || "";
  form.whatsapp.value = ordem.whatsapp || "";
  form.aparelho.value = ordem.aparelho || "";
  form.imei.value = ordem.imei || "";
  form.defeito.value = ordem.defeito || "";
  form.observacoes.value = ordem.observacoes || "";
  form.acessorios.value = ordem.acessorios || "";
  form.valor.value = ordem.valor || "";
  form.entrega.value = ordem.entrega || "";


  tituloForm.textContent = `✏️ Editando OS ${id}`;

  salvarBtn.textContent = "💾 Salvar alterações";

  cancelarEdicaoBtn.style.display = "block";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

};


/* =========================
   CANCELAR EDIÇÃO
========================= */

function sairDaEdicao() {

  ordemEditando = null;

  form.reset();

  tituloForm.textContent = "Nova ordem de serviço";

  salvarBtn.textContent = "💾 Salvar ordem de serviço";

  cancelarEdicaoBtn.style.display = "none";

}


cancelarEdicaoBtn.addEventListener(
  "click",
  sairDaEdicao
);


/* =========================
   ALTERAR STATUS
========================= */

window.alterarStatus = async function(id, novoStatus) {

  try {

    await updateDoc(
      doc(db, "ordens", id),
      {
        status: novoStatus
      }
    );

  } catch (error) {

    console.error(error);

    alert("Não foi possível alterar o status.");

  }

};


/* =========================
   EXCLUIR OS
========================= */

window.excluirOS = async function(id) {

  const confirmar = confirm(
    "Tem certeza que deseja excluir esta Ordem de Serviço?"
  );

  if (!confirmar) return;


  try {

    await deleteDoc(
      doc(db, "ordens", id)
    );

  } catch (error) {

    console.error(error);

    alert("Não foi possível excluir a OS.");

  }

};


/* =========================
   MOSTRAR ORDENS
========================= */

function render() {

  const termo = busca.value.toLowerCase().trim();


  const filtradas = ordens.filter((ordem) => {

    const texto = [

      ordem.id,
      ordem.cliente,
      ordem.whatsapp,
      ordem.aparelho,
      ordem.imei,
      ordem.defeito,
      ordem.status

    ]
      .join(" ")
      .toLowerCase();


    return texto.includes(termo);

  });


  lista.innerHTML = "";


  if (!filtradas.length) {

    lista.innerHTML =
      "<p class='message'>Nenhuma ordem encontrada.</p>";

    return;
  }


  filtradas.forEach((ordem) => {

    const elemento = document.createElement("article");

    elemento.className = "order";


    const valor = Number(ordem.valor || 0)
      .toFixed(2)
      .replace(".", ",");


    elemento.innerHTML = `

      <h3>
        ${escapeHtml(ordem.cliente || "Sem nome")}
      </h3>

      <span class="badge">
        ${escapeHtml(ordem.status || "Recebido")}
      </span>

      <p>
        <strong>OS:</strong>
        ${escapeHtml(ordem.id)}
      </p>

      <p>
        <strong>Aparelho:</strong>
        ${escapeHtml(ordem.aparelho || "-")}
      </p>

      <p>
        <strong>IMEI:</strong>
        ${escapeHtml(ordem.imei || "-")}
      </p>

      <p>
        <strong>Defeito:</strong>
        ${escapeHtml(ordem.defeito || "-")}
      </p>

      <p>
        <strong>WhatsApp:</strong>
        ${escapeHtml(ordem.whatsapp || "-")}
      </p>

      <p>
        <strong>Valor:</strong>
        R$ ${valor}
      </p>


      <label style="margin-top:15px;">
        Status

        <select
          onchange="alterarStatus('${ordem.id}', this.value)"
          style="
            padding:10px;
            border-radius:8px;
            border:1px solid #d1d5db;
            background:white;
          "
        >

          ${opcaoStatus("Recebido", ordem.status)}

          ${opcaoStatus("Em análise", ordem.status)}

          ${opcaoStatus("Aguardando aprovação", ordem.status)}

          ${opcaoStatus("Aprovado", ordem.status)}

          ${opcaoStatus("Em reparo", ordem.status)}

          ${opcaoStatus("Pronto", ordem.status)}

          ${opcaoStatus("Entregue", ordem.status)}

        </select>

      </label>


      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin-top:12px;
      ">

        <button
          type="button"
          onclick="editarOS('${ordem.id}')"
        >
          ✏️ Editar
        </button>

        <button
          type="button"
          onclick="excluirOS('${ordem.id}')"
        >
          🗑️ Excluir
        </button>

      </div>

    `;


    lista.appendChild(elemento);

  });

}


/* =========================
   STATUS
========================= */

function opcaoStatus(status, atual) {

  return `
    <option
      value="${status}"
      ${status === atual ? "selected" : ""}
    >
      ${status}
    </option>
  `;

}


/* =========================
   PROTEÇÃO HTML
========================= */

function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    (caractere) => ({

      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"

    })[caractere]
  );

}


/* =========================
   BUSCA
========================= */

busca.addEventListener(
  "input",
  render
);


/* =========================
   FIREBASE
========================= */

onSnapshot(
  ordensRef,

  (snapshot) => {

    ordens = snapshot.docs.map(
      (documento) => ({
        id: documento.id,
        ...documento.data()
      })
    );


    document.getElementById("totalOS").textContent =
      ordens.length;


    document.getElementById("reparoOS").textContent =
      ordens.filter(
        ordem => ordem.status === "Em reparo"
      ).length;


    document.getElementById("prontoOS").textContent =
      ordens.filter(
        ordem => ordem.status === "Pronto"
      ).length;


    statusMessage.textContent =
      "✅ Conectado ao Firebase.";

    statusMessage.className =
      "message success";


    render();

  },


  (error) => {

    console.error(error);

    statusMessage.textContent =
      "❌ Erro ao conectar ao Firestore.";

    statusMessage.className =
      "message error";

  }

);
```
