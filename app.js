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

console.log("Firebase conectado:", firebaseConfig.projectId);

// Teste de gravação
async function testarFirestore() {
  try {
    const docRef = await addDoc(collection(db, "ordens"), {
      teste: true,
      oficina: "Oficina do Celular",
      criadoEm: serverTimestamp()
    });

    console.log("Firestore funcionando! ID:", docRef.id);
  } catch (erro) {
    console.error("ERRO AO GRAVAR NO FIRESTORE:", erro);
  }
}

testarFirestore();
