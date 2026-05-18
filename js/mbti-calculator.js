/**
 * MBTI Calculator - Calculate MBTI type from responses
 */

import { questions } from './questions.js';

export function calculateMBTI(responses) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  // Calculate scores based on responses
  responses.forEach(({ questionId, selectedOption }) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const option = selectedOption === 'A' ? question.optionA : question.optionB;
    scores[option.scale] += 1;
  });

  // Determine dominant type for each dimension
  const type = [
    scores.E > scores.I ? 'E' : (scores.E === scores.I ? 'E' : 'I'),
    scores.S > scores.N ? 'S' : (scores.S === scores.N ? 'S' : 'N'),
    scores.T > scores.F ? 'T' : (scores.T === scores.F ? 'T' : 'F'),
    scores.J > scores.P ? 'J' : (scores.J === scores.P ? 'J' : 'P'),
  ].join('');

  // Calculate percentages (each pair sums to 100%)
  const totalEI = scores.E + scores.I || 1;
  const totalSN = scores.S + scores.N || 1;
  const totalTF = scores.T + scores.F || 1;
  const totalJP = scores.J + scores.P || 1;

  const percentages = {
    EI: {
      E: Math.round((scores.E / totalEI) * 100),
      I: Math.round((scores.I / totalEI) * 100)
    },
    SN: {
      S: Math.round((scores.S / totalSN) * 100),
      N: Math.round((scores.N / totalSN) * 100)
    },
    TF: {
      T: Math.round((scores.T / totalTF) * 100),
      F: Math.round((scores.F / totalTF) * 100)
    },
    JP: {
      J: Math.round((scores.J / totalJP) * 100),
      P: Math.round((scores.P / totalJP) * 100)
    },
  };

  return { type, scores, percentages };
}

export async function getMBTIDescription(type) {
  try {
    const response = await fetch('./data/mbti-types.json');
    const types = await response.json();
    return types[type] || {
      nickname: '알 수 없음',
      description: '유형 정보를 찾을 수 없습니다.'
    };
  } catch (error) {
    console.error('Failed to load MBTI types:', error);
    return {
      nickname: '알 수 없음',
      description: '유형 정보를 불러오는데 실패했습니다.'
    };
  }
}
