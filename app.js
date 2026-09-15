import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4CccsFRsOEkEknvASp2OFeaUM15w_VMI",
  authDomain: "oficina-do-celular-73a69.firebaseapp.com",
  projectId: "oficina-do-celular-73a69",
  storageBucket: "oficina-do-celular-73a69.firebasestorage.app",
  messagingSenderId: "737244059599",
  appId: "1:737244059599:web:6baf998f0eccc168a864ba",
  measurementId: "G-KQCV93PPVS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Oficina do Celular - Firebase conectado");

const form = document.querySelector("#osForm");
const lista = document.querySelector("#listaOS");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dados = new FormData(form);

    const ordem = {
      cliente: dados.get("cliente") || "",
      whatsapp: dados.get("whatsapp") || "",
      aparelho: dados.get("aparelho") || "",
      imei: dados.get("imei") || "",
      defeito: dados.get("defeito") || "",
      observacoes: dados.get("observacoes") || "",
      valor: dados.get("valor") || "",
      status: "Recebido",
      criadoEm: serverTimestamp()
    };

    try {
      const documento = await addDoc(
        collection(db, "ordens"),
        ordem
      );

      alert("Ordem de serviço criada com sucesso!");

      form.reset();

      console.log("OS criada:", documento.id);

    } catch (erro) {
      console.error("Erro ao criar OS:", erro);

      alert(
        "Não foi possível salvar a ordem. Verifique a conexão com o Firebase."
      );
    }
  });
}

if (lista) {
  const consulta = query(
    collection(db, "ordens"),
    orderBy("criadoEm", "desc")
  );

  onSnapshot(
    consulta,
    (snapshot) => {
      lista.innerHTML = "";

      snapshot.forEach((doc) => {
        const os = doc.data();

        const item = document.createElement("div");

        item.className = "ordem";

        item.innerHTML = `
          <strong>${os.cliente || "Sem nome"}</strong>
          <p>${os.aparelho || "Aparelho não informado"}</p>
          <p>Defeito: ${os.defeito || "Não informado"}</p>
          <p>Status: ${os.status || "Recebido"}</p>
        `;

        lista.appendChild(item);
      });
    },
    (erro) => {
      console.error("Erro ao carregar ordens:", erro);
    }
  );
}
