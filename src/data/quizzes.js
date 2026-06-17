export const quizzes = {
  modulo1: {
    title: "Módulo 1: ECG Básico para Holter",
    description: "Eletrocardiograma básico para Holter - FC, pausas, canais, artefato",
    questions: [
      {
        id: "m1_q1",
        text: "O que você entende por pausas no Holter?",
        type: "open",
        difficulty: "easy",
        tags: ["pausas", "definição"]
      },
      {
        id: "m1_q2",
        text: "Qual é a frequência cardíaca normal em repouso?",
        type: "multiple",
        difficulty: "easy",
        options: [
          "Menos de 60 bpm",
          "60-100 bpm",
          "100-120 bpm",
          "Acima de 120 bpm"
        ],
        correctAnswer: 1,
        tags: ["FC", "repouso"]
      },
      {
        id: "m1_q3",
        text: "Como identificar artefatos no Holter?",
        type: "open",
        difficulty: "medium",
        tags: ["artefato", "qualidade"]
      }
    ]
  },
  modulo2: {
    title: "Módulo 2: Conceitos Essenciais sobre Arritmias",
    description: "Bradi/taquiarritmia, regular/irregular",
    questions: [
      {
        id: "m2_q1",
        text: "Qual a diferença entre bradicardia e taquicardia?",
        type: "open",
        difficulty: "easy",
        tags: ["bradicardia", "taquicardia"]
      },
      {
        id: "m2_q2",
        text: "Uma arritmia regular é sempre fisiológica?",
        type: "multiple",
        difficulty: "medium",
        options: [
          "Sim, sempre",
          "Não, pode ser patológica",
          "Depende da idade",
          "Só se for abaixo de 60 bpm"
        ],
        correctAnswer: 1,
        tags: ["arritmia", "regularidade"]
      },
      {
        id: "m2_q3",
        text: "Como diferenciamos arritmias regulares de irregulares no traçado?",
        type: "open",
        difficulty: "medium",
        tags: ["análise", "padrão"]
      }
    ]
  },
  modulo3: {
    title: "Módulo 3: Arritmias Ventriculares",
    description: "BEV, TV, bigeminismo, trigeminismo",
    questions: [
      {
        id: "m3_q1",
        text: "O que é uma extrassístole ventricular (BEV)?",
        type: "open",
        difficulty: "easy",
        tags: ["BEV", "definição"]
      },
      {
        id: "m3_q2",
        text: "Qual é a diferença entre bigeminismo e trigeminismo?",
        type: "multiple",
        difficulty: "medium",
        options: [
          "Bigeminismo é 2 BEV, trigeminismo é 3 BEV",
          "Bigeminismo é padrão 1-BEV-1-BEV, trigeminismo é 1-BEV-1-BEV-1-BEV",
          "Não há diferença",
          "Depende da frequência cardíaca"
        ],
        correctAnswer: 1,
        tags: ["padrão", "nomenclatura"]
      },
      {
        id: "m3_q3",
        text: "Quando uma taquicardia ventricular é considerada preocupante?",
        type: "open",
        difficulty: "hard",
        tags: ["TV", "severidade"]
      }
    ]
  },
  modulo4: {
    title: "Módulo 4: Arritmias Supraventriculares",
    description: "FA, flutter, TSV, extrassístole atrial",
    questions: [
      {
        id: "m4_q1",
        text: "Qual é a característica da fibrilação atrial?",
        type: "open",
        difficulty: "easy",
        tags: ["FA", "características"]
      },
      {
        id: "m4_q2",
        text: "Como diferenciar flutter atrial de fibrilação atrial?",
        type: "multiple",
        difficulty: "medium",
        options: [
          "FA é mais rápida que flutter",
          "Flutter tem padrão regular de ondas F, FA tem ondulações desorganizadas",
          "São a mesma coisa",
          "Flutter é mais grave"
        ],
        correctAnswer: 1,
        tags: ["flutter", "FA", "diferença"]
      },
      {
        id: "m4_q3",
        text: "Qual é o impacto clínico da taquicardia supraventricular (TSV)?",
        type: "open",
        difficulty: "medium",
        tags: ["TSV", "clínica"]
      }
    ]
  },
  modulo5: {
    title: "Módulo 5: Distúrbios da Condução Atrioventricular",
    description: "BAV 1º grau, 2º grau Mobitz I/II, 3º grau",
    questions: [
      {
        id: "m5_q1",
        text: "O que caracteriza um BAV de 1º grau?",
        type: "open",
        difficulty: "easy",
        tags: ["BAV1", "definição"]
      },
      {
        id: "m5_q2",
        text: "Qual é a diferença entre BAV Mobitz I e Mobitz II?",
        type: "multiple",
        difficulty: "hard",
        options: [
          "Mobitz I tem PR progressivo, Mobitz II tem PR fixo com bloqueios",
          "Mobitz I é mais grave",
          "São iguais",
          "Mobitz I é no nó AV, Mobitz II é na mitocôndria"
        ],
        correctAnswer: 0,
        tags: ["Mobitz", "diferença"]
      },
      {
        id: "m5_q3",
        text: "Por que o BAV de 3º grau requer estimulação?",
        type: "open",
        difficulty: "hard",
        tags: ["BAV3", "clínica"]
      }
    ]
  },
  modulo6: {
    title: "Módulo 6: Condução Intraventricular",
    description: "BRD, BRE, QRS alargado",
    questions: [
      {
        id: "m6_q1",
        text: "Como identificar um bloqueio de ramo direito (BRD)?",
        type: "open",
        difficulty: "medium",
        tags: ["BRD", "identificação"]
      },
      {
        id: "m6_q2",
        text: "Qual a duração normal do QRS?",
        type: "multiple",
        difficulty: "easy",
        options: [
          "Menos de 60ms",
          "60-100ms",
          "100-120ms",
          "Acima de 120ms"
        ],
        correctAnswer: 2,
        tags: ["QRS", "duração"]
      },
      {
        id: "m6_q3",
        text: "Qual é a diferença clínica entre BRD e BRE?",
        type: "open",
        difficulty: "hard",
        tags: ["BRD", "BRE", "clínica"]
      }
    ]
  },
  modulo7: {
    title: "Módulo 7: Repolarização Ventricular",
    description: "QT, QTc, Torsades, supradesnivelamento",
    questions: [
      {
        id: "m7_q1",
        text: "O que é o intervalo QT?",
        type: "open",
        difficulty: "easy",
        tags: ["QT", "definição"]
      },
      {
        id: "m7_q2",
        text: "Por que corrigimos o QT pela frequência cardíaca?",
        type: "multiple",
        difficulty: "medium",
        options: [
          "Para padronizar a análise independente da FC",
          "Porque o QT não muda com a FC",
          "Para fazer parecer que o ritmo é normal",
          "Não há razão, é apenas tradição"
        ],
        correctAnswer: 0,
        tags: ["QTc", "correção"]
      },
      {
        id: "m7_q3",
        text: "O que causa Torsades de Pointes e qual é sua importância clínica?",
        type: "open",
        difficulty: "hard",
        tags: ["Torsades", "clínica"]
      }
    ]
  }
}
