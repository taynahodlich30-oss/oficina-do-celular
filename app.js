// Oficina do Celular — versão inicial PWA.
// Para usar Firebase, substitua o objeto firebaseConfig abaixo pelos dados do seu projeto.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "COLE_SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const configured = !firebaseConfig.apiKey.startsWith("COLE_");
let db, storage;
if (configured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
}

const $ = s => document.querySelector(s);
const modal = $("#modal"), form = $("#osForm"), list = $("#list");
let orders = JSON.parse(localStorage.getItem("oficina_os") || "[]");

function render(data=orders){
  $("#total").textContent=data.length;
  $("#analysis").textContent=data.filter(x=>x.status==="Em análise").length;
  $("#repair").textContent=data.filter(x=>x.status==="Em reparo").length;
  $("#ready").textContent=data.filter(x=>x.status==="Pronto").length;
  if(!data.length){list.innerHTML='<div class="empty">Nenhuma ordem de serviço cadastrada.</div>';return}
  list.innerHTML=data.map(x=>`
    <article class="os">
      <div class="osTop"><div><h3>OS #${x.numero}</h3><div class="muted">${esc(x.cliente)} • ${esc(x.telefone||"Sem WhatsApp")}</div></div><span class="badge">${esc(x.status)}</span></div>
      <div class="osBody">
        <div><b>${esc(x.aparelho)}</b>${x.imei?` • IMEI ${esc(x.imei)}`:""}</div>
        <div><b>Defeito:</b> ${esc(x.defeito)}</div>
        ${x.observacoes?`<div><b>Observações:</b> ${esc(x.observacoes)}</div>`:""}
        ${x.valor?`<div><b>Valor:</b> R$ ${Number(x.valor).toFixed(2).replace(".",",")}</div>`:""}
        ${x.fotos?.length?`<div class="photos">${x.fotos.map(u=>`<img src="${u}" alt="Foto do aparelho">`).join("")}</div>`:""}
      </div>
    </article>`).join("");
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

if(configured){
  const q=query(collection(db,"ordens"),orderBy("criadoEm","desc"));
  onSnapshot(q,s=>{orders=s.docs.map(d=>({id:d.id,...d.data()}));render()});
}

$("#newBtn").onclick=()=>modal.classList.remove("hidden");
$("#closeBtn").onclick=()=>modal.classList.add("hidden");
modal.onclick=e=>{if(e.target===modal)modal.classList.add("hidden")};
$("#search").oninput=e=>{
  const t=e.target.value.toLowerCase();
  render(orders.filter(x=>`${x.numero} ${x.cliente} ${x.aparelho} ${x.defeito}`.toLowerCase().includes(t)));
};

$("#fotos").onchange=e=>{
  $("#preview").innerHTML="";
  [...e.target.files].forEach(f=>{const img=document.createElement("img");img.src=URL.createObjectURL(f);$("#preview").append(img)});
};

form.onsubmit=async e=>{
  e.preventDefault();
  const fd=new FormData(form), fotos=[...$("#fotos").files];
  const data={cliente:fd.get("cliente"),telefone:fd.get("telefone"),aparelho:fd.get("aparelho"),imei:fd.get("imei"),status:fd.get("status"),valor:fd.get("valor"),defeito:fd.get("defeito"),observacoes:fd.get("observacoes"),numero:String(Date.now()).slice(-6),criadoEm:configured?serverTimestamp():new Date().toISOString(),fotos:[]};
  if(configured){
    for(const file of fotos){
      const r=ref(storage,`ordens/${data.numero}/${crypto.randomUUID()}-${file.name}`);
      await uploadBytes(r,file); data.fotos.push(await getDownloadURL(r));
    }
    await addDoc(collection(db,"ordens"),data);
  }else{
    data.fotos=await Promise.all(fotos.map(file=>new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsDataURL(file)})));
    orders.unshift(data);localStorage.setItem("oficina_os",JSON.stringify(orders));render();
  }
  form.reset();$("#preview").innerHTML="";modal.classList.add("hidden");
};

let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}};
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
render();
