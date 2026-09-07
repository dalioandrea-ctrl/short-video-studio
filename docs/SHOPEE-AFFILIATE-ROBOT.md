# Shopee Video AI — plano de implementação

## O que já está funcionando

- Interface mobile-first/PWA.
- Entrada de link de produto.
- Endpoint server-side para tentar extrair Open Graph/title da página.
- Produto demo para testar o fluxo sem depender da Shopee.
- Seleção de estilo e duração.
- Geração de roteiro por OpenAI Responses API quando `OPENAI_API_KEY` existe.
- Fallback demonstrativo quando a chave ainda não foi configurada.
- Preview conceitual do criativo, legenda, hashtags e cenas.

## Próximas integrações

### 1. Dados oficiais/permitidos da Shopee
Preferir uma API ou integração autorizada para produto, imagens, preço e link de afiliado. Não depender de scraping frágil como arquitetura principal.

### 2. Voz
Adicionar provedor TTS, com `ELEVENLABS_API_KEY` ou outro serviço compatível.

### 3. Renderização MP4
Criar uma camada `VideoRenderer` para transformar o plano de cenas em 9:16 MP4. A interface já separa criação do roteiro da renderização para permitir usar Remotion, FFmpeg ou uma API de vídeo sem reescrever o fluxo.

### 4. Persistência
Adicionar Supabase para produtos, roteiros, jobs e histórico.

### 5. Storage
Adicionar R2/S3/Vercel Blob para imagens, áudio e vídeos.

### 6. Geração em lote
Adicionar "Criar 5 variações" reutilizando o mesmo produto e criando ângulos diferentes.

## Segurança

- `OPENAI_API_KEY` deve permanecer somente no servidor.
- Nunca usar prefixo `NEXT_PUBLIC_` para segredos.
- Validar URLs recebidas antes de fazer fetch server-side.
- Limitar tamanho/tempo de requests externos.
- Não copiar credenciais de afiliado para o browser.

## Fluxo-alvo

`Link Shopee → dados do produto → estratégia → roteiro → voz → cenas → renderização → MP4 → biblioteca → download/compartilhamento`.
