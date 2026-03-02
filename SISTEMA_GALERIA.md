# Sistema de Galeria de Fotos

## 📸 Visão Geral

Sistema completo de galeria de fotos para o site de casamento, permitindo que convidados compartilhem suas fotografias do evento.

## 🗂️ Estrutura Criada

### Componentes

#### 1. **ImageUploader.tsx**
- Upload de múltiplas imagens com drag & drop
- Validação de formato (JPG, PNG, WEBP)
- Limite de tamanho (10MB por foto)
- Preview das imagens antes do upload
- Contador de arquivos selecionados

#### 2. **PhotoCard.tsx**
- Card individual para cada foto
- Botões de ação: Like, Download, Compartilhar
- Exibição do nome de quem enviou
- Contador de likes
- Animações ao passar o mouse

#### 3. **PhotoGrid.tsx**
- Grid responsivo de fotos
- Layout: 1 coluna (mobile) → 2 (tablet) → 3-4 (desktop)
- Estado de loading com skeleton
- Estado vazio com mensagem

### Páginas

#### 1. **GalleryHome.tsx** - `/galeria-home`
Landing page da galeria com:
- Apresentação do sistema
- 3 cards de features (Ver, Compartilhar, Curtir)
- CTA para enviar fotos
- Animações com Framer Motion

#### 2. **Gallery.tsx** - `/galeria`
Galeria principal com:
- Grid de todas as fotos
- Busca por nome de quem enviou
- Contadores (total de fotos)
- Botão de filtros (preparado para futuro)
- Sistema de likes

#### 3. **PhotoUpload.tsx** - `/upload`
Página de envio com:
- Campo para nome do remetente
- Componente ImageUploader integrado
- Validações de formulário
- Feedback de sucesso com redirecionamento
- Loading durante upload

#### 4. **PhotoAdmin.tsx** - `/admin-fotos`
Painel administrativo com:
- Estatísticas (total de fotos, likes, colaboradores)
- Grid com todas as fotos
- Botões de ação: visualizar, excluir
- Exportar dados em JSON
- Excluir todas as fotos
- Modal de confirmação de exclusão
- Preview em tela cheia

## 🔄 Fluxo de Uso

### Para Convidados

1. **Acessar galeria**: `/galeria-home` → Ver apresentação
2. **Ver fotos**: Clicar em "Ver Galeria" → `/galeria`
3. **Enviar fotos**:
   - Clicar em "Enviar Fotos" → `/upload`
   - Digitar nome
   - Arrastar ou selecionar fotos
   - Confirmar upload
   - Redirecionado para galeria

### Para Administradores

1. **Acessar admin**: Navegar para `/admin-fotos`
2. **Visualizar estatísticas**: Ver métricas no topo
3. **Gerenciar fotos**:
   - Ver todas as fotos em grid
   - Clicar para preview em tela cheia
   - Excluir fotos individuais
   - Exportar backup em JSON
   - Limpar galeria completa

## 💾 Armazenamento

### LocalStorage

Todas as fotos são armazenadas no `localStorage` do navegador:

```javascript
// Estrutura de uma foto
{
  id: "timestamp-randomid",
  url: "data:image/jpeg;base64,...", // Base64 da imagem
  uploadedBy: "Nome do Convidado",
  likes: 0
}

// Chave de armazenamento
localStorage.getItem("weddingPhotos")
```

### Migração para Backend (Futuro)

Para produção, recomenda-se:

1. **Backend API**:
   ```
   POST /api/photos - Upload de foto
   GET /api/photos - Listar fotos
   PUT /api/photos/:id/like - Dar like
   DELETE /api/photos/:id - Excluir foto
   ```

2. **Storage**:
   - AWS S3
   - Cloudinary
   - Firebase Storage

3. **Alterações necessárias**:
   - Substituir localStorage por chamadas à API
   - Implementar autenticação para admin
   - Usar URLs reais em vez de Base64
   - Adicionar paginação na galeria

## 🎨 Recursos Visuais

### Animações

- **Framer Motion** em todas as páginas
- Fade in ao carregar
- Scale animation nos cards
- Hover effects
- Loading spinners

### Responsividade

- **Mobile**: 1 coluna, botões fullwidth
- **Tablet (sm)**: 2-3 colunas
- **Desktop (lg)**: 3 colunas
- **Desktop XL (xl)**: 4 colunas

### Componentes UI (shadcn/ui)

- Button com variantes
- Input com labels
- AlertDialog para exclusões
- Toast notifications (sonner)

## 🛡️ Validações

### Upload

- ✅ Formato: JPG, PNG, WEBP apenas
- ✅ Tamanho: Máximo 10MB por arquivo
- ✅ Quantidade: Máximo 10 fotos por vez
- ✅ Nome obrigatório

### Feedback

- ❌ Erro: Toast vermelho
- ✅ Sucesso: Toast verde
- ⏳ Carregamento: Spinner + mensagem

## 📱 Rotas Adicionadas

```tsx
<Route path="/galeria-home" element={<GalleryHome />} />
<Route path="/galeria" element={<Gallery />} />
<Route path="/upload" element={<PhotoUpload />} />
<Route path="/admin-fotos" element={<PhotoAdmin />} />
```

## 🔗 Navegação

### Links Internos

- GalleryHome → Gallery: "Ver Galeria"
- GalleryHome → Upload: "Enviar Fotos"
- Gallery → Upload: Botão no header
- Upload → Gallery: Redirect automático após sucesso

### Adicionar ao Menu Principal

Para incluir no Navigation.tsx:

```tsx
{ name: "Galeria", href: "/galeria-home" }
```

## 📋 Checklist de Produção

Antes de fazer deploy:

- [ ] Implementar backend para armazenamento real
- [ ] Adicionar autenticação no admin
- [ ] Otimizar imagens (compressão, thumbnails)
- [ ] Adicionar paginação na galeria
- [ ] Implementar filtros avançados
- [ ] Configurar CDN para imagens
- [ ] Adicionar rate limiting no upload
- [ ] Implementar moderação de conteúdo
- [ ] Testar em dispositivos reais
- [ ] Adicionar analytics

## 🎯 Funcionalidades Futuras

### Curto Prazo

- Filtros por data de upload
- Ordenação (mais recentes, mais curtidas)
- Comentários nas fotos
- Tags/álbuns

### Longo Prazo

- Reconhecimento facial
- Álbuns compartilhados
- Timeline de eventos
- Slideshow automático
- Download em massa (ZIP)

## 💡 Dicas de Uso

### Performance

- LocalStorage tem limite de ~5-10MB
- Base64 aumenta ~33% o tamanho
- Para muitas fotos, use backend real

### UX

- Sempre mostre feedback visual
- Preview antes de confirmar upload
- Confirme ações destrutivas
- Loading states em todas ações assíncronas

### Manutenção

- Backup regular do localStorage
- Exportar dados periodicamente via admin
- Monitorar quantidade de fotos
- Limpar fotos duplicadas ou inapropriadas

---

**Criado em**: ${new Date().toLocaleDateString('pt-BR')}
**Versão**: 1.0.0
**Status**: ✅ Pronto para uso
