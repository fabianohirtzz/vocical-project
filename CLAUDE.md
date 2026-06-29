# Site Grupo Vocical — Vocical In Home

## O que é
Site institucional do **Grupo Vocical**, distribuidor B2B de materiais de construção
e soluções para construção civil/indústria, ativo desde 1987. Estrutura de **hub do
grupo + páginas por marca/unidade**. Objetivo de negócio: institucional completo
(grupo + marcas + produtos) **com foco em geração de leads B2B**.

Público: lojas de material de construção, construtoras/incorporadoras, serralherias,
calheiros, gesseiros e indústrias.

## Stack
HTML + CSS + JS puro (sem framework, sem build). Sobe estático via FTP/host.
Tipografia Archivo (mesma da marca). Sem dependência de Node no servidor.

## Design
- Design skill: `vocical-design` (foi feita para cards de Instagram; reaproveitamos
  os **tokens de marca**, não os layouts de card). Arquitetura visual do site é nova.
- Paleta: vermelho `#a60303`, vermelho escuro `#730a0a`, preto `#0d0d0d`,
  charcoal `#1a1a1a`, branco frio `#f9f9f9`, branco `#ffffff`, cinza apoio `#8a8a8a`.
- Tipografia: **Archivo** (Black para display/números, variável para títulos/corpo).
- Acento de marca: uma palavra do título em vermelho.

## Estrutura
```
vocical-project/
├── CLAUDE.md
├── referencia-conteudo.md   # copy e dados extraídos do site atual
├── Imagens/                 # 209 imagens já organizadas por marca/unidade/produto
├── index.html               # hub do grupo (a construir)
├── css/                     # estilos (a construir)
├── js/                      # scripts (a construir)
└── (páginas por marca, a construir)
```

## Comandos
- Dev: abrir `index.html` no navegador (ou Live Server). Sem build.
- Deploy preview: **GitHub Pages** (repo https://github.com/fabianohirtzz/vocical-project.git)
- Deploy final: **erehost** (host próprio do cliente, via FTP)

## Integrações
- **Widget próprio de atendimento/chat (lead)** — destino final de todos os CTAs.
  **Por enquanto, todos os CTAs apontam para:**
  `https://grupovocical.com.br/produtos/?utm_content=meutrack_533fa7c4ec8b`
  Centralizar esse destino num único ponto do JS para troca fácil quando vier o widget.
- WhatsApp comercial: (66) 99939-3953 (canal secundário)
- E-mail: contato@grupovocical.com.br
- Redes: Instagram @grupo.vocical · Facebook /grupovocical · LinkedIn /company/grupo-vocical
- Analytics/Search Console: configurar no pós-lançamento.

## Regras do projeto
- Idioma: português (BR).
- Copy padrão Freela: **sem travessões, sem emojis, números concretos**.
- Preview/proposta sempre com `noindex` até o cliente aprovar o domínio final.
- Nunca apagar/sobrescrever artefatos do cliente (a pasta Imagens é dele).

## Dependência de conteúdo (importante)
- **Produtos por unidade variam**: cada página de marca mostra só os produtos que
  aquela unidade trabalha, seguindo o site atual. Precisa do mapeamento
  "unidade → produtos" (export do WordPress ou páginas atuais por unidade).
- Catálogo de produtos: categorizar **exatamente** como o site atual (6 categorias).

## Estado atual
**Passo 3 de 7 — Design** (cronologia freela-method).
Direção aprovada: meio-termo equilibrado (base clara + impacto industrial), hub +
6 páginas de marca + produtos + sobre + contato. Próximo: escrever spec de design,
revisão do parceiro, depois plano de build (Passo 4).
