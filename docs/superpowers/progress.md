# Progress Ledger — Vocical "Peso e Logística"

Plan: docs/superpowers/plans/2026-06-29-vocical-peso-logistica.md
Exec mode: subagent-driven (adaptado: projeto não-git → handoff por arquivo, verificação por browser).

- [x] Task 1: Primitivos de design no base.css — DONE (verificado: display--mass, num--mass, duotone, hairline-grid/cell, eyebrow, reveal direcional, ticker)
- [x] Task 2: Hero assimétrico — DONE (verificado no browser: assimétrico, tipo-massa, foto duotone, console limpo)
- [x] Task 3: Faixa-medidor — DONE (verificado no browser: 5 mostradores, divisores hairline, count-up ok)
- [x] CHECKPOINT visual (hero + medidor) — APROVADO (com ajuste do título do hero aplicado)
- [x] Task 4: Sobre (split ancorado à esquerda) — DONE
- [x] Task 5: Marcas — lista editorial numerada — DONE
- [x] Task 6: Produtos — grade hairline — DONE (nota: produtos__cta sem text-align center, intencional/assimétrico)
- [x] Task 7: Serviços — full-bleed duotone — DONE
- [x] Task 8: Parceiros — ticker — DONE (head des-centralizado no sweep)
- [x] Task 9: Unidades — lista pesada — DONE
- [x] Task 10: Conversão — bloco vermelho com peso — DONE
- Sweep do controller: corrigido (1) display--mass gigante em títulos de seção → escala moderada; (2) sec-head de parceiros centralizado → esquerda. Console 0 erros, todos renderers populados, mobile ok.
- [x] Task 11: QA de browser completo (web-qa-reviewer) + correções — DONE
  - Aplicado: hero img eager+fetchpriority; sobre img lazy; count-up threshold .5→.15; footer h4→p; main tabindex=-1; ticker clones aria-hidden; redes rel noopener noreferrer. Console 0 erros, count-up ok.
  - BACKLOG deploy (não-bug): converter PNG hero 1.7MB→WebP; imagem OG dedicada 1200x630 no host final; fotos ≥800px coberturas/agronegócio (já no CLAUDE.md); logo header width/height (precisa dims reais).
- [x] Task 12: Codificar o sistema na skill vocical-design — DONE
  - SKILL.md atualizada (dois domínios: SITE + CARDS; gatilho dispara em trabalho de site).
  - references/ criados/expandidos: DESIGN.md (seção SITE), LAYOUT.md, COMPONENTS.md, ANIMATIONS.md, INSPIRATION.md. CARDS.md/PIPELINE.md intactos.
  - Coerência verificada: docs citam valores reais (grep 60 ocorrências de classes/tokens reais).

== TODAS AS 12 TASKS CONCLUÍDAS ==
