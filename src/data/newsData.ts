import { Article, VideoEpisode, PhotoAlbum, OfficialDocument, CalendarEvent, MemberProfile, ArticleComment } from '../types';

export const TICKER_HEADLINES = [
  "Associação dos Ribeirinhos e Pescadores de Porto Cercado convoca comunidade para Assembleia Geral neste sábado",
  "Nível do Rio Cuiabá e condições de navegação: Boletim hidrológico favorável para barcos e voadeiras",
  "Período de Defeso e Piracema: Cartilha oficial de preservação e proteção das espécies reprodutoras no Pantanal",
  "Mutirão Ecológico Comunitário: Ribeirinhos e rancheiros recolhem resíduos e limpam baías e corixos",
  "Campanha de Doação Solidária: Apoie as famílias de pescadores artesanais e a manutenção de botes comunitários",
  "Parceria com a Prefeitura de Poconé para manutenção contínua das pontes de madeira e estrada de Porto Cercado"
];

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-1',
    slug: 'comunidade-ribeirinha-e-rancheiros-porto-cercado',
    title: 'Comunidade Ribeirinha e Pescadores de Porto Cercado unem forças pela preservação do Rio Cuiabá',
    subtitle: 'Assembleia histórica reúne dezenas de pescadores artesanais, piloteiros nativos e rancheiros para debater sustentabilidade, combate à pesca predatória e melhorias no acesso à região pantaneira.',
    summary: 'Assembleia histórica reúne dezenas de pescadores artesanais, piloteiros nativos e rancheiros para debater sustentabilidade, combate à pesca predatória e melhorias no acesso à região pantaneira.',
    content: [
      'A Associação dos Ribeirinhos, Pescadores Artesanais e Rancheiros de Porto Cercado realizou um encontro comunitário decisivo às margens do Rio Cuiabá, no município de Poconé (MT). A reunião reuniu piloteiros tradicionais, mestres de embarcações, famílias que vivem da pesca há gerações e proprietários de pousadas e pesqueiros.',
      'Entre as pautas prioritárias esteve a proteção permanente das matas ciliares e corixos que servem de berçário para espécies nobres como o Pintado, o Pacu e o Dourado. Ficou deliberada a criação de brigadas voluntárias ribeirinhas para alertar sobre focos de incêndio e descarte irregular de óleo e lixo.',
      'A liderança da Associação ressaltou: "O ribeirinho é o verdadeiro guardião do Pantanal. Ninguém conhece cada curva, cada baía e cada poço do Rio Cuiabá como quem vive aqui. Quando nos unimos em associação, conseguimos defender nossos direitos, buscar infraestrutura para nossas famílias e manter o rio com fartura de peixe."',
      'Durante a assembleia, foi aprovado o calendário de mutirões ecológicos e o fortalecimento do fundo comunitário para auxílio de manutenção de botes e motores de popa usados no transporte de moradores e crianças até a escola rural.'
    ],
    category: 'Comunidade',
    categoryColor: '#064E3B',
    tag: 'Porto Cercado Viva',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Comunicação Ribeirinha',
      role: 'Associação Porto Cercado',
      initials: 'PC'
    },
    date: 'Hoje, 09:30',
    readTime: '4 min de leitura',
    featured: true,
    shares: 420
  },
  {
    id: 'art-2',
    slug: 'uniao-dos-rancheiros-na-conservacao-do-rio-cuiaba',
    title: 'A união dos pescadores e piloteiros na conservação das espécies nativas do Pantanal',
    subtitle: 'Como a cooperação entre pescadores artesanais e condutores de pesca esportiva tem protegido os cardumes no Rio Cuiabá e Rio São Lourenço.',
    summary: 'Como a cooperação entre pescadores artesanais e condutores de pesca esportiva tem protegido os cardumes no Rio Cuiabá e Rio São Lourenço.',
    content: [
      'O Pantanal mato-grossense é um ecossistema pulsante que depende do equilíbrio hidrológico e do respeito rigoroso aos ciclos reprodutivos dos peixes. Em Porto Cercado, a transição entre o turismo de pesca esportiva e a subsistência dos pescadores artesanais encontrou um modelo de cooperação exemplar.',
      'Pescadores com décadas de experiência agora atuam também como guias de pesca e condutores ambientais credenciados, ensinando aos turistas os princípios éticos do pesque-e-solte, o manuseio correto dos peixes com alicates de contenção e o descarte zero de resíduos.',
      'Além disso, a Associação mantém canal constante com os órgãos fiscalizadores para coibir o uso ilegal de redes de arrasto e espinhéis nas bocas de corixos durante a descida das águas.',
      '"Nosso sustento vem da água limpa e do peixe vivo. Cada piloteiro treinado é um fiscal da natureza e um multiplicador de respeito", destacou o presidente da entidade.'
    ],
    category: 'Meio Ambiente',
    categoryColor: '#059669',
    tag: 'Preservação Fluvial',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Benedito da Silva (Seu Dito)',
      role: 'Pescador Decano e Mestre Piloteiro',
      initials: 'BS'
    },
    date: 'Hoje, 08:00',
    readTime: '5 min',
    featured: false,
    shares: 184
  },
  {
    id: 'art-3',
    slug: 'estrada-de-acesso-a-porto-cercado-parceria-pocone',
    title: 'Estrada e Pontes de Acesso a Porto Cercado: Parceria para garantir escoamento e socorro fluvial',
    subtitle: 'Reunião entre diretoria comunitária e Secretaria de Infraestrutura assegura patrolamento e reforço nas pontes de madeira que ligam Poconé aos atracadouros.',
    summary: 'Reunião entre diretoria comunitária e Secretaria de Infraestrutura assegura patrolamento e reforço nas pontes de madeira que ligam Poconé aos atracadouros e pesqueiros.',
    content: [
      'A diretoria da Associação esteve reunida na sede da Prefeitura de Poconé para definir o plano de manutenção emergencial na estrada de terra que conecta a rodovia aos portos e pesqueiros de Porto Cercado.',
      'O cronograma firmado inclui o cascalhamento dos pontos de atoleiro e o reparo estrutural em três pontes de madeira cruciais para a travessia de reboques de embarcações, ambulâncias e caminhões de mantimentos.',
      'A garantia de boas condições na via é vital tanto para o ecoturismo quanto para o deslocamento dos pescadores e suas famílias durante a época de cheia, quando as águas sobem e o acesso terrestre se torna mais desafiador.'
    ],
    category: 'Infraestrutura',
    categoryColor: '#0F172A',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Comissão de Acesso e Vias',
      role: 'Associação Porto Cercado',
      initials: 'CV'
    },
    date: 'Ontem',
    readTime: '3 min de leitura',
    shares: 310
  },
  {
    id: 'art-4',
    slug: 'temporada-de-pesca-esportiva-guia-pantanal',
    title: 'Piracema e Pesca Consciente: Orientações oficiais para a bacia do Rio Cuiabá em 2026',
    subtitle: 'Cartilha elaborada pelos pescadores tradicionais orienta sobre medidas mínimas, anzóis sem farpa e proteção dos cardumes reprodutores.',
    summary: 'Cartilha elaborada pelos pescadores tradicionais orienta sobre medidas mínimas, anzóis sem farpa e proteção dos cardumes reprodutores.',
    content: [
      'Com o objetivo de aliar a tradição pesqueira ao ecoturismo sustentável, a Associação dos Ribeirinhos e Pescadores de Porto Cercado lançou uma cartilha prática ilustrada.',
      'O material esclarece as medidas mínimas e máximas de captura para cada espécie, as regras vigentes na bacia pantaneira e a importância primordial de preservar as matrizes de Pintado, Cachara, Jaú e Pacu durante o período da subida dos peixes.',
      'Exemplares impressos estão sendo distribuídos gratuitamente nos pesqueiros, ranchos, pousadas e marinas de Porto Cercado, além de estar disponível para download em PDF no portal.'
    ],
    category: 'Turismo & Pesca',
    categoryColor: '#059669',
    imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Coordenação Náutica e de Pesca',
      role: 'Porto Cercado MT',
      initials: 'CP'
    },
    date: '22 Out 2024',
    readTime: '4 min de leitura',
    shares: 215
  },
  {
    id: 'art-5',
    slug: 'mutirao-ecologico-margens-rio-cuiaba',
    title: 'Mutirão Ecológico no Rio Cuiabá: Ribeirinhos e voluntários retiram resíduos e plantam mudas nativas',
    subtitle: 'Em 14 barcos e voadeiras, equipe comunitária percorreu 25 km de margens recolhendo materiais descartados e fortalecendo as barrancas dos rios.',
    summary: 'Em 14 barcos e voadeiras, equipe comunitária percorreu 25 km de margens recolhendo materiais descartados e fortalecendo as barrancas dos rios.',
    content: [
      'Mais de 50 voluntários, entre pescadores artesanais, piloteiros, rancheiros e jovens ribeirinhos de Porto Cercado, participaram de uma intensa jornada de limpeza fluvial ao longo das margens do Rio Cuiabá.',
      'A ação resultou no recolhimento de mais de 850 kg de materiais como garrafas plásticas, cordas sintéticas, pneus e recipientes metálicos trazidos pelas cheias. Todo o material reciclável foi encaminhado para a cooperativa de catadores de Poconé.',
      'Ao término do mutirão, a comunidade realizou o plantio de mudas de ingazeiro, figueira pantaneira e sarandi nas margens mais suscetíveis à erosão provocada pelas marolas dos motores de grande porte.'
    ],
    category: 'Comunidade',
    categoryColor: '#064E3B',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Comitê Ecológico Comunitário',
      role: 'Voluntariado Pantanal',
      initials: 'CE'
    },
    date: '21 Out 2024',
    readTime: '3 min de leitura',
    shares: 142
  },
  {
    id: 'art-6',
    slug: 'fiscalizacao-e-monitoramento-ambiental-porto-cercado',
    title: 'Monitoramento Fluvial: Pescadores e Polícia Militar Ambiental intensificam rondas nos corixos',
    subtitle: 'Comunicação comunitária via rádio e celular auxilia no combate à pesca predatória com redes de malha fina e zela pela tranquilidade das famílias ribeirinhas.',
    summary: 'Comunicação comunitária via rádio e celular auxilia no combate à pesca predatória com redes de malha fina e zela pela tranquilidade das famílias ribeirinhas.',
    content: [
      'A parceria permanente entre os moradores tradicionais de Porto Cercado e as guarnições do Batalhão de Proteção Ambiental tem sido decisiva para manter a ordem nas águas pantaneiras.',
      'Os pescadores atuam como sentinelas, informando movimentações suspeitas de embarcações que utilizam petrechos ilegais nas áreas de desova ou em baías fechadas.',
      'A ação preventiva garante que os rios continuem povoados de peixes e que as famílias ribeirinhas possam viver com dignidade e segurança em suas casas flutuantes e ranchos ribeirinhos.'
    ],
    category: 'Meio Ambiente',
    categoryColor: '#059669',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Vigilância Comunitária',
      role: 'Porto Cercado MT',
      initials: 'VC'
    },
    date: '20 Out 2024',
    readTime: '3 min de leitura',
    shares: 98
  }
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return ARTICLES_DATA.find((a) => a.slug === slug || a.id === slug);
};

export const VIDEOS_DATA: VideoEpisode[] = [
  {
    id: 'vid-1',
    title: 'A Força dos Piloteiros de Porto Cercado: Navegando as Curvas do Rio Cuiabá',
    category: 'Vozes do Pantanal',
    categoryColor: '#059669',
    duration: '18:40',
    published: 'Esta semana',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    presenter: 'Seu Benedito Arruda e Mestres Piloteiros de Porto Cercado',
    description: 'Documentário especial sobre a sabedoria náutica dos ribeirinhos, a leitura dos canais e baixios do Rio Cuiabá e o papel dos piloteiros no ecoturismo sustentável.'
  },
  {
    id: 'vid-2',
    title: 'Defeso e Piracema no Pantanal: Como os pescadores artesanais preservam o ciclo das águas',
    category: 'Educação Ambiental',
    categoryColor: '#064E3B',
    duration: '22:15',
    published: 'Há 3 dias',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    presenter: 'Biólogos da SEMA e Lideranças da Associação de Pescadores',
    description: 'Entenda como funciona a subida dos peixes para desova nos afluentes do Rio Cuiabá e por que a proibição da pesca comercial nesse período garante o futuro de todos.'
  },
  {
    id: 'vid-3',
    title: 'Oficina Náutica Prática: Manutenção de Motores de Popa e Segurança Fluvial',
    category: 'Capacitação Náutica',
    categoryColor: '#2563EB',
    duration: '31:50',
    published: 'Semana passada',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    presenter: 'Instrutores da Capitania Fluvial de Cuiabá e Mecânicos Navais',
    description: 'Orientações práticas de revisão de carburadores, hélice, troca de óleo, uso correto de coletes e procedimentos de resgate em caso de tempestades pantaneiras.'
  },
  {
    id: 'vid-4',
    title: 'Culinária Tradicional Pantaneira: O legítimo peixe na brasa e o caldo de piranha',
    category: 'Cultura & Sabores',
    categoryColor: '#D97706',
    duration: '14:20',
    published: 'Há 1 semana',
    imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?auto=format&fit=crop&w=1200&q=80',
    presenter: 'Dona Maria Joana, Cozinheira Tradicional de Porto Cercado',
    description: 'Aprenda os segredos centenários dos temperos da beira do rio, a farofa de banana-da-terra e o prato que sustenta a energia dos pescadores desde o raiar do sol.'
  }
];

export const PHOTO_ALBUMS: PhotoAlbum[] = [
  {
    id: 'alb-1',
    title: '12º Encontro Comunitário de Pescadores e Piloteiros no Rio Cuiabá',
    category: 'Tradição Pantaneira',
    photoCount: 28,
    coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    date: '20 Out 2024',
    location: 'Porto Cercado - Margens do Rio Cuiabá, Poconé/MT',
    description: 'Confraternização dos pescadores profissionais, desfile de barcos e voadeiras pantaneiras, demonstração de arremesso de tarrafa e almoço comunitário.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Alvorada com saída dos botes e voadeiras para o encontro comunitário.'
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Pescador tradicional demonstrando o manejo respeitoso e soltura do peixe nativo.'
      }
    ]
  },
  {
    id: 'alb-2',
    title: 'Mutirão de Limpeza das Baías e Margens de Porto Cercado',
    category: 'Ação Ecológica',
    photoCount: 36,
    coverUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    date: '14 Out 2024',
    location: 'Curva do Rio Cuiabá e Corixos de Poconé',
    description: 'Mobilização comunitária em 14 embarcações para a coleta de resíduos e recuperação das barrancas pantaneiras.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        caption: 'Embarcações retornando com os materiais recicláveis recolhidos nas baías.'
      }
    ]
  },
  {
    id: 'alb-3',
    title: 'Amanhecer no Pantanal: Vida Ribeirinha e Fauna de Porto Cercado',
    category: 'Natureza & Cotidiano',
    photoCount: 42,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    date: '08 Out 2024',
    location: 'Região Pantaneira de Porto Cercado/MT',
    description: 'Registros fotográficos da revoada de tuiuiús, jacarés nas praias de rio e a rotina serena das famílias de pescadores.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cena matinal da fauna pantaneira preservada nas margens do Rio Cuiabá.'
      }
    ]
  },
  {
    id: 'alb-4',
    title: 'Oficinas Comunitárias e Escola Fluvial dos Ribeirinhos',
    category: 'Juventude & Futuro',
    photoCount: 22,
    coverUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    date: '02 Out 2024',
    location: 'Sede Comunitária da Associação - Porto Cercado',
    description: 'Cursos de condutores de ecoturismo, primeiros socorros em ambiente fluvial e artesanato em fibras nativas.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Turma de jovens ribeirinhos recebendo certificados de condutores fluviais.'
      }
    ]
  }
];

export const OFFICIAL_DOCUMENTS: OfficialDocument[] = [
  {
    id: 'doc-1',
    title: 'Edital nº 01/2026 - Convocatória para Assembleia Geral da Associação dos Ribeirinhos',
    code: 'ED-PC-2026-01',
    type: 'Edital',
    date: '21/10/2026',
    size: '1.1 MB',
    status: 'Vigente',
    summary: 'Convoca todos os pescadores artesanais, rancheiros e piloteiros filiados para a eleição da Diretoria e prestação de contas do fundo comunitário.',
    downloadUrl: '#'
  },
  {
    id: 'doc-2',
    title: 'Tabela Oficial de Tamanhos Mínimos de Captura e Defeso 2026 - SEMA/IBAMA',
    code: 'TAB-PESCA-2026',
    type: 'Regulamento',
    date: '15/10/2026',
    size: '780 KB',
    status: 'Obrigatório em todas as embarcações',
    summary: 'Medidas permitidas para Dourado, Pintado, Pacu, Cachara, Jaú e regras específicas de petrechos na calha do Rio Cuiabá.',
    downloadUrl: '#'
  },
  {
    id: 'doc-3',
    title: 'Ata da 48ª Reunião da Diretoria: Apoio ao Transporte Fluvial Escolar e Barcos Comunitários',
    code: 'ATA-PC-48',
    type: 'Ata',
    date: '10/10/2026',
    size: '890 KB',
    status: 'Aprovada por unanimidade',
    summary: 'Deliberação sobre aquisição coletiva de combustível, revisão de motores de popa e manutenção do bote de socorro médico de Porto Cercado.',
    downloadUrl: '#'
  },
  {
    id: 'doc-4',
    title: 'Estatuto Social da Associação dos Ribeirinhos e Pescadores de Porto Cercado (Registrado)',
    code: 'EST-PC-OFICIAL',
    type: 'Regulamento',
    date: '01/08/2026',
    size: '2.5 MB',
    status: 'Registrado em Cartório de Poconé/MT',
    summary: 'Documento fundador consolidando os direitos e deveres dos pescadores artesanais, proprietários de ranchos e associados contribuintes.',
    downloadUrl: '#'
  },
  {
    id: 'doc-5',
    title: 'Resolução Normativa nº 03/2026 - Código de Conduta e Segurança para Piloteiros e Barcos Turísticos',
    code: 'RN-PC-2026-03',
    type: 'Resolução',
    date: '19/09/2026',
    size: '950 KB',
    status: 'Vigente',
    summary: 'Diretrizes de velocidade segura perto de moradias ribeirinhas, uso obrigatório de coletes e descarte ecológico de lixo a bordo.',
    downloadUrl: '#'
  }
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Assembleia Geral dos Pescadores e Rancheiros de Porto Cercado',
    day: '28',
    month: 'OUT',
    year: '2026',
    time: '08:30h às 12:00h',
    modality: 'Presencial',
    location: 'Sede Comunitária da Associação - Porto Cercado (às margens do rio)',
    description: 'Deliberação sobre a temporada de turismo de pesca, apoio no defeso e prestação de contas do fundo solidário.',
    category: 'Comunitário'
  },
  {
    id: 'ev-2',
    title: 'Início Oficial do Período de Defeso / Piracema 2026/2027',
    day: '01',
    month: 'NOV',
    year: '2026',
    time: '00:00h',
    modality: 'Presencial',
    location: 'Toda a Bacia Hidrográfica do Rio Cuiabá e Pantanal',
    description: 'Início do período de reprodução dos peixes nativos. Suspensão da pesca predatória e ativação dos cadastros do seguro defeso.',
    category: 'Legislação Fluvial'
  },
  {
    id: 'ev-3',
    title: 'Oficina da Capitania Fluvial: Regularização de Embarcações e Carteira de Arrais',
    day: '15',
    month: 'NOV',
    year: '2026',
    time: '09:00h às 17:00h',
    modality: 'Presencial',
    location: 'Atracadouro Municipal de Porto Cercado',
    description: 'Atendimento móvel da Marinha para vistorias em voadeiras, emissão de registro de motores e renovação de habilitação de piloteiros.',
    category: 'Náutica & Segurança'
  },
  {
    id: 'ev-4',
    title: 'Grande Mutirão das Águas: Limpeza Ecológica das Baías Pantaneiras',
    day: '06',
    month: 'DEZ',
    year: '2026',
    time: '07:00h',
    modality: 'Presencial',
    location: 'Concentração na rampa principal de Porto Cercado',
    description: 'Saída coletiva das embarcações para limpeza das margens e plantio de mudas ciliares antes do pico da cheia.',
    category: 'Meio Ambiente'
  }
];

export const MOCK_MEMBER: MemberProfile = {
  name: 'Gerson Arruda de Almeida',
  registrationNumber: 'RP-0842-MT',
  category: 'Pescador Profissional Artesanal / Piloteiro',
  section: 'Porto Cercado - Colônia de Pescadores de Poconé/MT',
  status: 'Ativo',
  sinceYear: '2014',
  validThrough: '12/2026',
  cpfMasked: '***.319.801-**'
};

export const MEMBER_MOCK = {
  name: 'Gerson Arruda de Almeida',
  registration: 'RP-0842-MT',
  category: 'Pescador Profissional Artesanal / Piloteiro Pantaneiro',
  status: 'Ativo e Regular',
  memberSince: 'Março / 2014',
  validUntil: 'Dezembro / 2026',
  qrCodeId: 'PC-884210'
};

// Default initial comments on news articles to simulate a vibrant, active community
export const INITIAL_COMMENTS: ArticleComment[] = [
  {
    id: 'cmt-1',
    articleSlug: 'comunidade-ribeirinha-e-rancheiros-porto-cercado',
    authorName: 'Seu Benedito da Silva',
    authorEmail: 'benedito.pesca@portocercado.com',
    authorRole: 'Pescador Artesanal e Piloteiro',
    isPremium: true,
    content: 'Reunião de suma importância! Quem vive do rio sabe que sem organização a gente fica desprotegido. Parabéns à diretoria por lutar pela nossa estrada e pelo nosso direito de pescar com dignidade.',
    createdAt: 'Hoje às 10:15',
    likes: 8
  },
  {
    id: 'cmt-2',
    articleSlug: 'comunidade-ribeirinha-e-rancheiros-porto-cercado',
    authorName: 'Marcos Vinicius Rancheiro',
    authorEmail: 'marcos.pesqueiro@gmail.com',
    authorRole: 'Proprietário do Rancho Sol Nascente',
    isPremium: true,
    content: 'Como proprietário de rancho aqui há mais de 15 anos, apoio 100% essa união. O respeito com os pescadores locais e com a preservação do Rio Cuiabá tem que vir em primeiro lugar.',
    createdAt: 'Hoje às 11:40',
    likes: 5
  },
  {
    id: 'cmt-3',
    articleSlug: 'uniao-dos-rancheiros-na-conservacao-do-rio-cuiaba',
    authorName: 'Dona Maria Joana',
    authorEmail: 'maria.pantanal@outlook.com',
    authorRole: 'Moradora Ribeirinha e Artesã',
    isPremium: true,
    content: 'O rio é a nossa vida e o sustento dos nossos filhos. Cuidar dos corixos e não deixar jogar lixo é dever de todo mundo que frequenta Porto Cercado.',
    createdAt: 'Ontem às 16:20',
    likes: 12
  },
  {
    id: 'cmt-4',
    articleSlug: 'temporada-de-pesca-esportiva-guia-pantanal',
    authorName: 'Capitão Tiago Lemes',
    authorEmail: 'tiago.guia@pantanalverde.com.br',
    authorRole: 'Condutor de Pesca Esportiva',
    isPremium: true,
    content: 'O pesque-e-solte precisa ser levado a sério por todos os turistas. Manter os peixes grandes no rio garante que as próximas gerações também tenham o que pescar.',
    createdAt: 'Há 2 dias',
    likes: 9
  }
];
