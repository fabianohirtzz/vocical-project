/* Catálogo mestre de produtos (igual ao site atual).
   Usado por produtos.html e, filtrado por categoria, pelas páginas de marca. */
window.CATALOGO = [
  {
    slug: 'materiais-de-construcao', nome: 'Materiais de Construção',
    img: 'Imagens/materiais-de-construcao.jpg',
    itens: [
      { nome: 'Sacarias', desc: 'Cimento, cal, argamassa, gesso e rejunte.' },
      { nome: 'Impermeabilizantes', desc: 'Aditivos para chapisco e argamassa, mantas líquidas e emulsões asfálticas.' },
      { nome: 'Tubos e Conexões', desc: 'Tubos soldáveis (20 a 60 mm), tubos para esgoto SN (DN 40 a 200), joelhos 90°, curvas 45°, T e reduções, luvas de correr, registros de esfera e adesivos para PVC.' },
      { nome: 'Caixas d’água', desc: 'Caixas d’água, tanques, cisternas, biodigestores e acessórios (tampas, flanges, boias) em diferentes capacidades.' },
      { nome: 'Louças', desc: 'Assentos, caixas acopladas, lavatórios, cubas e tanques.' }
    ]
  },
  {
    slug: 'aco', nome: 'Aço Construção Civil',
    img: 'Imagens/corte-e-dobra-de-vergalhao.png',
    itens: [
      { nome: 'Vergalhões', desc: 'Barras de 12m do CA50 (6,3, 8, 10, 12,5, 16, 20, 25 e 32mm) e CA60 (4,2 e 5mm).' },
      { nome: 'Treliça', desc: 'Treliças H8 e H12 (6 e 12 m), nos modelos leve e padrão, ideais para estruturas pré-moldadas e reforço de lajes.' },
      { nome: 'Tela Soldada', desc: 'EQ45 (20×20) leve, EQ61 (15×15) média, EQ92 (15×15) reforçada e EQ138 (10×10) pesada.' },
      { nome: 'Sapata', desc: 'Sapatas armadas: isolada quadrada, isolada retangular, corrida, com arranque para pilar e de divisa.' },
      { nome: 'Coluna', desc: 'Colunas prontas de 6m com ferros de 6,3, 8 e 10mm e estribos 7×14, 7×17 e 10×20. Produção sob medida conforme o projeto.' },
      { nome: 'Estribos', desc: 'Estribos armados sob medida, em diversas bitolas e comprimentos, de acordo com o projeto da obra.' },
      { nome: 'Arames', desc: 'Arames recozidos, torcidos e galvanizados, em diversos diâmetros.' },
      { nome: 'Pregos', desc: 'Pregos para construção civil em diversos tamanhos: com cabeça, sem cabeça ou cabeça dupla.' }
    ]
  },
  {
    slug: 'estruturais', nome: 'Estruturais e Serralheria',
    img: 'Imagens/serralheria.jpg',
    itens: [
      { nome: 'Tubo Metalon', desc: 'Bobina de calha, tubos metalon, cantoneiras, perfis, guias e barras chatas.' },
      { nome: 'Barra Chata', desc: 'Principais bitolas para aplicações estruturais e de serralheria: 19×3, 25×3, 30×3, 40×4,75, 50×6,3 e 100×8mm.' },
      { nome: 'Perfis', desc: 'Perfis metálicos U dobrado, Z leve, T e L, além de perfis para esquadrias (guia, requadro, batente e caixa).' },
      { nome: 'Chapa', desc: 'Chapas lisas em aço carbono, galvanizadas e tipo xadrez, para estruturas metálicas, pisos e reforços.' },
      { nome: 'Corte e Dobra de Chapa', desc: 'Corte e dobra de chapas conforme projeto, com precisão e sob medida para diferentes aplicações.' },
      { nome: 'Cantoneira', desc: 'Cantoneiras de abas iguais ou desiguais, para reforço, fixação e estruturas metálicas leves.' },
      { nome: 'Bobina Galvalume e Galvanizada', desc: 'Bobinas de aço galvalume ou galvanizado para conformação de calhas, painéis e perfis leves.' },
      { nome: 'Parafusos', desc: 'Parafusos metálicos autobrocantes, autoatarraxantes e para telha metálica com arruela vedante.' }
    ]
  },
  {
    slug: 'coberturas', nome: 'Coberturas',
    img: 'Imagens/Produtos/TELHAS.jpg',
    itens: [
      { nome: 'Telhas Galvalume', desc: 'Modelos trapezoidal e ondulado, com alta resistência à corrosão. Acessórios: cumeeiras, rufos, arremates e fixadores com vedação.' },
      { nome: 'Telha Termoacústica', desc: 'Telhas tipo sanduíche com núcleo isolante (EPS), para conforto térmico e acústico, nos perfis trapezoidal ou ondulado.' },
      { nome: 'Telha Fibrocimento', desc: 'Telhas onduladas para aplicações residenciais, comerciais e rurais. Acessórios: cumeeiras, rufos, espigões e fixadores.' },
      { nome: 'Telha Transparente', desc: 'Em policarbonato (trapezoidal ou ondulado), fibra de vidro ou PVC translúcido, para entrada de luz natural.' }
    ]
  },
  {
    slug: 'drywall', nome: 'Drywall',
    img: 'Imagens/drywall.jpg',
    itens: [
      { nome: 'Placa Drywall ST', desc: 'Placa standard (ST) para uso geral em ambientes secos, em diversos tamanhos.' },
      { nome: 'Placa RU', desc: 'Resistente à umidade, ideal para cozinhas, banheiros e áreas molhadas.' },
      { nome: 'Placa Glasroc', desc: 'Núcleo reforçado, indicada para fachadas e áreas externas sujeitas à umidade e intempéries.' },
      { nome: 'Cantoneira', desc: 'Perfil de proteção para cantos e encontros de placas, garantindo alinhamento e resistência a impactos.' },
      { nome: 'Perfil', desc: 'Guias e montantes metálicos para estruturação de paredes e forros, com estabilidade e precisão no prumo.' },
      { nome: 'Gesso', desc: 'Gesso em pó para tratamento de juntas, acabamentos e correções antes da pintura.' },
      { nome: 'Parafusos', desc: 'Parafusos para drywall, com rosca fina e ponta adequada para fixação rápida em perfil metálico.' },
      { nome: 'Presilhas e Regulador', desc: 'Presilhas, reguladores e suportes para montagem de forros.' },
      { nome: 'Fita Telada', desc: 'Fita telada para tratamento de juntas, linha profissional, com excelente aderência e acabamento.' }
    ]
  },
  {
    slug: 'agronegocio', nome: 'Agronegócio',
    img: 'Imagens/Produtos/arame-farpado.jpg',
    itens: [
      { nome: 'Arame Farpado', desc: 'Galvanizado, para cercas rurais, delimitação de pastos e perímetros, com alta durabilidade em áreas externas.' },
      { nome: 'Arame Ovalado', desc: 'Galvanizado, para amarração, esticamento de cercas e fixação em mourões, reforço de cercamentos e contenção.' }
    ]
  }
];
