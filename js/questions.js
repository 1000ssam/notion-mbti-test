/**
 * Questions Data - 12 World Cup Style Questions
 */

export const questions = [
  // E/I - 협업형 vs 개인형 (3세트)
  {
    id: 1,
    dimension: 'EI',
    optionA: {
      text: '팀 프로젝트를 관리하는\n공유 워크스페이스',
      emoji: '👥',
      scale: 'E'
    },
    optionB: {
      text: '나만의 생각을 정리하는\n개인 노트',
      emoji: '📔',
      scale: 'I'
    }
  },
  {
    id: 2,
    dimension: 'EI',
    optionA: {
      text: '팀원들과 실시간으로\n함께 편집',
      emoji: '✍️',
      scale: 'E'
    },
    optionB: {
      text: '혼자 조용히\n문서 작성',
      emoji: '🤫',
      scale: 'I'
    }
  },
  {
    id: 3,
    dimension: 'EI',
    optionA: {
      text: '회의록을 공유하고\n피드백 받기',
      emoji: '💬',
      scale: 'E'
    },
    optionB: {
      text: '독서 노트를\n개인 라이브러리에 보관',
      emoji: '📚',
      scale: 'I'
    }
  },

  // S/N - 실용형 vs 창의형 (3세트)
  {
    id: 4,
    dimension: 'SN',
    optionA: {
      text: '오늘 할 일\n체크리스트',
      emoji: '✅',
      scale: 'S'
    },
    optionB: {
      text: '떠오르는 아이디어\n메모장',
      emoji: '💡',
      scale: 'N'
    }
  },
  {
    id: 5,
    dimension: 'SN',
    optionA: {
      text: '월간 캘린더로\n일정 관리',
      emoji: '📅',
      scale: 'S'
    },
    optionB: {
      text: '영감을 주는\n이미지 갤러리',
      emoji: '🎨',
      scale: 'N'
    }
  },
  {
    id: 6,
    dimension: 'SN',
    optionA: {
      text: '프로젝트 진행 상황\n트래킹',
      emoji: '📊',
      scale: 'S'
    },
    optionB: {
      text: '미래 비전과\n목표 기록',
      emoji: '🌟',
      scale: 'N'
    }
  },

  // T/F - 논리형 vs 감성형 (3세트)
  {
    id: 7,
    dimension: 'TF',
    optionA: {
      text: '복잡한 데이터베이스\n구조',
      emoji: '🗂️',
      scale: 'T'
    },
    optionB: {
      text: '예쁜 레이아웃과\n디자인',
      emoji: '✨',
      scale: 'F'
    }
  },
  {
    id: 8,
    dimension: 'TF',
    optionA: {
      text: '필터와 정렬로\n정보 분석',
      emoji: '🔍',
      scale: 'T'
    },
    optionB: {
      text: '감성적인\n커버 이미지 선택',
      emoji: '🖼️',
      scale: 'F'
    }
  },
  {
    id: 9,
    dimension: 'TF',
    optionA: {
      text: '포뮬러로\n자동화된 계산',
      emoji: '🧮',
      scale: 'T'
    },
    optionB: {
      text: '손글씨 느낌의\n폰트와 아이콘',
      emoji: '🎀',
      scale: 'F'
    }
  },

  // J/P - 계획형 vs 즉흥형 (3세트)
  {
    id: 10,
    dimension: 'JP',
    optionA: {
      text: '미리 설계된\n페이지 구조',
      emoji: '🏗️',
      scale: 'J'
    },
    optionB: {
      text: '필요할 때마다\n추가하는 페이지',
      emoji: '🌱',
      scale: 'P'
    }
  },
  {
    id: 11,
    dimension: 'JP',
    optionA: {
      text: '완성도 높은\n템플릿 사용',
      emoji: '📋',
      scale: 'J'
    },
    optionB: {
      text: '빈 페이지에서\n자유롭게 시작',
      emoji: '📄',
      scale: 'P'
    }
  },
  {
    id: 12,
    dimension: 'JP',
    optionA: {
      text: '체계적인 폴더와\n카테고리',
      emoji: '🗃️',
      scale: 'J'
    },
    optionB: {
      text: '유연하게 연결되는\n링크',
      emoji: '🔗',
      scale: 'P'
    }
  },
];
