# Sistema de Galeria (React + Node + Firebase) — Guia Completo

Este projeto já está integrado com backend Node/Express em TypeScript + Firebase Storage para upload e exibição de imagens na galeria.

## 1) Estrutura de pastas (atual)

### Raiz (frontend)
- `src/services/api.ts`: cliente Axios da API
- `src/pages/PhotoUpload.tsx`: envio de imagens para backend
- `src/pages/Gallery.tsx`: busca e renderização da galeria via API
- `src/App.tsx`: rotas (mantidas) e alias `/gallery`
- `.env.example`: variável `VITE_API_BASE_URL`
- `package.json`: scripts frontend e backend

### Backend
- `backend/src/config/firebase.ts`: inicialização do Firebase Admin
- `backend/src/services/storage.service.ts`: upload no Firebase Storage
- `backend/src/controllers/upload.controller.ts`: POST `/api/upload`
- `backend/src/controllers/gallery.controller.ts`: GET `/api/gallery`
- `backend/src/routes/upload.routes.ts`: rota de upload
- `backend/src/routes/gallery.routes.ts`: rota da galeria
- `backend/src/store/gallery.store.ts`: armazenamento em memória (temporário)
- `backend/src/app.ts`: CORS + rotas `/api`
- `backend/src/server.ts`: bootstrap do servidor
- `backend/.env.example`: variáveis do backend

## 2) O que já está funcionando

- Upload com validação de tipo: `jpg`, `png`, `webp`
- Limite de tamanho: `10MB`
- Upload para Firebase Storage com URL pública
- Retorno do backend no formato:

```json
{
  "id": "uuid",
  "name": "nome-do-enviador-ou-arquivo",
  "url": "https://storage.googleapis.com/...",
  "createdAt": "2026-03-03T00:00:00.000Z"
}
```

- Gallery consumindo `GET /api/gallery` automaticamente
- Rotas existentes preservadas (nenhuma removida)
- Build de frontend e backend já validado

## 3) Configuração passo a passo (perfeito)

## Passo A — Frontend (raiz)

1. Na raiz do projeto, instale dependências:
   - `npm install`

2. Crie arquivo `.env` na raiz com base em `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

3. Rodar frontend:
   - `npm run dev`

Frontend sobe por padrão em `http://localhost:5173`.

## Passo B — Backend (`backend/`)

1. Entre na pasta backend:
   - `cd backend`

2. Instale dependências:
   - `npm install`

3. Crie `backend/.env` com base em `backend/.env.example`.

Exemplo:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
```

4. Rodar backend:
   - `npm run dev`

Backend sobe em `http://localhost:3001`.

## Passo C — Firebase (console)

1. Abra Firebase Console e selecione seu projeto.
2. Vá em **Project Settings** > **Service Accounts** > **Generate new private key**.
3. Use os dados do JSON para preencher variáveis no `backend/.env`.
4. Em **Storage**, habilite o bucket.
5. Configure regras do Storage conforme necessidade do projeto.

## 4) Como iniciar tudo rapidamente

- Terminal 1 (raiz): `npm run dev`
- Terminal 2 (raiz): `npm run dev:backend`

Scripts úteis na raiz:
- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build`
- `npm run build:backend`

## 5) Fluxo de uso final

1. Usuário acessa `/upload`
2. Seleciona imagens (até 10MB, jpg/png/webp)
3. Frontend envia `FormData` para `POST /api/upload`
4. Backend envia arquivo ao Firebase Storage
5. Backend devolve URL pública e salva item em memória
6. Página `/galeria` ou `/gallery` carrega `GET /api/gallery`
7. Grid responsivo renderiza imagens automaticamente

## 6) Endpoints da API

- `POST /api/upload`
  - `multipart/form-data`
  - campo obrigatório: `image`
  - campo opcional: `uploaderName`

- `GET /api/gallery`
  - retorna lista de imagens em memória

- `GET /health`
  - status do backend

## 7) Responsividade aplicada

A página Gallery já segue o padrão visual atual:
- Mobile: 1 coluna
- Tablet: 2–3 colunas
- Desktop: 4+ colunas

Sem criação de novo sistema de estilos, usando o padrão Tailwind já existente.

## 8) Observações importantes de produção

- Hoje a lista da galeria está em memória no backend.
- Ao reiniciar o backend, os itens em memória são perdidos (as imagens continuam no Firebase).
- Próximo passo recomendado: persistir metadados em banco (Firestore, PostgreSQL, etc.).

## 9) Checklist de verificação (100%)

- [ ] `.env` da raiz criado com `VITE_API_BASE_URL`
- [ ] `backend/.env` criado com credenciais Firebase válidas
- [ ] Frontend rodando em `:5173`
- [ ] Backend rodando em `:3001`
- [ ] Upload em `/upload` funcionando
- [ ] Galeria em `/galeria` e `/gallery` carregando imagens
- [ ] `GET /health` responde `{ "status": "ok" }`
- [ ] `npm run build` e `npm run build:backend` sem erro

---

Status atual: integração concluída e operacional, faltando apenas preencher credenciais reais do Firebase no ambiente local para funcionamento completo em runtime.
