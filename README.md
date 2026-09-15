# Oficina do Celular

PWA inicial para cadastro e acompanhamento de ordens de serviço.

## Estrutura
- `index.html` — telas
- `style.css` — visual
- `app.js` — cadastro, busca e Firebase
- `manifest.json` — instalação como aplicativo
- `sw.js` — suporte PWA/offline básico

## Firebase
Abra `app.js` e substitua `firebaseConfig` pelos dados do seu projeto Firebase.

Ative no Firebase:
1. Firestore Database
2. Storage

Depois publique estes arquivos no GitHub Pages.

> A versão sem Firebase funciona localmente no navegador e salva os testes no armazenamento local do aparelho. Para uso real com vários dispositivos, configure o Firebase.
