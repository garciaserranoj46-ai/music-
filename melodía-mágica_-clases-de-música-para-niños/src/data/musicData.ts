import { NoteDefinition, RhythmFigure, LessonWorld, VirtualSticker, SongSheet } from '../types';

export const MUSIC_NOTES: NoteDefinition[] = [
  {
    id: 'C4',
    pitch: 'C',
    octave: 4,
    solfege: 'Do',
    fullSolfege: 'Do Central',
    frequency: 261.63,
    color: '#EF4444', // Red (Boomwhackers standard)
    bgGradient: 'from-red-500 to-rose-600',
    keyLetter: 'A',
    staffOffset: -2, // Below staff on first ledger line
  },
  {
    id: 'D4',
    pitch: 'D',
    octave: 4,
    solfege: 'Re',
    fullSolfege: 'Re',
    frequency: 293.66,
    color: '#F97316', // Orange
    bgGradient: 'from-orange-500 to-amber-600',
    keyLetter: 'S',
    staffOffset: -1, // Space right below bottom line
  },
  {
    id: 'E4',
    pitch: 'E',
    octave: 4,
    solfege: 'Mi',
    fullSolfege: 'Mi',
    frequency: 329.63,
    color: '#EAB308', // Yellow
    bgGradient: 'from-yellow-400 to-amber-500',
    keyLetter: 'D',
    staffOffset: 0, // First line (bottom line)
  },
  {
    id: 'F4',
    pitch: 'F',
    octave: 4,
    solfege: 'Fa',
    fullSolfege: 'Fa',
    frequency: 349.23,
    color: '#10B981', // Green
    bgGradient: 'from-emerald-500 to-teal-600',
    keyLetter: 'F',
    staffOffset: 1, // First space
  },
  {
    id: 'G4',
    pitch: 'G',
    octave: 4,
    solfege: 'Sol',
    fullSolfege: 'Sol',
    frequency: 392.00,
    color: '#06B6D4', // Cyan / Light Blue
    bgGradient: 'from-cyan-500 to-blue-600',
    keyLetter: 'G',
    staffOffset: 2, // Second line (where Treble Clef centers!)
  },
  {
    id: 'A4',
    pitch: 'A',
    octave: 4,
    solfege: 'La',
    fullSolfege: 'La',
    frequency: 440.00,
    color: '#3B82F6', // Blue / Indigo
    bgGradient: 'from-blue-600 to-indigo-700',
    keyLetter: 'H',
    staffOffset: 3, // Second space
  },
  {
    id: 'B4',
    pitch: 'B',
    octave: 4,
    solfege: 'Si',
    fullSolfege: 'Si',
    frequency: 493.88,
    color: '#8B5CF6', // Purple / Violet
    bgGradient: 'from-purple-500 to-indigo-600',
    keyLetter: 'J',
    staffOffset: 4, // Third line
  },
  {
    id: 'C5',
    pitch: 'C',
    octave: 5,
    solfege: 'Do',
    fullSolfege: 'Do Agudo',
    frequency: 523.25,
    color: '#EC4899', // Pink / Magenta
    bgGradient: 'from-pink-500 to-rose-500',
    keyLetter: 'K',
    staffOffset: 5, // Third space
  },
  {
    id: 'D5',
    pitch: 'D',
    octave: 5,
    solfege: 'Re',
    fullSolfege: 'Re Agudo',
    frequency: 587.33,
    color: '#F43F5E',
    bgGradient: 'from-rose-500 to-red-600',
    keyLetter: 'L',
    staffOffset: 6, // Fourth line
  }
];

export const RHYTHM_FIGURES: RhythmFigure[] = [
  {
    id: 'redonda',
    name: 'Redonda',
    beats: 4,
    syllable: 'Taaaa-aaaa',
    description: 'Dura 4 tiempos completos. Es como un gran bostezo suave o una redonda manzana.',
    symbol: '𝅝',
    iconType: 'whole'
  },
  {
    id: 'blanca',
    name: 'Blanca',
    beats: 2,
    syllable: 'Taa-aa',
    description: 'Dura 2 tiempos. Camina con paso tranquilo y sostenido.',
    symbol: '𝅗𝅥',
    iconType: 'half'
  },
  {
    id: 'negra',
    name: 'Negra',
    beats: 1,
    syllable: 'Ta',
    description: 'Dura 1 tiempo. Es el latido del corazón o un paso constante.',
    symbol: '♩',
    iconType: 'quarter'
  },
  {
    id: 'corchea',
    name: 'Dos Corcheas',
    beats: 1, // two eighth notes = 1 beat
    syllable: 'Ti - Ti',
    description: '¡Dos pasitos veloces en un solo tiempo! Corren de la mano.',
    symbol: '♫',
    iconType: 'eighth'
  },
  {
    id: 'silencio_negra',
    name: 'Silencio de Negra',
    beats: 1,
    syllable: 'Shh...',
    description: '1 tiempo de calma total. ¡El silencio también es música mágica!',
    symbol: '𝄽',
    iconType: 'rest'
  }
];

export const LESSON_WORLDS: LessonWorld[] = [
  {
    id: 'mundo-1',
    number: 1,
    title: 'El Reino de las 7 Notas',
    subtitle: 'Conoce los nombres y sonidos mágicos',
    themeColor: 'from-amber-500 to-orange-500',
    icon: '🎵',
    description: 'Aprende los nombres de las notas musicales, escucha cómo suena cada una y descúbrelas con divertidos colores.',
    levels: [
      {
        id: 'lvl-1-1',
        worldId: 'mundo-1',
        levelNumber: 1,
        title: 'Las Primeras 3 Amigas: Do, Re, Mi',
        subtitle: 'El comienzo de toda melodía',
        concept: 'Do, Re y Mi son las tres primeras notas de la escala musical.',
        icon: '🌱',
        starsRequired: 0,
        xpReward: 50,
        coinsReward: 15,
        unlockedStickerId: 'stk-do-rojo',
        steps: [
          {
            id: 's-1-1',
            title: '¡Hola pequeño músico!',
            explanation: 'En la música usamos 7 notas mágicas. Cada una tiene su propia altura sonora y color. Las tres primeras son Do (rojo), Re (naranja) y Mi (amarillo). ¡Escucha el Do!',
            audioDemoNote: 'C4',
            hint: 'Haz clic en el botón de reproducir para escuchar el tono de Do.',
            question: {
              prompt: '¿Cuál es la primera nota de la escala musical?',
              options: [
                { id: 'opt-do', label: 'Do', isCorrect: true, feedback: '¡Exacto! Do es la base donde descansan las canciones.', playNote: 'C4' },
                { id: 'opt-sol', label: 'Sol', isCorrect: false, feedback: 'Sol viene más adelante. ¡La primera es Do!', playNote: 'G4' },
                { id: 'opt-fa', label: 'Fa', isCorrect: false, feedback: '¡Casi! Fa es la cuarta nota.', playNote: 'F4' }
              ]
            }
          },
          {
            id: 's-1-2',
            title: 'La escalera musical',
            explanation: 'Cuando cantamos Do, Re, Mi sentimos cómo la voz sube peldaño a peldaño. Re es más aguda que Do, y Mi es más aguda que Re.',
            audioDemoNote: 'E4',
            interactiveTask: {
              type: 'play_note',
              targetNote: 'E4',
              instruction: 'Toca la tecla de la nota Mi (color amarillo) en el instrumento para comprobar su sonido brillante.'
            }
          }
        ]
      },
      {
        id: 'lvl-1-2',
        worldId: 'mundo-1',
        levelNumber: 2,
        title: 'La Familia Completa: Fa, Sol, La, Si',
        subtitle: 'Completando el arcoíris sonoro',
        concept: 'Fa, Sol, La y Si completan las 7 notas naturales.',
        icon: '🌈',
        starsRequired: 1,
        xpReward: 60,
        coinsReward: 20,
        unlockedStickerId: 'stk-arcoiris-sonoro',
        steps: [
          {
            id: 's-1-3',
            title: 'Las 4 notas de las alturas',
            explanation: 'Fa (verde), Sol (azul celeste), La (azul marino) y Si (morado) completan nuestra familia de 7 notas. ¡Escucha el brillante sonido de Sol!',
            audioDemoNote: 'G4',
            question: {
              prompt: '¿Qué nota viene inmediatamente después de Fa?',
              options: [
                { id: 'opt-sol2', label: 'Sol', isCorrect: true, feedback: '¡Magnífico! Do - Re - Mi - Fa - ¡SOL!', playNote: 'G4' },
                { id: 'opt-do2', label: 'Do', isCorrect: false, feedback: 'Do vuelve a empezar arriba, pero después de Fa viene Sol.', playNote: 'C4' },
                { id: 'opt-re2', label: 'Re', isCorrect: false, feedback: 'Re está al inicio.', playNote: 'D4' }
              ]
            }
          },
          {
            id: 's-1-4',
            title: 'Do Agudo: La cima de la montaña',
            explanation: 'Después de Si, llegamos de nuevo a Do, ¡pero suena mucho más agudo y alegre! Se le llama Do agudo.',
            audioDemoNote: 'C5',
            interactiveTask: {
              type: 'play_note',
              targetNote: 'C5',
              instruction: 'Toca el Do agudo (color rosa fuerte) para coronar la montaña musical.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mundo-2',
    number: 2,
    title: 'El Pentagrama Misterioso',
    subtitle: 'El mapa de 5 líneas y la Clave de Sol',
    themeColor: 'from-blue-500 to-indigo-500',
    icon: '🎼',
    description: 'Descubre el pentagrama, cuenta sus 5 líneas desde abajo y aprende a leer dónde vive cada nota musical.',
    levels: [
      {
        id: 'lvl-2-1',
        worldId: 'mundo-2',
        levelNumber: 1,
        title: 'Las 5 Líneas Mágicas',
        subtitle: 'Contando de abajo hacia arriba',
        concept: 'El pentagrama tiene 5 líneas horizontales y 4 espacios intermedios.',
        icon: '📏',
        starsRequired: 2,
        xpReward: 70,
        coinsReward: 25,
        unlockedStickerId: 'stk-pentagrama-oro',
        steps: [
          {
            id: 's-2-1',
            title: '¿Qué es el Pentagrama?',
            explanation: 'Penta significa cinco y grama significa línea. ¡El pentagrama es como una pauta de 5 cables donde descansan las notas! Muy importante: ¡Siempre se cuentan de ABAJO hacia ARRIBA!',
            question: {
              prompt: '¿Cuántas líneas tiene el pentagrama musical?',
              options: [
                { id: 'opt-5', label: '5 líneas', isCorrect: true, feedback: '¡Correcto! Cinco líneas paralelas como los 5 dedos de tu mano.' },
                { id: 'opt-3', label: '3 líneas', isCorrect: false, feedback: '¡Penta significa cinco! Tiene 5 líneas.' },
                { id: 'opt-7', label: '7 líneas', isCorrect: false, feedback: 'Son 7 notas, ¡pero el pentagrama tiene 5 líneas!' }
              ]
            }
          },
          {
            id: 's-2-2',
            title: 'Líneas y Espacios',
            explanation: 'Las notas pueden vivir atravesadas por una línea o sentadas en un espacio entre dos líneas. Tiene 5 líneas y 4 espacios.',
            question: {
              prompt: '¿Cómo contamos las líneas del pentagrama?',
              options: [
                { id: 'opt-abajo', label: 'De abajo hacia arriba', isCorrect: true, feedback: '¡Bravo! La línea 1 es la de abajo del todo, como los pisos de un edificio.' },
                { id: 'opt-arriba', label: 'De arriba hacia abajo', isCorrect: false, feedback: 'Recuerda: ¡Se cuentan desde abajo, como los pisos de una casa!' }
              ]
            }
          }
        ]
      },
      {
        id: 'lvl-2-2',
        worldId: 'mundo-2',
        levelNumber: 2,
        title: 'La Llave Secreta: Clave de Sol',
        subtitle: 'La reina que marca la segunda línea',
        concept: 'La Clave de Sol nace en la segunda línea y le da nombre a la nota Sol.',
        icon: '🗝️',
        starsRequired: 3,
        xpReward: 80,
        coinsReward: 30,
        unlockedStickerId: 'stk-clave-sol',
        steps: [
          {
            id: 's-2-3',
            title: 'La guardiana de las notas',
            explanation: 'Al principio de cada pentagrama se dibuja la Clave de Sol. Su espiral se enrolla justo en la LÍNEA 2. Por eso, cualquier nota dibujada en la segunda línea se llama ¡SOL!',
            audioDemoNote: 'G4',
            question: {
              prompt: '¿En qué línea del pentagrama nace y se enrosca la Clave de Sol?',
              options: [
                { id: 'opt-lin2', label: 'En la segunda línea', isCorrect: true, feedback: '¡Maravilloso! La segunda línea es la casa oficial de la nota Sol.' },
                { id: 'opt-lin1', label: 'En la primera línea', isCorrect: false, feedback: 'En la primera línea vive la nota Mi.' },
                { id: 'opt-lin5', label: 'En la quinta línea', isCorrect: false, feedback: 'La quinta línea está en el techo del pentagrama.' }
              ]
            }
          },
          {
            id: 's-2-4',
            title: 'La casita de Do Central',
            explanation: 'Do central no cabe dentro de las 5 líneas porque es muy grave; por eso se dibuja abajo con una pequeña línea que parece un sombrero o un platillo volador.',
            audioDemoNote: 'C4',
            interactiveTask: {
              type: 'play_note',
              targetNote: 'C4',
              instruction: 'Toca la nota Do para escuchar la nota con sombrero debajo del pentagrama.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mundo-3',
    number: 3,
    title: 'El Reino del Ritmo',
    subtitle: 'El pulso, las figuras y los pasos de baile',
    themeColor: 'from-emerald-500 to-teal-500',
    icon: '🥁',
    description: 'La música se mueve con el tiempo. Descubre el pulso constante, la Negra, la Blanca y las rápidas Corcheas.',
    levels: [
      {
        id: 'lvl-3-1',
        worldId: 'mundo-3',
        levelNumber: 1,
        title: 'El Pulso del Corazón',
        subtitle: 'El tic-tac secreto que nunca para',
        concept: 'El pulso es el latido constante y regular que marca la velocidad de la música.',
        icon: '💓',
        starsRequired: 4,
        xpReward: 85,
        coinsReward: 30,
        unlockedStickerId: 'stk-tambor-magico',
        steps: [
          {
            id: 's-3-1',
            title: 'El pulso musical',
            explanation: 'Pon tu mano en el pecho. ¿Sientes tu corazón? Pom... pom... pom... En la música, ese latido se llama PULSO. Es como los pasos al caminar: parejos y firmes.',
            question: {
              prompt: '¿Cómo debe ser el pulso en una marcha musical?',
              options: [
                { id: 'opt-constante', label: 'Constante y regular', isCorrect: true, feedback: '¡Exacto! Como las agujas del reloj o los pasos de una marcha.' },
                { id: 'opt-loco', label: 'Desordenado y a los saltos', isCorrect: false, feedback: 'Si va a saltos, ¡los músicos se tropezarían!' }
              ]
            }
          },
          {
            id: 's-3-2',
            title: 'La Negra: El paso de 1 tiempo',
            explanation: 'La figura de Negra (♩) dura exactamente 1 pulso. Cuando la vemos, decimos con energía: "¡TA!". 1 pulso = 1 Negra.',
            interactiveTask: {
              type: 'tap_rhythm',
              instruction: 'Practica el ritmo tocando el tambor al compás.'
            }
          }
        ]
      },
      {
        id: 'lvl-3-2',
        worldId: 'mundo-3',
        levelNumber: 2,
        title: 'Blancas y Corcheas Gemelas',
        subtitle: 'Sonidos largos y pasos veloces',
        concept: 'La Blanca dura 2 tiempos y las Corcheas van de dos en dos.',
        icon: '🏃',
        starsRequired: 5,
        xpReward: 90,
        coinsReward: 35,
        unlockedStickerId: 'stk-corcheas-gemelas',
        steps: [
          {
            id: 's-3-3',
            title: 'La Blanca (2 tiempos)',
            explanation: 'La Blanca (𝅗𝅥) es más espaciosa y dura el DOBLE que la negra: 2 pulsos completos. Decimos: "Taa-aa". Dos pasos suaves.',
            question: {
              prompt: 'Si una negra dura 1 tiempo, ¿cuántos tiempos dura una blanca?',
              options: [
                { id: 'opt-2t', label: '2 tiempos', isCorrect: true, feedback: '¡Genial! 1 + 1 = 2 tiempos que dura la Blanca.' },
                { id: 'opt-4t', label: '4 tiempos', isCorrect: false, feedback: 'La de 4 tiempos es la Redonda.' },
                { id: 'opt-half', label: 'Medio tiempo', isCorrect: false, feedback: '¡Medio tiempo es una corchea!' }
              ]
            }
          },
          {
            id: 's-3-4',
            title: 'Corcheas: Dos en un solo latido',
            explanation: 'Las dos corcheas (♫) van agarradas por arriba con una barrita. En el mismo tiempo que das un paso, ellas tocan dos notas: "Ti - Ti".',
            question: {
              prompt: '¿Cómo cantamos las dos corcheas juntas?',
              options: [
                { id: 'opt-titi', label: '¡Ti - Ti!', isCorrect: true, feedback: '¡Rápidas y alegres! Ti-ti, ti-ti, como dos gotas de lluvia.' },
                { id: 'opt-ta', label: 'Ta', isCorrect: false, feedback: 'Ta es la sílaba de la Negra.' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mundo-4',
    number: 4,
    title: 'Oído de Lince: Agudo y Grave',
    subtitle: 'El oso cavernoso y el ruiseñor',
    themeColor: 'from-purple-500 to-pink-500',
    icon: '👂',
    description: 'Aprende a diferenciar sonidos graves (bajos y profundos) de sonidos agudos (altos y brillantes).',
    levels: [
      {
        id: 'lvl-4-1',
        worldId: 'mundo-4',
        levelNumber: 1,
        title: 'El Oso y el Pajarito',
        subtitle: 'La altura de los sonidos',
        concept: 'Los sonidos graves vibran lento y profundo; los agudos vibran rápido y alto.',
        icon: '🐻',
        starsRequired: 6,
        xpReward: 95,
        coinsReward: 35,
        unlockedStickerId: 'stk-oido-lince',
        steps: [
          {
            id: 's-4-1',
            title: 'Sonido Grave vs Agudo',
            explanation: 'Un oso gigante gruñendo o un tambor grande hacen sonidos GRAVES (bajos). Un pajarito trinando o una campanita de cristal hacen sonidos AGUDOS (altos).',
            audioDemoNote: 'C4',
            question: {
              prompt: '¿Qué sonido hace un pajarito pequeño cantando en el árbol?',
              options: [
                { id: 'opt-agudo', label: 'Sonido Agudo', isCorrect: true, feedback: '¡Brillante! Las aves hacen sonidos finitos y agudos.' },
                { id: 'opt-grave', label: 'Sonido Grave', isCorrect: false, feedback: 'El sonido grave es más bien como el trueno o el león rugiendo.' }
              ]
            }
          },
          {
            id: 's-4-2',
            title: '¿Cuál suena más agudo?',
            explanation: 'En el teclado, las notas de la izquierda son más graves y las de la derecha son más agudas. ¡Escucha el Do grave y el Do agudo!',
            audioDemoNote: 'C5',
            interactiveTask: {
              type: 'pitch_compare',
              instruction: 'Escucha con atención y reconoce la altura del sonido.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mundo-5',
    number: 5,
    title: 'Los Superpoderes del Volumen',
    subtitle: 'Piano (suave) y Forte (fuerte)',
    themeColor: 'from-rose-500 to-red-500',
    icon: '📢',
    description: 'En música usamos palabras italianas para el volumen: Piano significa suave y Forte significa fuerte.',
    levels: [
      {
        id: 'lvl-5-1',
        worldId: 'mundo-5',
        levelNumber: 1,
        title: 'El Susurro y el Rugido',
        subtitle: 'Piano (p) y Forte (f)',
        concept: 'Las dinámicas nos permiten tocar con diferentes intensidades de fuerza.',
        icon: '🤫',
        starsRequired: 7,
        xpReward: 100,
        coinsReward: 40,
        unlockedStickerId: 'stk-batuta-maestro',
        steps: [
          {
            id: 's-5-1',
            title: 'Piano: Dulce como una caricia',
            explanation: 'En las partituras, cuando ves una letra "p", significa PIANO, que en italiano quiere decir SUAVE o delicado, como cuando cuentas un secreto.',
            question: {
              prompt: 'En la música, ¿qué significa la indicación "Piano" (p)?',
              options: [
                { id: 'opt-suave', label: 'Tocar suave y bajito', isCorrect: true, feedback: '¡Correcto! Es una intensidad dulce y delicada.' },
                { id: 'opt-rapido', label: 'Tocar muy rápido', isCorrect: false, feedback: 'Rápido se llama Presto o Allegro. Piano es volumen suave.' },
                { id: 'opt-grito', label: 'Gritar con fuerza', isCorrect: false, feedback: '¡Tocar con fuerza se llama Forte!' }
              ]
            }
          },
          {
            id: 's-5-2',
            title: 'Forte: ¡Con toda la energía!',
            explanation: 'Cuando el compositor escribe una letra "f", significa FORTE (fuerte). Los instrumentos tocan con entusiasmo y vigor como una fiesta.',
            question: {
              prompt: '¿Qué letra se usa en las partituras para indicar "Forte"?',
              options: [
                { id: 'opt-f', label: 'La letra "f"', isCorrect: true, feedback: '¡Excelente! "f" de Forte, y "p" de Piano.' },
                { id: 'opt-m', label: 'La letra "m"', isCorrect: false, feedback: 'La letra "m" suele acompañar como "mf" (mezzo-forte).' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mundo-6',
    number: 6,
    title: 'El Gran Concierto de las Estrellas',
    subtitle: '¡Toca tus primeras canciones completas!',
    themeColor: 'from-amber-400 to-yellow-500',
    icon: '🌟',
    description: 'Une notas, ritmo, alturas y expresión para interpretar melodías famosas y conseguir tu Diploma de Músico de Honor.',
    levels: [
      {
        id: 'lvl-6-1',
        worldId: 'mundo-6',
        levelNumber: 1,
        title: 'Estrellita, ¿Dónde Estás?',
        subtitle: 'La melodía de las noches mágicas',
        concept: 'Toca la secuencia clásica: Do Do Sol Sol La La Sol.',
        icon: '✨',
        starsRequired: 8,
        xpReward: 120,
        coinsReward: 50,
        unlockedStickerId: 'stk-estrella-virtuosa',
        steps: [
          {
            id: 's-6-1',
            title: 'El secreto de Estrellita',
            explanation: 'Esta canción fue compuesta hace más de 200 años. Empieza con dos notas Do, salta a dos notas Sol, y sube a dos notas La: ¡Do - Do - Sol - Sol - La - La - Sol!',
            audioDemoNote: 'C4',
            question: {
              prompt: '¿Hacia dónde salta la melodía después de tocar Do Do?',
              options: [
                { id: 'opt-salto-sol', label: 'Salta hacia arriba a la nota Sol', isCorrect: true, feedback: '¡Magnífico salto! De Do sube directo hasta Sol.' },
                { id: 'opt-salto-re', label: 'Baja hacia Re', isCorrect: false, feedback: 'Re está arriba de Do, ¡pero Estrellita da un gran salto a Sol!' }
              ]
            }
          },
          {
            id: 's-6-2',
            title: '¡Toca tu primera frase musical!',
            explanation: 'Sigue la guía luminosa en el instrumento para interpretar la frase completa de Estrellita.',
            interactiveTask: {
              type: 'play_note',
              targetNote: 'G4',
              instruction: 'Toca la nota Sol brillante en el instrumento.'
            }
          }
        ]
      }
    ]
  }
];

export const VIRTUAL_STICKERS: VirtualSticker[] = [
  {
    id: 'stk-do-rojo',
    title: 'Do la Tortuga Alegre',
    category: 'notas',
    description: 'Otorgado por dominar las notas Do, Re y Mi.',
    icon: '🐢',
    rarity: 'común'
  },
  {
    id: 'stk-arcoiris-sonoro',
    title: 'Arcoíris de 7 Notas',
    category: 'notas',
    description: 'Completaste la escala completa de Do a Si.',
    icon: '🌈',
    rarity: 'especial'
  },
  {
    id: 'stk-pentagrama-oro',
    title: 'Pentagrama de Oro',
    category: 'notas',
    description: 'Sabes contar las 5 líneas desde abajo sin dudar.',
    icon: '📜',
    rarity: 'especial'
  },
  {
    id: 'stk-clave-sol',
    title: 'Clave de Sol Radiante',
    category: 'notas',
    description: 'Descubriste la llave mágica de la segunda línea.',
    icon: '🗝️',
    rarity: 'dorada'
  },
  {
    id: 'stk-tambor-magico',
    title: 'Tambor del Pulso Perfecto',
    category: 'ritmo',
    description: 'Tu corazón late al compás de la música.',
    icon: '🥁',
    rarity: 'común'
  },
  {
    id: 'stk-corcheas-gemelas',
    title: 'Corcheas Gemelas Veloz',
    category: 'ritmo',
    description: '¡Ti-Ti! Pasos veloces en un solo tiempo.',
    icon: '👟',
    rarity: 'especial'
  },
  {
    id: 'stk-oido-lince',
    title: 'Oído de Lince Dorado',
    category: 'maestria',
    description: 'Distingues notas agudas y graves con los ojos cerrados.',
    icon: '🐱',
    rarity: 'dorada'
  },
  {
    id: 'stk-batuta-maestro',
    title: 'Batuta del Maestro Búho',
    category: 'maestria',
    description: 'Dominaste los poderes del Piano y el Forte.',
    icon: '🪄',
    rarity: 'dorada'
  },
  {
    id: 'stk-estrella-virtuosa',
    title: 'Estrella Virtuosa',
    category: 'maestria',
    description: '¡Completaste tu primera canción en el Gran Concierto!',
    icon: '⭐',
    rarity: 'legendaria'
  },
  {
    id: 'stk-xilofono-cristal',
    title: 'Xilófono de Hadas',
    category: 'instrumentos',
    description: 'Tus notas suenan como campanas de cuento.',
    icon: '✨',
    rarity: 'especial'
  },
  {
    id: 'stk-piano-realeza',
    title: 'Piano Real de Cola',
    category: 'instrumentos',
    description: 'Un instrumento digno de los grandes compositores.',
    icon: '🎹',
    rarity: 'dorada'
  },
  {
    id: 'stk-flauta-bosque',
    title: 'Flauta Mágica del Bosque',
    category: 'instrumentos',
    description: 'Un sonido dulce que calma a todos los animalitos.',
    icon: '🪈',
    rarity: 'legendaria'
  }
];

export const POPULAR_SONGS: SongSheet[] = [
  {
    id: 'estrellita',
    title: 'Estrellita, ¿Dónde Estás?',
    difficulty: 'Fácil',
    bpm: 80,
    notes: [
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 },
      { note: 'A4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 }
    ]
  },
  {
    id: 'alegria',
    title: 'Himno a la Alegría',
    difficulty: 'Medio',
    bpm: 90,
    notes: [
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1.5 },
      { note: 'D4', duration: 0.5 },
      { note: 'D4', duration: 2 }
    ]
  },
  {
    id: 'campanitas',
    title: 'Campanita del Lugar',
    difficulty: 'Fácil',
    bpm: 85,
    notes: [
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'G4', duration: 2 }
    ]
  }
];
