/**
 * Questions Data - 12 World Cup Style Questions
 */

export const questions = [
  // E/I - 협업형 vs 개인형 (3세트)
  {
    id: 1,
    dimension: 'EI',
    optionA: {
      text: '팀원들과 브레인스토밍하며\n아이디어 발전시키기',
      emoji: '👥',
      scale: 'E'
    },
    optionB: {
      text: '조용히 혼자 깊게\n생각 정리하기',
      emoji: '🎧',
      scale: 'I'
    }
  },
  {
    id: 2,
    dimension: 'EI',
    optionA: {
      text: '모르는 건 바로\n커뮤니티에 질문하기',
      emoji: '🙋',
      scale: 'E'
    },
    optionB: {
      text: '스스로 검색하고\n시행착오로 해결하기',
      emoji: '🔎',
      scale: 'I'
    }
  },
  {
    id: 3,
    dimension: 'EI',
    optionA: {
      text: '작업 과정을\n실시간 공유하며 진행',
      emoji: '📢',
      scale: 'E'
    },
    optionB: {
      text: '완성된 결과물만\n깔끔하게 공유',
      emoji: '📝',
      scale: 'I'
    }
  },

  // S/N - 실용형 vs 창의형 (3세트)
  {
    id: 4,
    dimension: 'SN',
    optionA: {
      text: '오늘 할 일을\n하나씩 체크하는 노션',
      emoji: '✅',
      scale: 'S'
    },
    optionB: {
      text: '떠오르는 아이디어를\n자유롭게 쏟아내는 노션',
      emoji: '💡',
      scale: 'N'
    }
  },
  {
    id: 5,
    dimension: 'SN',
    optionA: {
      text: '검증된 템플릿을\n그대로 활용하기',
      emoji: '📋',
      scale: 'S'
    },
    optionB: {
      text: '나만의 시스템을\n처음부터 실험하기',
      emoji: '🧪',
      scale: 'N'
    }
  },
  {
    id: 6,
    dimension: 'SN',
    optionA: {
      text: '숫자와 데이터로\n현황을 한눈에 파악',
      emoji: '📊',
      scale: 'S'
    },
    optionB: {
      text: '영감 모음과\n무드보드로 방향 설정',
      emoji: '🌌',
      scale: 'N'
    }
  },

  // T/F - 논리형 vs 감성형 (3세트)
  {
    id: 7,
    dimension: 'TF',
    optionA: {
      text: '장단점을 표로 정리해서\n논리적으로 결정',
      emoji: '🗂️',
      scale: 'T'
    },
    optionB: {
      text: '사람들 경험담을 듣고\n직감으로 결정',
      emoji: '💬',
      scale: 'F'
    }
  },
  {
    id: 8,
    dimension: 'TF',
    optionA: {
      text: '데이터베이스 속성을\n꼼꼼하게 설계',
      emoji: '📐',
      scale: 'T'
    },
    optionB: {
      text: '컬러와 아이콘으로\n분위기부터 세팅',
      emoji: '🎨',
      scale: 'F'
    }
  },
  {
    id: 9,
    dimension: 'TF',
    optionA: {
      text: '자동화와 연동으로\n효율을 극대화',
      emoji: '⚙️',
      scale: 'T'
    },
    optionB: {
      text: '하나하나 직접 채워가는\n손맛의 즐거움',
      emoji: '✍️',
      scale: 'F'
    }
  },

  // J/P - 계획형 vs 즉흥형 (3세트)
  {
    id: 10,
    dimension: 'JP',
    optionA: {
      text: '시작 전에 구조부터\n완벽하게 설계',
      emoji: '🏗️',
      scale: 'J'
    },
    optionB: {
      text: '일단 시작하고\n하면서 구조를 잡아가기',
      emoji: '🌱',
      scale: 'P'
    }
  },
  {
    id: 11,
    dimension: 'JP',
    optionA: {
      text: '주간/월간 리뷰로\n꾸준히 정리하는 편',
      emoji: '📅',
      scale: 'J'
    },
    optionB: {
      text: '정리는 필요할 때\n몰아서 한번에',
      emoji: '🌊',
      scale: 'P'
    }
  },
  {
    id: 12,
    dimension: 'JP',
    optionA: {
      text: '모든 페이지에\n명확한 분류 체계',
      emoji: '🗃️',
      scale: 'J'
    },
    optionB: {
      text: '분류보다는 검색과\n링크로 빠르게 찾기',
      emoji: '🔗',
      scale: 'P'
    }
  },
];
