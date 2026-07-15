/* Conteúdo editorial + SEO por unidade (landing rica). Keyed por pageSlug.
   Consumido por js/unidade.js. Fonte: grupo-vocical-produtos-servicos-por-unidade.md.
   Contato/endereço/logo/fachada vêm de js/config.js (VOCICAL.MARCAS[].unidades[]),
   resolvidos por marcaSlug + unidadeKey. Categorias usam slugs de window.CATALOGO.
   Só marcamos como confirmado o que o doc confirma; o resto vai em `validar`. */
window.UNIDADES = {
  'robracon-rondonopolis': {
    pageSlug: 'robracon-rondonopolis', marcaSlug: 'robracon', unidadeKey: 'rondonopolis',
    seo: {
      title: 'Material de Construção, Aço, Drywall e Coberturas em Rondonópolis/MT | Robracon — Grupo Vocical',
      description: 'Robracon Rondonópolis: aço, vergalhão, material de construção, drywall e coberturas em Rondonópolis/MT. Atendimento B2B e orçamento ágil.',
      canonical: 'https://grupovocical.com.br/marcas/robracon-rondonopolis.html'
    },
    hero: {
      kicker: 'Rondonópolis/MT',
      h1: 'Aço, material de construção e <span class="accent">drywall</span> em Rondonópolis',
      lede: 'Uma das unidades com o portfólio mais amplo do Grupo Vocical. Do cimento ao drywall, com serviços especializados e logística regional para obras, indústrias e serralherias.',
      selos: ['Desde 2005', 'Mix mais amplo do grupo', 'Atendimento B2B', 'Logística regional']
    },
    numeros: [ { n: 2005, suf: '', label: 'Em atividade desde' }, { n: 5, suf: '', label: 'Linhas de produto' }, { n: 100, suf: '%', label: 'Drywall completo' } ],
    sobre: {
      titulo: 'A unidade de maior portfólio do <span class="accent">grupo</span>',
      paras: [
        'A Robracon Rondonópolis foi constituída em 2004 e iniciou suas atividades em 2005, para aproximar lojistas, obras e grandes indústrias do setor da construção.',
        'Hoje atende construção civil, indústrias, serralherias, estruturas metálicas, agronegócio e sistemas drywall, reunindo produtos, serviços e soluções voltadas para produtividade, organização e desempenho.'
      ],
      foto: 'Imagens/Robracon ROO/robracon1 (2).png',
      fotoAlt: 'Estrutura da Robracon Rondonópolis, distribuidora de aço e material de construção em Rondonópolis MT'
    },
    segmentos: ['Construtoras e incorporadoras','Serralherias e metalúrgicas','Indústrias','Estruturas metálicas','Agronegócio','Lojistas e revendas'],
    categorias: ['materiais-de-construcao','aco','estruturais','coberturas','drywall'],
    categoriasNota: '',
    servicos: [
      { t: 'Corte e dobra de chapas', d: 'Para serralherias, metalúrgicas e indústria: perfis U, C e Z, terças, reforços, suportes e peças com dobras personalizadas, prontas para solda ou montagem.', beneficios: ['Precisão dimensional','Padronização das peças','Menos retrabalho','Ganho de produtividade'] },
      { t: 'Telhas metálicas e termoacústicas sob medida', d: 'Cobertura produzida conforme as medidas do projeto, em comprimentos personalizados, com menos emendas e montagem mais rápida.', beneficios: ['Menor desperdício','Melhor acabamento','Conforto térmico e acústico','Aplicação em galpões e centros logísticos'] },
      { t: 'Sistemas drywall completos', d: 'Fornecimento completo de drywall: placas ST, RU e Glasroc X, guias, montantes, perfil F530, e todos os acessórios de montagem e acabamento.', beneficios: ['Áreas secas, úmidas e fachadas','Montagem rápida','Linha completa em um só fornecedor'] }
    ],
    diferenciais: ['Mix mais amplo do Grupo Vocical','Drywall completo','Linha de serralheria e estruturas','Soluções para indústria e agronegócio','Telhas sob medida','Estrutura logística regional'],
    galeria: ['Imagens/Robracon ROO/robracon1 (3).png','Imagens/Robracon ROO/robracon1 (4).png','Imagens/Robracon ROO/robracon1 (5).png','Imagens/Robracon ROO/robracon1 (6).png','Imagens/Robracon ROO/corte-dobra-chapa.png','Imagens/Robracon ROO/corte-laser.png'],
    atuacao: { texto: 'Atende Rondonópolis e região, com estrutura logística para entrega regional de materiais e peças produzidas sob medida.', frota: 'Frota própria conforme a disponibilidade da unidade.' },
    faq: [
      { q: 'Onde comprar vergalhão e aço em Rondonópolis?', a: 'A Robracon Rondonópolis fornece vergalhões, colunas, treliças, tela soldada e malha POP para obras, indústrias e estruturas metálicas em Rondonópolis. Fale com o comercial para orçamento e disponibilidade.' },
      { q: 'A Robracon Rondonópolis trabalha com drywall?', a: 'Sim. É a unidade do grupo com a linha completa de drywall: placas ST, RU e Glasroc X, perfis, guias, montantes e acessórios.' },
      { q: 'Vocês produzem telhas metálicas sob medida?', a: 'Sim. Produzimos telhas metálicas e termoacústicas em comprimentos personalizados, conforme o projeto, para galpões, comércios, indústrias e centros logísticos.' },
      { q: 'A Robracon atende serralherias e indústrias?', a: 'Sim. Além do material de construção, oferecemos corte e dobra de chapas, perfis, tubos, chapas e componentes metálicos para serralherias, metalúrgicas e manutenção industrial.' },
      { q: 'Vocês atendem pessoa jurídica e obras de grande porte?', a: 'Sim. O atendimento é consultivo e preparado para B2B: lojistas, construtoras, indústrias e órgãos públicos, com apoio no quantitativo e entrega programada.' }
    ],
    razaoSocial: 'ROBRACON RONDONÓPOLIS BRASIL MATERIAIS P/ CONSTRUÇÃO LTDA',
    cnpj: '06.937.383/0001-05',
    validar: ['Disponibilidade atual de corte e dobra de vergalhão na unidade','Confirmar m² de estrutura para a faixa de números']
  },

  'vocical': {
    pageSlug: 'vocical', marcaSlug: 'vocical', unidadeKey: 'votuporanga',
    seo: {
      title: 'Material de Construção, Aço e Coberturas em Votuporanga/SP | Vocical — Grupo Vocical',
      description: 'Vocical Votuporanga: cimento, aço, vergalhão, coberturas, serralheria e corte e dobra sob medida. Unidade de origem do Grupo Vocical desde 1987.',
      canonical: 'https://grupovocical.com.br/marcas/vocical.html'
    },
    hero: {
      kicker: 'Votuporanga/SP',
      h1: 'Material de construção, aço e <span class="accent">serralheria</span> em Votuporanga',
      lede: 'A primeira empresa do Grupo Vocical, ativa desde 1987. Começou com cimento e cal e hoje reúne aço, produtos estruturais, serralheria, coberturas e serviços especializados para obras, indústrias e consumidor final.',
      selos: ['Desde 1987', 'Unidade de origem do grupo', 'Atendimento B2B e cliente final', 'Corte e dobra sob medida']
    },
    numeros: [ { n: 1987, suf: '', label: 'Origem do grupo desde' }, { n: 5, suf: '', label: 'Linhas de produto' } ],
    sobre: {
      titulo: 'Onde a história do grupo <span class="accent">começou</span>',
      paras: [
        'A Vocical foi a primeira empresa do Grupo e deu origem à história iniciada em 1987, em Votuporanga. Começou com a distribuição de cimento e cal e evoluiu com novos barracões, frota própria e ampliação do portfólio.',
        'Hoje a unidade atende empresas, profissionais e consumidor final, reunindo materiais básicos, aço para construção, produtos estruturais, serralheria, coberturas e serviços especializados.'
      ],
      foto: 'Imagens/Vocical/vocical1.jpg',
      fotoAlt: 'Estrutura da Vocical em Votuporanga, unidade de origem do Grupo Vocical, distribuidora de material de construção e aço'
    },
    segmentos: ['Construtoras e empreiteiras','Serralherias e metalúrgicas','Indústrias','Lojistas e revendas','Profissionais e consumidor final'],
    categorias: ['materiais-de-construcao','aco','estruturais','coberturas','agronegocio'],
    categoriasNota: '',
    servicos: [
      { t: 'Corte e dobra de vergalhão', d: 'Aço armado conforme o projeto estrutural: colunas, pilares, vigas, sapatas, estribos e peças especiais, com análise técnica, conferência e etiquetagem por lote e etapa.', beneficios: ['Menos desperdício de aço no canteiro','Menos retrabalho e mão de obra','Peças identificadas por posição e pavimento','Mais previsibilidade para as concretagens'] },
      { t: 'Corte e dobra de chapas', d: 'Chapas cortadas sob medida, perfis U, C e Z, reforços e componentes metálicos para serralherias, metalúrgicas e manutenção, prontos para solda ou montagem.', beneficios: ['Precisão dimensional','Padronização das peças','Menos ajuste manual','Ganho de produtividade'] }
    ],
    diferenciais: ['Unidade de origem do Grupo Vocical','Experiência desde 1987','Mix completo de construção a serralheria','Atendimento B2B e cliente final','Serviços especializados de corte e dobra'],
    galeria: ['Imagens/Vocical/vocical2.jpg','Imagens/Vocical/vocical3.jpg','Imagens/Vocical/vocical4.jpg','Imagens/Vocical/vocical5.jpg','Imagens/Vocical/vocical6.jpg','Imagens/Vocical/vocical7.jpg'],
    atuacao: { texto: 'Atende Votuporanga e região, com apoio comercial para obras, revendas, profissionais e consumidor final.', frota: 'Frota própria conforme a disponibilidade da unidade.' },
    faq: [
      { q: 'Onde comprar material de construção em Votuporanga?', a: 'A Vocical fornece cimento, cal, argamassa, rejunte, impermeabilizantes e telhas de fibrocimento em Votuporanga, além de aço e coberturas. Fale com o comercial para orçamento.' },
      { q: 'Onde comprar vergalhão e aço em Votuporanga?', a: 'A Vocical trabalha com vergalhões, colunas, treliças, tela soldada, malha POP e arames, além de corte e dobra de vergalhão sob medida conforme o projeto.' },
      { q: 'A Vocical faz corte e dobra de aço em Votuporanga?', a: 'Sim. A unidade produz aço armado conforme o projeto, com colunas, vigas, sapatas e estribos, além de corte e dobra de chapas para serralheria.' },
      { q: 'A Vocical atende serralherias e indústrias?', a: 'Sim. Além do material de construção, a unidade fornece barras, cantoneiras, chapas, tubos metalon, perfis e acessórios para serralherias e indústria.' },
      { q: 'A Vocical vende para pessoa física e para empresas?', a: 'Sim. O atendimento é preparado para empresas, profissionais e consumidor final, com apoio no quantitativo e entrega conforme a disponibilidade.' }
    ],
    validar: ['Confirmar CNPJ e razão social da unidade','Confirmar disponibilidade da linha de agronegócio (arames rurais) na unidade','Confirmar ano exato de fundação da unidade']
  },

  'jacical': {
    pageSlug: 'jacical', marcaSlug: 'jacical', unidadeKey: 'jales',
    seo: {
      title: 'Material de Construção, Aço e Coberturas em Jales/SP | Jacical — Grupo Vocical',
      description: 'Jacical Jales: cimento, aço, vergalhão, coberturas, serralheria e corte e dobra conforme projeto. Atendimento B2B em construção, indústria e serralheria.',
      canonical: 'https://grupovocical.com.br/marcas/jacical.html'
    },
    hero: {
      kicker: 'Jales/SP',
      h1: 'Material de construção, aço e <span class="accent">coberturas</span> em Jales',
      lede: 'A unidade de Jales do Grupo Vocical, com localização estratégica para o atendimento regional e forte atuação em construção, indústria e serralheria. Da obra básica aos projetos estruturais.',
      selos: ['Desde 1988', 'Localização estratégica', 'Construção, indústria e serralheria', 'Corte e dobra sob medida']
    },
    numeros: [ { n: 1988, suf: '', label: 'Em atividade desde' }, { n: 5, suf: '', label: 'Linhas de produto' } ],
    sobre: {
      titulo: 'Tradição e localização <span class="accent">estratégica</span> em Jales',
      paras: [
        'A Jacical é a unidade de Jales e iniciou suas atividades no fim da década de 1980, com cimento e cal. Sua localização é estratégica para o atendimento regional.',
        'A unidade tem forte atuação em construção, indústria e serralheria, reunindo materiais, soluções sob medida e atendimento próximo, da obra básica aos projetos estruturais.'
      ],
      foto: 'Imagens/jacical/sobre.jpg',
      fotoAlt: 'Estrutura da Jacical em Jales, distribuidora de material de construção, aço e coberturas do Grupo Vocical'
    },
    segmentos: ['Construtoras e empreiteiras','Serralherias e metalúrgicas','Indústrias','Lojistas e revendas','Profissionais e consumidor final'],
    categorias: ['materiais-de-construcao','aco','estruturais','coberturas','agronegocio'],
    categoriasNota: '',
    servicos: [
      { t: 'Corte e dobra de vergalhão', d: 'Aço armado conforme o projeto: colunas, vigas, sapatas, estribos e peças especiais, com conferência das medidas e etiquetagem por etapa da obra.', beneficios: ['Menos desperdício no canteiro','Menos retrabalho','Peças identificadas por posição','Mais controle das concretagens'] },
      { t: 'Corte e dobra de chapas', d: 'Chapas sob medida, perfis e componentes metálicos para serralherias, metalúrgicas e indústria, prontos para solda ou montagem.', beneficios: ['Precisão dimensional','Padronização das peças','Menos ajuste manual','Ganho de produtividade'] }
    ],
    diferenciais: ['Localização estratégica para a região','Mix amplo de construção a serralheria','Forte relacionamento regional','Atendimento a construção, indústria e serralheria','Serviço de corte e dobra'],
    galeria: ['Imagens/jacical/jacical1.jpg','Imagens/jacical/jacical2.jpg','Imagens/jacical/jacical3.jpg','Imagens/jacical/jacical4.jpg','Imagens/jacical/jacical5.jpg','Imagens/jacical/jacical6.jpg'],
    atuacao: { texto: 'Atende Jales e região, com localização estratégica e apoio comercial para construção, indústria e serralheria.', frota: 'Entrega programada conforme a disponibilidade da unidade.' },
    faq: [
      { q: 'Onde comprar material de construção em Jales?', a: 'A Jacical fornece cimento, cal, argamassa, rejunte, impermeabilizantes e telhas de fibrocimento em Jales, além de aço, estruturais e coberturas. Fale com o comercial para orçamento.' },
      { q: 'Onde comprar vergalhão e aço em Jales?', a: 'A Jacical trabalha com vergalhões, colunas, treliças, tela soldada, malha POP e arames, além de corte e dobra de vergalhão conforme o projeto.' },
      { q: 'A Jacical faz corte e dobra de aço e de chapas em Jales?', a: 'Sim. A unidade produz aço armado conforme o projeto e faz corte e dobra de chapas para serralherias, metalúrgicas e indústria.' },
      { q: 'A Jacical atende serralherias e indústrias em Jales e região?', a: 'Sim. Além do material de construção, fornece barras, cantoneiras, chapas, tubos metalon, perfis e acessórios para serralheria e indústria.' },
      { q: 'A Jacical vende para empresas e para consumidor final?', a: 'Sim. O atendimento é preparado para empresas, profissionais e consumidor final, com entrega conforme a disponibilidade da unidade.' }
    ],
    validar: ['Confirmar CNPJ e razão social da unidade','Confirmar disponibilidade da linha de agronegócio (arames rurais) na unidade','Confirmar ano exato de início das atividades']
  },

  'ello-forte-ribeirao-preto': {
    pageSlug: 'ello-forte-ribeirao-preto', marcaSlug: 'ello-forte', unidadeKey: 'ribeirao-preto',
    seo: {
      title: 'Material de Construção, Aço e Coberturas em Ribeirão Preto/SP | Ello Forte — Grupo Vocical',
      description: 'Ello Forte Ribeirão Preto: cimento, aço, vergalhão, coberturas, serralheria e corte e dobra. Estrutura de cerca de 7.000 m² para obras e empresas.',
      canonical: 'https://grupovocical.com.br/marcas/ello-forte-ribeirao-preto.html'
    },
    hero: {
      kicker: 'Ribeirão Preto/SP',
      h1: 'Material de construção, aço e <span class="accent">serralheria</span> em Ribeirão Preto',
      lede: 'Sob gestão do Grupo Vocical desde 2009, a Ello Forte Ribeirão Preto une estrutura ampliada, variedade e proximidade com o cliente para atender obras, construtoras, profissionais e empresas da região.',
      selos: ['Sob gestão Vocical desde 2009', 'Cerca de 7.000 m²', 'Construção e serralheria', 'Corte e dobra de vergalhão']
    },
    numeros: [ { n: 2009, suf: '', label: 'Sob gestão Vocical desde' }, { n: 7000, suf: ' m²', label: 'Área total aprox.' }, { n: 4, suf: '', label: 'Linhas de produto' } ],
    sobre: {
      titulo: 'Estrutura que cresceu com a <span class="accent">região</span>',
      paras: [
        'O Grupo Vocical assumiu as atividades da Ello Forte Ribeirão Preto em outubro de 2009. No início, a unidade tinha cerca de 700 m² de galpão e área total de 3.500 m².',
        'Depois passou a contar com galpão de cerca de 2.500 m² e área total próxima de 7.000 m², incorporando novas linhas para construção, estrutura e serralheria e ampliando o atendimento a obras e empresas.'
      ],
      foto: 'Imagens/Ello Forte RP/sobre1.jpg',
      fotoAlt: 'Estrutura da Ello Forte em Ribeirão Preto, distribuidora de material de construção, aço e serralheria do Grupo Vocical'
    },
    segmentos: ['Construtoras e incorporadoras','Serralherias e metalúrgicas','Profissionais e obras','Empresas e indústria','Lojistas e revendas'],
    categorias: ['materiais-de-construcao','aco','estruturais','coberturas'],
    categoriasNota: '',
    servicos: [
      { t: 'Corte e dobra de vergalhão', d: 'Produção de aço armado conforme o projeto estrutural: colunas, vigas, sapatas, estribos e peças especiais, com conferência e etiquetagem por etapa da obra.', beneficios: ['Menos desperdício de aço','Menos retrabalho e mão de obra','Peças identificadas por posição','Mais previsibilidade nas concretagens'] }
    ],
    diferenciais: ['Estrutura ampliada, cerca de 7.000 m²','Força regional em Ribeirão Preto','Portfólio de construção, estrutural e serralheria','Serviço de corte e dobra de vergalhão'],
    galeria: ['Imagens/Ello Forte RP/elloforterp1.jpg','Imagens/Ello Forte RP/elloforterp2.jpg','Imagens/Ello Forte RP/elloforterp3.jpg','Imagens/Ello Forte RP/elloforterp4.jpg','Imagens/Ello Forte RP/elloforterp5.jpg','Imagens/Ello Forte RP/elloforterp6.jpg'],
    atuacao: { texto: 'Atende Ribeirão Preto e região, com estrutura ampliada e apoio comercial para obras, construtoras, profissionais e empresas.', frota: 'Entrega programada conforme a disponibilidade da unidade.' },
    faq: [
      { q: 'Onde comprar material de construção em Ribeirão Preto?', a: 'A Ello Forte Ribeirão Preto fornece cimento, cal, argamassa, rejunte, impermeabilizantes e telhas de fibrocimento, além de aço, estruturais e coberturas. Fale com o comercial para orçamento.' },
      { q: 'Onde comprar vergalhão e aço em Ribeirão Preto?', a: 'A unidade trabalha com vergalhões, colunas, treliças, tela soldada, malha POP e arames, além de corte e dobra de vergalhão conforme o projeto.' },
      { q: 'A Ello Forte faz corte e dobra de vergalhão em Ribeirão Preto?', a: 'Sim. A unidade produz aço armado conforme o projeto, com colunas, vigas, sapatas e estribos, além de conferência e etiquetagem das peças.' },
      { q: 'A Ello Forte Ribeirão Preto atende serralherias?', a: 'Sim. Além do material de construção, fornece barras, cantoneiras, chapas, tubos metalon, perfis e acessórios para serralheria e estruturas.' },
      { q: 'A Ello Forte atende construtoras e empresas na região?', a: 'Sim. O atendimento é preparado para construtoras, profissionais e empresas, com apoio no quantitativo e entrega conforme a disponibilidade.' }
    ],
    validar: ['Confirmar CNPJ e razão social da unidade','Confirmar mix atual de coberturas na unidade','Confirmar disponibilidade de corte e dobra de chapas na unidade']
  },

  'ello-forte-sao-carlos': {
    pageSlug: 'ello-forte-sao-carlos', marcaSlug: 'ello-forte', unidadeKey: 'sao-carlos',
    seo: {
      title: 'Material de Construção e Aço em São Carlos/SP | Ello Forte — Grupo Vocical',
      description: 'Ello Forte São Carlos: cimento, cal, aço e vergalhão para obras da região. Estrutura de mais de 8.000 m² e atendimento B2B do Grupo Vocical.',
      canonical: 'https://grupovocical.com.br/marcas/ello-forte-sao-carlos.html'
    },
    hero: {
      kicker: 'São Carlos/SP',
      h1: 'Material de construção e <span class="accent">aço</span> em São Carlos',
      lede: 'Criada em 2012 para estar mais perto das obras e dos profissionais da região, a Ello Forte São Carlos reúne ampla estrutura, atendimento próximo e produtos para diferentes etapas da construção.',
      selos: ['Desde 2012', 'Mais de 8.000 m²', 'Atendimento B2B', 'Entrega programada']
    },
    numeros: [ { n: 2012, suf: '', label: 'Desde' }, { n: 8000, suf: ' m²', label: 'Estrutura' } ],
    sobre: {
      titulo: 'Mais perto das obras da <span class="accent">região</span>',
      paras: [
        'A Ello Forte São Carlos foi criada em 2012 para ampliar o atendimento regional, com estrutura de mais de 8.000 m².',
        'A unidade nasceu para estar mais perto das obras e dos profissionais, com atendimento próximo e produtos para diferentes etapas da construção, ajudando cada projeto a avançar com segurança e praticidade.'
      ],
      foto: 'Imagens/Ello Forte SC/sobre-ello-sc.jpg',
      fotoAlt: 'Estrutura da Ello Forte em São Carlos, distribuidora de material de construção e aço do Grupo Vocical'
    },
    segmentos: ['Construtoras e empreiteiras','Profissionais da construção','Obras residenciais e comerciais','Consumidor final'],
    categorias: ['materiais-de-construcao','aco'],
    categoriasNota: 'As linhas de estruturais, coberturas, serralheria e drywall são atendidas por outras unidades do grupo. Disponibilidade em São Carlos sob consulta.',
    servicos: [
      { t: 'Fornecimento programado para obras', d: 'Atendimento consultivo e fornecimento dos materiais essenciais da obra, com apoio no quantitativo e entrega programada conforme a região e a disponibilidade da unidade.', beneficios: ['Pedido centralizado','Apoio no quantitativo','Entrega programada conforme disponibilidade','Menos paradas na obra'] }
    ],
    diferenciais: ['Estrutura ampla, mais de 8.000 m²','Atendimento próximo às obras da região','Materiais para diferentes etapas da construção','Entrega programada'],
    galeria: [],
    atuacao: { texto: 'Atende São Carlos e região, com ampla estrutura e apoio comercial para obras, profissionais e empresas.', frota: 'Entrega programada conforme a região e a disponibilidade da unidade.' },
    faq: [
      { q: 'Onde comprar material de construção em São Carlos?', a: 'A Ello Forte São Carlos fornece cimento, cal, argamassa, rejunte, impermeabilizantes e telhas de fibrocimento em São Carlos, além de aço. Fale com o comercial para orçamento.' },
      { q: 'Onde comprar vergalhão e aço em São Carlos?', a: 'A unidade trabalha com vergalhões, colunas, treliças, tela soldada, malha POP e arames para obras da região.' },
      { q: 'A Ello Forte São Carlos entrega na região?', a: 'Sim. A unidade trabalha com entrega programada conforme a região e a disponibilidade. Combine prazos e volumes com o comercial.' },
      { q: 'A Ello Forte São Carlos vende para empresas e profissionais?', a: 'Sim. O atendimento é preparado para construtoras, profissionais e consumidor final, com apoio no quantitativo da obra.' },
      { q: 'A unidade de São Carlos trabalha com estruturais, coberturas, serralheria e drywall?', a: 'Essas linhas são atendidas por outras unidades do Grupo Vocical. Em São Carlos, a disponibilidade é sob consulta com o comercial.' }
    ],
    validar: ['Confirmar CNPJ e razão social da unidade','Disponibilidade de coberturas e demais linhas (estruturais, serralheria, drywall) sob consulta na unidade','Confirmar disponibilidade de serviços de corte e dobra na unidade']
  },

  'robracon-cuiaba': {
    pageSlug: 'robracon-cuiaba', marcaSlug: 'robracon', unidadeKey: 'cuiaba',
    seo: {
      title: 'Material de Construção e Aço em Cuiabá/MT | Robracon — Grupo Vocical',
      description: 'Robracon Cuiabá: cimento, cal, aço, vergalhão e materiais essenciais para obras em Cuiabá e região. Atendimento B2B do Grupo Vocical no Mato Grosso.',
      canonical: 'https://grupovocical.com.br/marcas/robracon-cuiaba.html'
    },
    hero: {
      kicker: 'Cuiabá/MT',
      h1: 'Material de construção e <span class="accent">aço</span> em Cuiabá',
      lede: 'A Robracon em Cuiabá oferece uma base sólida de materiais para obras, profissionais e empresas. Integrada ao Grupo Vocical, combina atendimento regional com experiência em distribuição.',
      selos: ['Grupo Vocical no MT', 'Construção e aço', 'Atendimento B2B', 'Entrega regional']
    },
    numeros: [ { n: 1987, suf: '', label: 'Grupo Vocical desde' }, { n: 11, suf: '', label: 'Unidades em SP e MT' } ],
    sobre: {
      titulo: 'Base sólida de materiais na <span class="accent">capital</span>',
      paras: [
        'A Robracon Cuiabá foi criada para ampliar a cobertura do Grupo na capital e região.',
        'Integrada à estrutura do Grupo Vocical, a unidade combina atendimento regional, experiência em distribuição e produtos fundamentais para a construção, atendendo obras, profissionais e empresas.'
      ],
      foto: 'Imagens/Robracon CBA/capa-robracon-cba.jpg',
      fotoAlt: 'Robracon Cuiabá, distribuidora de material de construção e aço do Grupo Vocical em Cuiabá MT'
    },
    segmentos: ['Construtoras e empreiteiras','Empresas e profissionais','Obras residenciais e comerciais','Consumidor final'],
    categorias: ['materiais-de-construcao','aco'],
    categoriasNota: 'As linhas de coberturas, serralheria e drywall são da Robracon Rondonópolis e demais unidades. Disponibilidade em Cuiabá sob consulta.',
    servicos: [
      { t: 'Fornecimento e atendimento regional', d: 'Fornecimento dos materiais essenciais da obra, com atendimento consultivo e entrega regional conforme a disponibilidade da unidade.', beneficios: ['Pedido centralizado','Materiais fundamentais da obra','Atendimento próximo em Cuiabá','Entrega regional conforme disponibilidade'] }
    ],
    diferenciais: ['Base sólida de materiais em Cuiabá','Integração à estrutura do Grupo Vocical','Experiência em distribuição','Atendimento regional'],
    galeria: ['Imagens/Robracon ROO/robracon1 (3).png','Imagens/Robracon ROO/robracon1 (4).png','Imagens/Robracon ROO/robracon1 (5).png','Imagens/Robracon ROO/robracon1 (6).png','Imagens/Robracon ROO/robracon1 (7).png','Imagens/Robracon ROO/robracon1 (8).png'],
    atuacao: { texto: 'Atende Cuiabá e região, com atendimento regional e apoio comercial para obras, empresas e consumidor final.', frota: 'Entrega regional conforme a disponibilidade da unidade.' },
    faq: [
      { q: 'Onde comprar material de construção em Cuiabá?', a: 'A Robracon Cuiabá fornece cimento, cal, argamassa, rejunte, impermeabilizantes e telhas de fibrocimento em Cuiabá, além de aço. Fale com o comercial para orçamento.' },
      { q: 'Onde comprar vergalhão e aço em Cuiabá?', a: 'A unidade trabalha com vergalhões, colunas, treliças, tela soldada, malha POP e arames para obras de Cuiabá e região.' },
      { q: 'A Robracon Cuiabá atende construtoras e empresas?', a: 'Sim. O atendimento é preparado para construtoras, empreiteiras, empresas e consumidor final, com apoio no quantitativo da obra.' },
      { q: 'A Robracon Cuiabá trabalha com coberturas, serralheria ou drywall?', a: 'Essas linhas são da Robracon Rondonópolis e de outras unidades do grupo. Em Cuiabá, a disponibilidade é sob consulta com o comercial.' },
      { q: 'A Robracon Cuiabá entrega na região?', a: 'Sim. A unidade trabalha com entrega regional conforme a disponibilidade. Combine prazos e volumes com o comercial.' }
    ],
    validar: ['Confirmar CNPJ e razão social da unidade','Mix completo além de construção e aço (coberturas, serralheria, drywall) sob consulta na unidade','Confirmar ano de fundação e serviços especializados disponíveis','Confirmar regiões atendidas']
  },

  'robracon-sinop': {
    pageSlug: 'robracon-sinop', marcaSlug: 'robracon', unidadeKey: 'sinop',
    seo: {
      title: 'Material de Construção e Aço em Sinop/MT | Robracon — Grupo Vocical',
      description: 'Robracon Sinop: cimento, cal, aço, vergalhão e materiais para obras, indústria e agronegócio em Sinop/MT. Atendimento regional do Grupo Vocical no Mato Grosso.',
      canonical: 'https://grupovocical.com.br/marcas/robracon-sinop.html'
    },
    hero: {
      kicker: 'Sinop/MT',
      h1: 'Material de construção e <span class="accent">aço</span> em Sinop',
      lede: 'A Robracon Sinop leva a experiência do Grupo Vocical para uma das regiões que mais crescem no Mato Grosso, com produtos fundamentais para obras, empresas e agronegócio.',
      selos: ['Grupo Vocical no MT', 'Construção, aço e agronegócio', 'Atendimento regional', 'Entrega programada']
    },
    numeros: [ { n: 1987, suf: '', label: 'Grupo Vocical desde' }, { n: 11, suf: '', label: 'Unidades em SP e MT' } ],
    sobre: {
      titulo: 'A experiência do grupo em uma região que <span class="accent">cresce</span>',
      paras: [
        'A Robracon Sinop é uma das unidades mais recentes da expansão do Grupo no Mato Grosso, próxima a mercados de construção, indústria, logística e agronegócio.',
        'A unidade oferece produtos fundamentais para obras e estruturas, apoiando profissionais, empresas e empreendimentos que movimentam o desenvolvimento regional.'
      ],
      foto: 'Imagens/Robracon SNP/sobre-robracon-snp.jpg',
      fotoAlt: 'Robracon Sinop, distribuidora de material de construção e aço do Grupo Vocical em Sinop MT'
    },
    segmentos: ['Construtoras e empreiteiras','Indústria e logística','Agronegócio','Profissionais e empresas','Consumidor final'],
    categorias: ['materiais-de-construcao','aco'],
    categoriasNota: 'As linhas de coberturas, serralheria e drywall são da Robracon Rondonópolis e demais unidades. Disponibilidade em Sinop sob consulta.',
    servicos: [
      { t: 'Fornecimento para obras, empresas e agronegócio', d: 'Fornecimento dos materiais essenciais para obras e estruturas, com atendimento regional e entrega conforme a disponibilidade da unidade.', beneficios: ['Materiais fundamentais da obra','Atendimento próximo em Sinop','Apoio a empresas e agronegócio','Entrega conforme disponibilidade'] }
    ],
    diferenciais: ['Presença em uma região que mais cresce no MT','Proximidade de construção, indústria, logística e agronegócio','Experiência do Grupo Vocical','Atendimento regional'],
    galeria: ['Imagens/Robracon ROO/robracon1 (9).png','Imagens/Robracon ROO/robracon1 (10).png','Imagens/Robracon ROO/robracon1 (11).png','Imagens/Robracon ROO/robracon1 (12).png','Imagens/Robracon ROO/robracon1 (13).png','Imagens/Robracon ROO/robracon1 (14).png'],
    atuacao: { texto: 'Atende Sinop e região, com atendimento regional e apoio comercial para obras, empresas e agronegócio.', frota: 'Entrega programada conforme a disponibilidade da unidade.' },
    faq: [
      { q: 'Onde comprar material de construção em Sinop?', a: 'A Robracon Sinop fornece cimento, cal, argamassa, rejunte, impermeabilizantes e telhas de fibrocimento em Sinop, além de aço. Fale com o comercial para orçamento.' },
      { q: 'Onde comprar vergalhão e aço em Sinop?', a: 'A unidade trabalha com vergalhões, colunas, treliças, tela soldada, malha POP e arames para obras de Sinop e região.' },
      { q: 'A Robracon Sinop atende agronegócio e empresas?', a: 'Sim. A unidade está próxima de mercados de agronegócio, indústria e logística, e atende profissionais, empresas e empreendimentos da região.' },
      { q: 'A Robracon Sinop trabalha com coberturas, serralheria ou drywall?', a: 'Essas linhas são da Robracon Rondonópolis e de outras unidades do grupo. Em Sinop, a disponibilidade é sob consulta com o comercial.' },
      { q: 'A Robracon Sinop entrega na região?', a: 'Sim. A unidade trabalha com entrega conforme a disponibilidade. Combine prazos e volumes com o comercial.' }
    ],
    validar: ['Confirmar CNPJ e razão social da unidade','Mix completo além de construção e aço (coberturas, serralheria, drywall) sob consulta na unidade','Confirmar ano de fundação e serviços especializados disponíveis','Confirmar regiões atendidas']
  }
};
