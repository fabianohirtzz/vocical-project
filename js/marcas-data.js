/* Conteúdo editorial por marca (tagline, sobre, serviços, categorias que trabalha).
   Mescla campos extras em window.VOCICAL.MARCAS por slug. Depende de config.js. */
(function () {
  var SERV = {
    vergalhao: { t: 'Corte e dobra de vergalhão e aço', d: 'Pilares, colunas, tela soldada, sapatas, treliças, vigas e estribos conforme o projeto.' },
    chapa:     { t: 'Corte e dobra de chapa', d: 'Peças para telhas, calhas, rufos, perfis e reforços, do desenho à peça final.' },
    laser:     { t: 'Corte a laser e plasma', d: 'Peças metálicas conforme o seu desenho, com produção ágil para indústria, construção, transporte e campo.' },
    orcamento: { t: 'Orçamento rápido', d: 'Resposta ágil para pedidos recorrentes e demandas pontuais da obra.' },
    consultivo:{ t: 'Atendimento consultivo B2B', d: 'Apoio no quantitativo, alternativas de produto e orçamento técnico rápido.' },
    retira:    { t: 'Retira na unidade', d: 'Praticidade para compras recorrentes e urgências do canteiro.' }
  };

  var EXTRA = {
    'vocical': {
      tagline: 'Tudo que você precisa, com quem entende de obra',
      sobre: 'Desde 1987, a Vocical Distribuidora, unidade de Votuporanga/SP do Grupo Vocical, atende operações profissionais com um mix completo: do material de construção ao aço para construção civil, além de coberturas e suprimentos para indústrias. Trabalhamos com orçamento ágil, atendimento consultivo e produção sob medida em corte e dobra, conforme o seu projeto.',
      servicos: [SERV.vergalhao, SERV.chapa, SERV.consultivo],
      categorias: ['materiais-de-construcao', 'aco', 'estruturais', 'coberturas', 'agronegocio']
    },
    'jacical': {
      tagline: 'Do cimento ao aço, com quem entende de obra',
      sobre: 'A Jacical, unidade de Jales/SP do Grupo Vocical, atende operações profissionais com um mix completo em material de construção, aço para construção civil, coberturas e suprimentos industriais. Destaque para cimento, telhas e aço, além do corte e dobra sob medida conforme o projeto. Orçamento ágil, atendimento consultivo e foco em resultado.',
      servicos: [SERV.vergalhao, SERV.chapa, SERV.consultivo],
      categorias: ['materiais-de-construcao', 'aco', 'estruturais', 'coberturas', 'agronegocio']
    },
    'ello-forte': {
      tagline: 'Soluções que fazem a obra andar',
      sobre: 'A Ello Forte, com unidades em Ribeirão Preto e São Carlos/SP, atende operações profissionais com foco em material de construção, aço para construção civil e suprimentos para serralheria e indústria. Destaque para cimento e vergalhão, além do corte e dobra de vergalhão e aço armado conforme o seu projeto. Atendimento ágil, direto ao ponto e pensado no cronograma da obra.',
      servicos: [SERV.vergalhao, SERV.orcamento, SERV.consultivo],
      categorias: ['materiais-de-construcao', 'aco', 'estruturais', 'coberturas']
    },
    'robracon': {
      tagline: 'Aço, drywall e corte a laser para quem constrói de verdade',
      sobre: 'A Robracon, com unidades em Cuiabá, Rondonópolis e Sinop/MT, atende operações profissionais com foco em aço para construção civil, conformação de chapas e drywall, além de linhas essenciais de material de construção e coberturas. Também oferece corte a laser e plasma, produzindo componentes metálicos conforme o projeto: chapas recortadas, flanges, tampas, reforços, consoles, painéis e peças especiais.',
      servicos: [SERV.vergalhao, SERV.chapa, SERV.laser, SERV.consultivo],
      categorias: ['materiais-de-construcao', 'aco', 'estruturais', 'drywall', 'coberturas', 'agronegocio']
    },
    'distribuidoras': {
      tagline: 'Os essenciais da obra com atendimento direto',
      sobre: 'As distribuidoras do Grupo Vocical, em Itu, Piracicaba e Itapetininga/SP, atendem revendas, construtoras e gestão de obras que precisam de regularidade de fornecimento e produtos de giro. Mix com foco em materiais de construção, aço (itens de estoque) e coberturas, além de caixas d’água, tanques, cisternas e biodigestores. O mix pode variar por unidade.',
      servicos: [SERV.consultivo, SERV.orcamento, SERV.retira],
      categorias: ['materiais-de-construcao', 'aco', 'coberturas']
    },
    'rp-cimento-cal': {
      tagline: 'Cimento, cal e os essenciais da obra',
      sobre: 'A Rio Preto Cimento e Cal, unidade do Grupo Vocical em São José do Rio Preto/SP, atende a região com materiais de construção e atendimento consultivo. Conteúdo desta página em atualização.',
      servicos: [SERV.consultivo],
      categorias: ['materiais-de-construcao'],
      pendente: true
    }
  };

  var V = window.VOCICAL || {};
  (V.MARCAS || []).forEach(function (m) {
    var e = EXTRA[m.slug];
    if (e) { for (var k in e) m[k] = e[k]; }
  });
})();
