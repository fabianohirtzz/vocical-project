# Design — Site Grupo Vocical

Data: 2026-06-29 · Tipo: site institucional B2B · Stack: HTML/CSS/JS puro

## 1. Objetivo e público

Site institucional do Grupo Vocical (distribuidor B2B de materiais de construção,
desde 1987, 11 unidades em SP+MT) com **foco em geração de leads B2B**. Público:
lojas de material de construção, construtoras/incorporadoras, serralherias, calheiros,
gesseiros e indústrias.

Sucesso = visitante entende o grupo, encontra a unidade/produto que precisa e aciona
o canal de conversão (widget) em poucos cliques, no celular ou desktop.

## 2. Arquitetura (mapa do site)

| Página | Arquivo | Papel |
|--------|---------|-------|
| Hub do grupo (home) | `index.html` | Porta de entrada, motor de leads |
| Vocical | `marcas/vocical.html` | Marca — Votuporanga/SP |
| Jacical | `marcas/jacical.html` | Marca — Jales/SP |
| Ello Forte | `marcas/ello-forte.html` | Marca — Ribeirão Preto + São Carlos/SP |
| RP Cimento e Cal | `marcas/rp-cimento-cal.html` | Marca — S. José do Rio Preto/SP |
| Robracon | `marcas/robracon.html` | Marca — Rondonópolis + Cuiabá + Sinop/MT |
| Distribuidoras | `marcas/distribuidoras.html` | Ituana, Itapetininga, Piracicaba/SP |
| Produtos | `produtos.html` | Catálogo completo (6 categorias) |
| Sobre | `sobre.html` | História, números, frota, parceiros |
| Contato | `contato.html` | Canais, unidades, widget |

Header e footer compartilhados (mesma marcação em todas as páginas). *Trabalhe Conosco*
e *Webmail* entram como links no menu/rodapé, sem página dedicada nesta fase.

## 3. Sistema visual

Direção aprovada: **meio-termo equilibrado** — base clara e legível com momentos de
impacto industrial.

### Tokens (reaproveitados da marca / vocical-design)
- `--red: #a60303` · `--red-dark: #730a0a` · `--ink: #0d0d0d` · `--charcoal: #1a1a1a`
- `--paper: #f9f9f9` · `--white: #ffffff` · `--gray: #8a8a8a`

### Superfícies (ritmo claro/escuro)
- **Claro** (`--paper`/branco): padrão da maioria das seções; texto charcoal + acento vermelho.
- **Escuro** (`--ink`/`--charcoal`): hero, faixa de números, blocos de conversão; texto branco + acento vermelho, grão sutil.
- **Vermelho** (`--red`): blocos de CTA pontuais.

### Tipografia — Archivo
- Archivo Black: display, números, medidas.
- Archivo (variável): SemiBold/Bold para títulos e labels; Regular para corpo.
- Acento de marca: uma palavra do título em vermelho (`<span class="accent">`), 1 por título.

### Elementos de marca (com parcimônia)
Kicker (régua vermelha + label uppercase), pill badge, recortes geométricos pontuais,
grão sutil em superfícies escuras. Margens generosas. Nada poluído; um elemento
vermelho dominante por bloco.

## 4. Conteúdo do hub (home)

Hero escuro (proposta de valor + CTA) → faixa de números (1987 / 35+ anos / 11 unidades
/ SP+MT) → o que é o grupo → **6 marcas em cards** (linkam para as páginas) → produtos
em destaque (6 categorias) → serviços (corte e dobra de vergalhão/chapa/telha, frota
própria) → parceiros (Gerdau, ArcelorMittal, CSN, Votorantim, Usiminas, Brasilit, Placo,
Quartzolit) → unidades/mapa → bloco de conversão → footer.

## 5. Template de página de marca

Cabeçalho (logo/foto da marca + cidade[s]) → sobre a marca → unidades daquela marca
(foto, endereço, contato, horário se houver) → **produtos que a unidade trabalha**
(subconjunto, ver §7) → serviços disponíveis → bloco de conversão.

## 6. Página de produtos

Catálogo categorizado **exatamente como o site atual**, 6 categorias com subcategorias
e a copy de `referencia-conteudo.md`:
1. Materiais de Construção · 2. Aço Construção Civil · 3. Materiais Estruturais
(Indústrias e Serralherias) · 4. Coberturas · 5. Drywall · 6. Agronegócio.
Mais o bloco de serviços de corte e dobra. Navegação por âncoras/abas entre categorias.

## 7. Estratégia de conteúdo

- **Copy:** base em `referencia-conteudo.md` (extraída do site atual), ajustada à regra
  Freela (sem travessões, sem emojis, números concretos). O parceiro vai exportar mais
  conteúdo do WordPress.
- **Imagens:** pasta `Imagens/` (209, por marca/unidade/produto). Otimizar e dar `alt`.
- **Mapeamento unidade → produtos: RESOLVIDO.** Os JSONs Elementor em
  `Paginas Unidades/` foram extraídos para `referencia-unidades.md` (UTF-8). Cada
  unidade traz: hero, contato por sub-unidade, serviços e a lista explícita
  "Categorias e grupos de produtos" que trabalha. *Distribuidoras* = 3 sub-unidades
  (Itu, Piracicaba, Itapetininga), cada uma com endereço/e-mail/telefone próprios.
  Cada página de marca usa o subconjunto da sua fonte.

## 8. Conversão (CTA)

Destino único de todos os CTAs (por enquanto):
`https://grupovocical.com.br/produtos/?utm_content=meutrack_533fa7c4ec8b`
Centralizado num único ponto do JS (ex: `js/config.js` com `CTA_URL`) para trocar
pelo widget definitivo num só lugar. WhatsApp (66) 99939-3953 como canal secundário.

## 9. Técnico, SEO e performance

- HTML semântico multipágina; um CSS base compartilhado (`css/base.css`) + estilos por
  página quando necessário; JS mínimo (`js/`).
- Mobile-first; header com menu responsivo.
- SEO on-page por página: `<title>`, meta description, Open Graph, canonical; headings
  hierárquicos; `alt` em imagens; sitemap.xml + robots.
- **Preview com `noindex`** até aprovação do domínio final.
- Performance: imagens otimizadas (dimensão/compressão), lazy-load abaixo da dobra.

## 10. Deploy

- Preview contínuo: **GitHub Pages** (`fabianohirtzz.github.io/vocical-project/`).
- Final: **erehost** (FTP), arquivos estáticos.

## 11. Fora de escopo (YAGNI nesta fase)

Páginas dedicadas de Trabalhe Conosco e Webmail (apenas links); área logada; e-commerce;
backend/formulário server-side (conversão é via widget externo); blog.
