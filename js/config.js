/* Configuração global do site Grupo Vocical — fonte de dados única.
   Trocar CTA_URL aqui quando o widget definitivo entrar (um só ponto). */
window.VOCICAL = {
  CTA_URL: 'https://grupovocical.com.br/produtos/?utm_content=meutrack_533fa7c4ec8b',
  /* Endpoint do formulário Trabalhe Conosco (handler PHP na erehost).
     Ponto único de troca; o roteamento por unidade vive no PHP, não aqui. */
  FORM_ENDPOINT: 'enviar-trabalhe-conosco.php',
  WHATSAPP: 'https://wa.me/5566999393953',
  WHATSAPP_LABEL: '(66) 99939-3953',
  EMAIL: 'contato@grupovocical.com.br',
  RAZAO_SOCIAL: 'Vocical Distribuidora Votuporanga de Cimento e Cal LTDA',
  CNPJ: '57.761.827/0001-35',
  SOCIAL: {
    instagram: 'https://instagram.com/grupo.vocical',
    facebook: 'https://facebook.com/grupovocical',
    linkedin: 'https://www.linkedin.com/company/grupo-vocical'
  },

  /* Marcas do grupo (6). Cada uma agrupa 1+ unidades. */
  MARCAS: [
    {
      slug: 'vocical', nome: 'Vocical', uf: 'SP',
      logo: 'Imagens/Logos Unidades/Vocical/vocical---preto.png',
      logoBranco: 'Imagens/Logos Unidades/Vocical/vocical---branco.png',
      capaFoto: 'Imagens/vocical.jpg',
      fachada: 'Imagens/vocical.jpg',
      unidades: [
        { cidade: 'Votuporanga', uf: 'SP', key: 'votuporanga', matriz: true, logoPin: 'Imagens/Logos Unidades/Vocical/logo-vocical---transparente.png', endereco: 'Avenida Prestes Maia, 2059', telefone: '(17) 3411-1010', email: 'vendas.vocical@grupovocical.com.br', fachada: 'Imagens/vocical.jpg' }
      ]
    },
    {
      slug: 'jacical', nome: 'Jacical', uf: 'SP',
      logo: 'Imagens/Logos Unidades/Jacical/logo-jacical---preto.png',
      logoBranco: 'Imagens/Logos Unidades/Jacical/logo-jacical---branco.png',
      capaFoto: 'Imagens/jacical-capa.jpg',
      fachada: 'Imagens/jacical-capa.jpg',
      unidades: [
        { cidade: 'Jales', uf: 'SP', key: 'jales', logoPin: 'Imagens/Logos Unidades/Jacical/Logo-Jacical---Transparente.png', endereco: 'R. Silvio Alves Balbino, 525 - Parque Industrial II', telefone: '(17) 3624-3430', email: 'vendas.jacical@grupovocical.com.br', fachada: 'Imagens/jacical-capa.jpg' }
      ]
    },
    {
      slug: 'ello-forte', nome: 'Ello Forte', uf: 'SP',
      logo: 'Imagens/Logos Unidades/Ello Forte Ribeirao Preto/ello-forte-RP---preto.png',
      logoBranco: 'Imagens/Logos Unidades/Ello Forte Ribeirao Preto/ello-forte-RP---branco.png',
      capaFoto: 'Imagens/Ello Forte RP/capa-lo.jpg',
      fachada: 'Imagens/Ello Forte RP/capa-lo.jpg',
      unidades: [
        { cidade: 'Ribeirão Preto', uf: 'SP', key: 'ribeirao-preto', logoPin: 'Imagens/Logos Unidades/Ello Forte Ribeirao Preto/ello-forte-RP---transparente.png', endereco: 'Av. Thomaz Alberto Whately, 5105 - Jardim Aeroporto', telefone: '(16) 3969-4242', email: 'vendas.vendas11.elloforterp@grupovocical.com.br', fachada: 'Imagens/Ello Forte RP/capa-lo.jpg' },
        { cidade: 'São Carlos', uf: 'SP', key: 'sao-carlos', logoPin: 'Imagens/Logos Unidades/Ello Forte Sao Carlos/ello-forte---fundo-transparente.png', endereco: 'Av. João Orlando Ruggiero, 6201 - Jardim Embaré', telefone: '(16) 3374-4000', email: 'vendas.ellofortesc@grupovocical.com.br', fachada: 'Imagens/Ello Forte SC/banner-ello-sc.jpg' }
      ]
    },
    {
      slug: 'rp-cimento-cal', nome: 'Rio Preto Cimento e Cal', uf: 'SP',
      logo: 'Imagens/Logos Unidades/Rio Preto Cimento e Cal/logo-rio-preto---transparente.png',
      logoBranco: 'Imagens/Logos Unidades/Rio Preto Cimento e Cal/logo-rio-preto---transparente.png',
      capaFoto: 'Imagens/back3.jpg',
      fachada: 'Imagens/back3.jpg',
      pendenteConteudo: true,
      // Contato direto: RP tem canal próprio, todos os botões vão para a LP deles.
      siteExterno: 'https://rpcimentoecal.com.br/lp/',
      unidades: [
        { cidade: 'São José do Rio Preto', uf: 'SP', key: 'rio-preto', pendente: true, siteExterno: 'https://rpcimentoecal.com.br/lp/', logoPin: 'Imagens/Logos Unidades/Rio Preto Cimento e Cal/logo-rio-preto---transparente.png', endereco: '', telefone: '', email: '', fachada: 'Imagens/back3.jpg' }
      ]
    },
    {
      slug: 'robracon', nome: 'Robracon', uf: 'MT',
      logo: 'Imagens/Logos Unidades/Robracon/ROBRACON---COLORIDO.png',
      logoBranco: 'Imagens/Logos Unidades/Robracon/ROBRACON---BRANCO.png',
      capaFoto: 'Imagens/Robracon CBA/capa-robracon-cba.jpg',
      fachada: 'Imagens/Robracon CBA/capa-robracon-cba.jpg',
      unidades: [
        { cidade: 'Cuiabá', uf: 'MT', key: 'cuiaba', nomeExib: 'Robracon Cuiabá', logoPin: 'Imagens/Logos Unidades/Robracon/ROBRACON---COLORIDO.png', endereco: 'Rua B, 818 - Distrito Industrial', telefone: '(65) 3666-0332', email: 'vendas.robracon@grupovocical.com.br', fachada: 'Imagens/Robracon CBA/capa-robracon-cba.jpg' },
        { cidade: 'Rondonópolis', uf: 'MT', key: 'rondonopolis', nomeExib: 'Robracon Rondonópolis', logoPin: 'Imagens/Logos Unidades/Robracon/ROBRACON---COLORIDO.png', endereco: 'Av. Josefa Machado de Rezende, 2999 - Parque Sagrada Família', telefone: '(66) 3422-8878', email: 'vendas.robracon@grupovocical.com.br', fachada: 'Imagens/Robracon ROO/capa-robracon-roo.jpg' },
        { cidade: 'Sinop', uf: 'MT', key: 'sinop', nomeExib: 'Robracon Sinop', logoPin: 'Imagens/Logos Unidades/Robracon/ROBRACON---COLORIDO.png', endereco: 'R. João Pedro Moreira de Carvalho, 2357 - Jardim Jacarandás', telefone: '(66) 3029-9659', email: 'vendas.robracon@grupovocical.com.br', fachada: 'Imagens/Robracon SNP/capa-robracon-snp.jpg' }
      ]
    },
    {
      slug: 'distribuidoras', nome: 'Distribuidoras', uf: 'SP',
      logo: 'Imagens/Logos Unidades/Vocical/vocical---preto.png',
      logoBranco: 'Imagens/Logos Unidades/Vocical/vocical---branco.png',
      capaFoto: 'Imagens/Distribuidoras/capa-distribuidoras.jpg',
      fachada: 'Imagens/Distribuidoras/capa-distribuidoras.jpg',
      unidades: [
        { cidade: 'Itu', uf: 'SP', key: 'itu', nomeExib: 'Distribuidora Ituana', logoPin: 'Imagens/Logos Unidades/Distribuidoras/Ituana/logo-ituana-transparente.png', endereco: 'R. Remígio Fragnani - Nossa Sra. Aparecida', telefone: '(11) 4022-5207', email: 'vendas.itu@grupovocical.com.br' },
        { cidade: 'Piracicaba', uf: 'SP', key: 'piracicaba', nomeExib: 'Distribuidora Piracicabana', logoPin: 'Imagens/Logos Unidades/Distribuidoras/Piracicabana/logo-piracicabana-transparente.png', endereco: 'Av. 31 de Março, 763 - Paulicéia', telefone: '(19) 99214-5313', email: 'vendas.piracicaba@grupovocical.com.br' },
        { cidade: 'Itapetininga', uf: 'SP', key: 'itapetininga', nomeExib: 'Distribuidora Itapetininga', logoPin: 'Imagens/Logos Unidades/Distribuidoras/Itapetininga/logo-itapetininga-transparente.png', endereco: 'R. Moisés Nalesso, 5500 - Vila São Gonçalo', telefone: '(15) 3272-1534', email: 'vendas.itapetininga@grupovocical.com.br' }
      ]
    }
  ],

  /* Categorias de produto (igual ao site atual). */
  CATEGORIAS: [
    { slug: 'materiais-de-construcao', nome: 'Materiais de Construção', desc: 'Cimento, cal, argamassas, tubos, conexões, caixas d’água e louças.', img: 'Imagens/materiais-de-construcao.jpg' },
    { slug: 'aco', nome: 'Aço Construção Civil', desc: 'Vergalhões, telas, treliças, colunas, sapatas e estribos.', img: 'Imagens/corte-e-dobra-de-vergalhao.png' },
    { slug: 'estruturais', nome: 'Estruturais e Serralheria', desc: 'Metalon, perfis, chapas, cantoneiras e barras chatas.', img: 'Imagens/serralheria.jpg' },
    { slug: 'coberturas', nome: 'Coberturas', desc: 'Telhas galvalume, termoacústicas, fibrocimento e transparentes.', img: 'Imagens/Produtos/TELHAS.jpg' },
    { slug: 'drywall', nome: 'Drywall', desc: 'Placas ST, RU e Glasroc, perfis, gesso e acessórios.', img: 'Imagens/drywall.jpg' },
    { slug: 'agronegocio', nome: 'Agronegócio', desc: 'Arames farpados e ovalados galvanizados para cercas.', img: 'Imagens/Produtos/arame-farpado.jpg' }
  ],

  /* Unidades para o dropdown do header (11 unidades, logo transparente de cada). */
  UNIDADES_NAV: [
    { nome: 'Vocical',                    cidade: 'Votuporanga/SP',           slug: 'vocical',        logo: 'Imagens/Logos Unidades/Vocical/logo-vocical---transparente.png' },
    { nome: 'Jacical',                    cidade: 'Jales/SP',                 slug: 'jacical',        logo: 'Imagens/Logos Unidades/Jacical/Logo-Jacical---Transparente.png' },
    { nome: 'Ello Forte',                 cidade: 'Ribeirão Preto/SP',        slug: 'ello-forte',     logo: 'Imagens/Logos Unidades/Ello Forte Ribeirao Preto/ello-forte-RP---transparente.png' },
    { nome: 'Ello Forte',                 cidade: 'São Carlos/SP',            slug: 'ello-forte',     logo: 'Imagens/Logos Unidades/Ello Forte Sao Carlos/ello-forte---fundo-transparente.png' },
    { nome: 'Rio Preto Cimento e Cal',    cidade: 'São José do Rio Preto/SP', slug: 'rp-cimento-cal', siteExterno: 'https://rpcimentoecal.com.br/lp/', logo: 'Imagens/Logos Unidades/Rio Preto Cimento e Cal/logo-rio-preto---transparente.png' },
    { nome: 'Robracon',                   cidade: 'Cuiabá/MT',                slug: 'robracon',       logo: 'Imagens/Logos Unidades/Robracon/ROBRACON---COLORIDO.png' },
    { nome: 'Robracon',                   cidade: 'Rondonópolis/MT',          slug: 'robracon',       logo: 'Imagens/Logos Unidades/Robracon/ROBRACON---COLORIDO.png' },
    { nome: 'Robracon',                   cidade: 'Sinop/MT',                 slug: 'robracon',       logo: 'Imagens/Logos Unidades/Robracon/ROBRACON---COLORIDO.png' },
    { nome: 'Distribuidora Ituana',       cidade: 'Itu/SP',                   slug: 'distribuidoras', logo: 'Imagens/Logos Unidades/Distribuidoras/Ituana/logo-ituana-transparente.png' },
    { nome: 'Distribuidora Piracicabana', cidade: 'Piracicaba/SP',            slug: 'distribuidoras', logo: 'Imagens/Logos Unidades/Distribuidoras/Piracicabana/logo-piracicabana-transparente.png' },
    { nome: 'Distribuidora Itapetininga', cidade: 'Itapetininga/SP',          slug: 'distribuidoras', logo: 'Imagens/Logos Unidades/Distribuidoras/Itapetininga/logo-itapetininga-transparente.png' }
  ],

  /* Fornecedores parceiros. */
  PARCEIROS: [
    { nome: 'Gerdau', logo: 'Imagens/Marcas/gerdau.png' },
    { nome: 'ArcelorMittal', logo: 'Imagens/Marcas/arcellor-mittal.png' },
    { nome: 'CSN Siderúrgica', logo: 'Imagens/Marcas/csn-ciderurgica.png' },
    { nome: 'CSN Cimentos', logo: 'Imagens/Marcas/csn-cimentos.png' },
    { nome: 'Votorantim Cimentos', logo: 'Imagens/Marcas/votorantim-cimentos.png' },
    { nome: 'Usiminas', logo: 'Imagens/Marcas/usiminas.png' },
    { nome: 'Brasilit', logo: 'Imagens/Marcas/brasilit.png' },
    { nome: 'Placo', logo: 'Imagens/Marcas/placo.png' },
    { nome: 'Quartzolit', logo: 'Imagens/Marcas/quartzolit.png' }
  ]
};
