# Sistema de Email para Confirmação de Presença (RSVP)

## 📋 O que foi feito

Criei um sistema completo de envio de emails quando alguém confirma presença no casamento:

### ✅ Funcionalidades

1. **Página de Configuração** (`/admin-config`)
   - Cadastre o email onde quer receber as confirmações
   - Configure credenciais do EmailJS (gratuito)
   - Interface segura com campos mascarados

2. **Envio de Emails Automático**
   - Quando alguém confirma no RSVP, um email é enviado para você
   - Contém: nome, email, telefone, confirmação, acompanhantes
   - Com timestamp de quando foi confirmado

3. **Painel de RSVPs** (`/admin-rsvps`)
   - Visualize todas as confirmações em um único lugar
   - Estatísticas (total, confirmados, não confirmados, acompanhantes)
   - Expandir para ver mais detalhes
   - Exportar dados como JSON
   - Limpar todos os RSVPs

## 🔧 Como Configurar

### Passo 1: Instale a dependência EmailJS

```bash
npm install @emailjs/browser
```

### Passo 2: Crie uma conta gratuita no EmailJS

1. Acesse https://www.emailjs.com/
2. Crie uma conta (é gratuito)
3. Configure um serviço de email (Gmail, Outlook, etc)
4. Crie um template de email

### Passo 3: Obtenha suas Credenciais

No dashboard do EmailJS, pegue:
- **Service ID**: Em "Email Services"
- **Template ID**: Em "Email Templates"
- **User ID / Public Key**: Em "Account" > "API Keys"

### Passo 4: Configure no Painel

1. Acesse `/admin-config`
2. Digite seu email de destino
3. Cole os IDs do EmailJS nos campos indicados
4. Clique em "Salvar Configuração"

## 📧 Exemplo de Template no EmailJS

Crie um template com as variáveis abaixo:

```
Assunto: Nova Confirmação de Presença

Olá,

Uma nova confirmação de presença foi recebida:

👤 Nome: {{guest_name}}
📧 Email: {{guest_email}}
📱 Telefone: {{guest_phone}}
✅ Confirmação: {{attending}}
👥 Acompanhantes: {{num_guests}}
📋 Nomes: {{guest_names}}

Data: {{confirmation_date}} às {{confirmation_time}}

Acesse /admin-rsvps para ver todas as confirmações.

Atenciosamente,
Sistema de Casamento
```

## 🔐 Segurança

- As credenciais são armazenadas APENAS no localStorage do seu navegador
- Nunca compartilhe suas chaves públicas ou privadas
- Os dados de RSVP também são salvos localmente

## 📱 URLs do Painel

- **Configuração**: `/admin-config`
- **Ver RSVPs**: `/admin-rsvps`
- **Confirmação**: `/presenca`

## 💾 Backup de Dados

No painel de RSVPs, você pode:
- Exportar todos os dados como JSON (backup)
- Fazer download para armazenar em segurança

## ❓ Troubleshooting

### Emails não estão sendo enviados
- Verifique se o EmailJS está instalado (`npm install @emailjs/browser`)
- Confirme que as credenciais estão corretas
- Teste o template no dashboard do EmailJS

### Configuração não salva
- Limpe o cache do navegador
- Verifique se há espaço no localStorage

### Não consigo ver confirmações antigas
- Elas estão armazenadas no localStorage
- Se limpou o cache, podem ter sido perdidas (use o backup JSON)

## 🚀 Próximos Passos (Opcional)

Se quiser melhorias futuras:
- Integrar com banco de dados (Firebase, Supabase)
- Enviar confirmação ao convidado também
- Relatórios em PDF
- Dashboard com gráficos

---

**Pronto para usar!** 🎉 Cualquer dúvida, consulte a documentação do EmailJS em https://www.emailjs.com/docs
