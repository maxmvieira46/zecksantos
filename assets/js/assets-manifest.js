window.ZECK_ASSETS = {
  colors: {
    preto: { name: 'Preto', hex: '#0D0D0D', accent: '#D5C8B5', structured: 'Colete Direção + Calça Trajeto', fluid: 'Vestido Pulso' },
    grafite: { name: 'Grafite', hex: '#2A2D31', accent: '#C4C0B8', structured: 'Blazer Fluxo + Calça Trajeto', fluid: 'Camisa Essência + Saia Ritmo' },
    marfim: { name: 'Marfim', hex: '#E6E4DF', accent: '#22211F', structured: 'Blazer Fluxo + Saia Ritmo', fluid: 'Camisa Essência + Calça Trajeto' },
    champagne: { name: 'Champagne', hex: '#C9B995', accent: '#27221C', structured: 'Blazer Fluxo + Saia Ritmo', fluid: 'Vestido Pulso' },
    fendi: { name: 'Fendi', hex: '#A99B88', accent: '#201D18', structured: 'Colete Direção + Calça Trajeto', fluid: 'Camisa Movimento + Saia Ritmo' },
    taupe: { name: 'Taupe', hex: '#736255', accent: '#F1ECE3', structured: 'Blazer Fluxo + Calça Trajeto', fluid: 'Vestido Pulso' },
    espresso: { name: 'Chocolate / Café Espresso', hex: '#3A281E', accent: '#EDE4D9', structured: 'Colete Direção + Saia Ritmo', fluid: 'Blazer Fluxo + Calça Trajeto' },
    borgonha: { name: 'Borgonha', hex: '#5B1E2D', accent: '#F0E2DB', structured: 'Vestido Pulso', fluid: 'Blazer Fluxo + Saia Ritmo' }
  },
  families: [
    { color: 'preto', looks: ['assets/images/looks/preto-look-1.webp','assets/images/looks/preto-look-2.webp'] },
    { color: 'grafite', looks: ['assets/images/looks/grafite-look-1.webp','assets/images/looks/grafite-look-2.webp'] },
    { color: 'marfim', looks: ['assets/images/looks/marfim-look-1.webp','assets/images/looks/marfim-look-2.webp'] },
    { color: 'champagne', looks: ['assets/images/looks/champagne-look-1.webp','assets/images/looks/champagne-look-2.webp'] },
    { color: 'fendi', looks: ['assets/images/looks/fendi-look-1.webp','assets/images/looks/fendi-look-2.webp'] },
    { color: 'taupe', looks: ['assets/images/looks/taupe-look-1.webp','assets/images/looks/taupe-look-2.webp'] },
    { color: 'espresso', looks: ['assets/images/looks/espresso-look-1.webp','assets/images/looks/espresso-look-2.webp'] },
    { color: 'borgonha', looks: ['assets/images/looks/borgonha-look-1.webp','assets/images/looks/borgonha-look-2.webp'] }
  ],
  pieces: {
    vestido: {
      name: 'Vestido Pulso',
      sketch: 'assets/images/sketches/vestido-pulso.webp',
      concept: 'Alfaiataria transpassada, cintura marcada e fluidez monumental.',
      material: 'Crepe de alfaiataria denso com estrutura interna invisível.',
      detail: 'Lapelas precisas, fechamento discreto e abertura frontal em movimento.',
      projections: { preto: 2, champagne: 2, taupe: 2, borgonha: 1 }
    },
    blazer: {
      name: 'Blazer Fluxo',
      sketch: 'assets/images/sketches/blazer-fluxo.webp',
      concept: 'Estrutura arquitetônica que acompanha o corpo sem abandonar a precisão.',
      material: 'Lã fria, entretela de alta gramatura e acabamento bonded.',
      detail: 'Ombros definidos, cintura controlada e lapela construída milimetricamente.',
      projections: { grafite: 1, marfim: 1, champagne: 1, taupe: 1, espresso: 2, borgonha: 2 }
    },
    saia: {
      name: 'Saia Ritmo',
      sketch: 'assets/images/sketches/saia-ritmo.webp',
      concept: 'Drapeado envelope e leve evasê para construir movimento com direção.',
      material: 'Seda acetinada ou crepe fluido de caimento controlado.',
      detail: 'Drapeado lateral, comprimento midi e acabamento que responde ao passo.',
      projections: { grafite: 2, marfim: 1, champagne: 1, fendi: 2, espresso: 1, borgonha: 2 }
    },
    colete: {
      name: 'Colete Direção',
      sketch: 'assets/images/sketches/colete-direcao.webp',
      concept: 'Rigor utilitário, compressão tática e cintura esculpida.',
      material: 'Alfaiataria encorpada com reforços localizados.',
      detail: 'Decote em V, botões frontais e recortes que desenham a silhueta.',
      projections: { preto: 1, fendi: 1, espresso: 1 }
    },
    calca: {
      name: 'Calça Trajeto',
      sketch: 'assets/images/sketches/calca-trajeto.webp',
      concept: 'Verticalidade, amplitude e um eixo definido pelo friso frontal.',
      material: 'Lã fria de alta torção e memória de forma.',
      detail: 'Cintura alta, wide leg e comprimento alongado.',
      projections: { preto: 1, grafite: 1, marfim: 2, fendi: 1, taupe: 1, espresso: 2 }
    },
    camisa: {
      name: 'Camisa Essência',
      sketch: 'assets/images/sketches/camisa-essencia.webp',
      concept: 'Leveza de seda em contraponto à estrutura da alfaiataria.',
      material: 'Georgette de seda ou cetim opaco.',
      detail: 'Gola limpa, volume nas mangas e punhos ajustados.',
      projections: { grafite: 2, marfim: 2, fendi: 2 }
    }
  }
};
