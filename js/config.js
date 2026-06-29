/* Configuração global do site Grupo Vocical — fonte de dados única.
   Trocar CTA_URL aqui quando o widget definitivo entrar (um só ponto). */
window.VOCICAL = {
  CTA_URL: 'https://grupovocical.com.br/produtos/?utm_content=meutrack_533fa7c4ec8b',
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
      capa: 'Imagens/Vocical',
      unidades: [
        { cidade: 'Votuporanga', uf: 'SP', endereco: 'Avenida Prestes Maia, 2059', telefone: '(17) 3411-1010', email: 'vendas.vocical@grupovocical.com.br' }
      ]
    },
    {
      slug: 'jacical', nome: 'Jacical', uf: 'SP',
      logo: 'Imagens/Logos Unidades/Jacical/logo-jacical---preto.png',
      logoBranco: 'Imagens/Logos Unidades/Jacical/logo-jacical---branco.png',
      capa: 'Imagens/Jacical',
      unidades: [
        { cidade: 'Jales', uf: 'SP', endereco: 'R. Silvio Alves Balbino, 525 - Parque Industrial II', telefone: '(17) 3624-3430', email: 'vendas.jacical@grupovocical.com.br' }
      ]
    },
    {
      slug: 'ello-forte', nome: 'Ello Forte', uf: 'SP',
      logo: 'Imagens/Logos Unidades/Ello Forte Ribeirao Preto/ello-forte-RP---preto.png',
      logoBranco: 'Imagens/Logos Unidades/Ello Forte Ribeirao Preto/ello-forte-RP---branco.png',
      capa: 'Imagens/Ello Forte RP',
      unidades: [
        { cidade: 'Ribeirão Preto', uf: 'SP', endereco: 'Av. Thomaz Alberto Whately, 5105 - Jardim Aeroporto', telefone: '(16) 3969-4242', email: 'vendas.vendas11.elloforterp@grupovocical.com.br' },
        { cidade: 'São Carlos', uf: 'SP', endereco: 'Av. João Orlando Ruggiero, 6201 - Jardim Embaré', telefone: '(16) 3374-4000', email: 'vendas.ellofortesc@grupovocical.com.br' }
      ]
    },
    {
      slug: 'rp-cimento-cal', nome: 'Rio Preto Cimento e Cal', uf: 'SP',
      logo: 'Imagens/Logos Unidades/Rio Preto Cimento e Cal/logo-rio-preto---transparente.png',
      logoBranco: 'Imagens/Logos Unidades/Rio Preto Cimento e Cal/logo-rio-preto---transparente.png',
      capa: 'Imagens/Vocical',
      pendenteConteudo: true,
      unidades: [
        { cidade: 'São José do Rio Preto', uf: 'SP', endereco: '', telefone: '', email: '' }
      ]
    },
    {
      slug: 'robracon', nome: 'Robracon', uf: 'MT',
      logo: 'Imagens/Logos Unidades/Robracon/ROBRACON---COLORIDO.png',
      logoBranco: 'Imagens/Logos Unidades/Robracon/ROBRACON---BRANCO.png',
      capa: 'Imagens/Robracon CBA',
      unidades: [
        { cidade: 'Cuiabá', uf: 'MT', endereco: 'Rua B, 818 - Distrito Industrial', telefone: '(65) 3666-0332', email: 'vendas.robracon@grupovocical.com.br' },
        { cidade: 'Rondonópolis', uf: 'MT', endereco: 'Av. Josefa Machado de Rezende, 2999 - Parque Sagrada Família', telefone: '(66) 3422-8878', email: 'vendas.robracon@grupovocical.com.br' },
        { cidade: 'Sinop', uf: 'MT', endereco: 'R. João Pedro Moreira de Carvalho, 2357 - Jardim Jacarandás', telefone: '(66) 3029-9659', email: 'vendas.robracon@grupovocical.com.br' }
      ]
    },
    {
      slug: 'distribuidoras', nome: 'Distribuidoras', uf: 'SP',
      logo: 'Imagens/Logos Unidades/Vocical/vocical---preto.png',
      logoBranco: 'Imagens/Logos Unidades/Vocical/vocical---branco.png',
      capa: 'Imagens/Distribuidoras',
      unidades: [
        { cidade: 'Itu', uf: 'SP', endereco: 'R. Remígio Fragnani - Nossa Sra. Aparecida', telefone: '(11) 4022-5207', email: 'vendas.itu@grupovocical.com.br' },
        { cidade: 'Piracicaba', uf: 'SP', endereco: 'Av. 31 de Março, 763 - Paulicéia', telefone: '(19) 99214-5313', email: 'vendas.piracicaba@grupovocical.com.br' },
        { cidade: 'Itapetininga', uf: 'SP', endereco: 'R. Moisés Nalesso, 5500 - Vila São Gonçalo', telefone: '(15) 3272-1534', email: 'vendas.itapetininga@grupovocical.com.br' }
      ]
    }
  ],

  /* Categorias de produto (igual ao site atual). */
  CATEGORIAS: [
    { slug: 'materiais-de-construcao', nome: 'Materiais de Construção', desc: 'Cimento, cal, argamassas, tubos, conexões, caixas d’água e louças.', img: 'Imagens/materiais-de-construcao.jpg' },
    { slug: 'aco', nome: 'Aço Construção Civil', desc: 'Vergalhões, telas, treliças, colunas, sapatas e estribos.', img: 'Imagens/Produtos/tela-soldada.jpg' },
    { slug: 'estruturais', nome: 'Estruturais e Serralheria', desc: 'Metalon, perfis, chapas, cantoneiras e barras chatas.', img: 'Imagens/serralheria.jpg' },
    { slug: 'coberturas', nome: 'Coberturas', desc: 'Telhas galvalume, termoacústicas, fibrocimento e transparentes.', img: 'Imagens/Produtos/TELHAS.jpg' },
    { slug: 'drywall', nome: 'Drywall', desc: 'Placas ST, RU e Glasroc, perfis, gesso e acessórios.', img: 'Imagens/drywall.jpg' },
    { slug: 'agronegocio', nome: 'Agronegócio', desc: 'Arames farpados e ovalados galvanizados para cercas.', img: 'Imagens/Produtos/arame-farpado.jpg' }
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
