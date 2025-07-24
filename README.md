# 🤖 Bot de Discord – Aprovação de Set com Modal

Este é um bot de Discord que permite que membros solicitem “sets” através de um formulário (modal), que pode ser aprovado ou recusado por administradores com base em botões interativos.

## 🚀 Funcionalidades

- Formulário via modal para solicitar set (nome, ID, organização e cargo)
- Mensagem com embed e botões para **Aprovar** ou **Recusar**
- Modal para inserir o **ID do cargo** ao aprovar
- Nickname do membro atualizado automaticamente
- Cargo atribuído automaticamente
- Notificação enviada ao canal de avisos
- Registro de comandos feito automaticamente com `deploy.js`

---

## 📁 Estrutura do Projeto

```
.
├── commands/                # Seus comandos separados (cada um como um módulo)
├── index.js                 # Arquivo principal do bot
├── deploy.js                # Registro automático de comandos
├── .env                     # Variáveis de ambiente (token, client_id, etc.)
└── README.md
```

---

## ⚙️ Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` com as seguintes variáveis:

```env
TOKEN=SEU_TOKEN_DO_BOT
CLIENT_ID=ID_DO_CLIENT
GUILD_ID=ID_DA_GUILD
CHANNEL_SOLICITACOES=ID_DO_CANAL_DE_SOLICITACOES
CHANNEL_AVISOS=ID_DO_CANAL_DE_AVISOS
```

---

## ▶️ Rodando o bot

Execute:

```bash
node deploy.js
```

Isso irá:

1. Executar `node deploy.js` para registrar comandos
2. Iniciar o bot com `node index.js`

Execute:

```bash
node index.js
```

Isso irá:

1. Iniciar o bot com `node index.js`
   
---

## 📦 Dependências principais

- [discord.js](https://discord.js.org) `v14+`
- [dotenv](https://www.npmjs.com/package/dotenv) para variáveis de ambiente

---

## 🧠 Observações

- Certifique-se de que o bot tenha permissões para:
  - Gerenciar apelidos (`Manage Nicknames`)
  - Gerenciar cargos (`Manage Roles`)
  - Ler e enviar mensagens nos canais configurados
- O modal de aprovação exige o **ID do cargo**, que deve ser colado corretamente.

---

## 📬 Contribuição

Sinta-se à vontade para abrir *issues* ou *pull requests*!

---

## 📄 Licença

MIT
