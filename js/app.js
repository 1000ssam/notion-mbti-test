/**
 * Main App Logic - SPA Routing & Page Rendering
 */

import { questions } from './questions.js';
import { calculateMBTI, getMBTIDescription } from './mbti-calculator.js';
import { saveResponses, loadResponses, shareResult, captureResult, sendToNotion } from './utils.js';

// App State
let currentQuestionIndex = 0;
let responses = [];

// Initialize App
function init() {
  // Set up hash-based routing
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', handleRoute);

  // Initialize with start page
  if (!window.location.hash) {
    window.location.hash = '#start';
  }
}

// Router
function handleRoute() {
  const hash = window.location.hash || '#start';

  switch (hash) {
    case '#start':
      renderStartPage();
      break;
    case '#test':
      renderTestPage();
      break;
    case '#result':
      renderResultPage();
      break;
    default:
      renderStartPage();
  }
}

// Render Start Page
function renderStartPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section start-page">
      <h1>🎯 노션 MBTI 검사</h1>
      <p class="subtitle">당신의 노션 사용 성향은?</p>
      <p class="description">
        12개의 질문으로 알아보는<br>
        나의 노션 사용 스타일!
      </p>
      <button class="btn btn-primary btn-large" onclick="window.startTest()">
        검사 시작하기
      </button>
      <div class="footer">
        <p>💡 예상 소요 시간: 약 2분</p>
      </div>
    </div>
  `;
}

// Render Test Page
function renderTestPage() {
  if (currentQuestionIndex >= questions.length) {
    // Test complete, go to result
    window.location.hash = '#result';
    return;
  }

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section test-page">
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <span class="progress-text">${currentQuestionIndex + 1} / ${questions.length}</span>
      </div>

      <div class="question-container">
        <div class="question-header">
          <div class="question-number">질문 ${currentQuestionIndex + 1}</div>
          <h2 class="question-text">어떤 노션을 더 선호하시나요?</h2>
        </div>

        <div class="choices-container">
          <div class="choice-card" data-option="A">
            <div class="emoji">${question.optionA.emoji}</div>
            <div class="text">${question.optionA.text.replace(/\n/g, '<br>')}</div>
          </div>

          <div class="choice-card" data-option="B">
            <div class="emoji">${question.optionB.emoji}</div>
            <div class="text">${question.optionB.text.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      </div>

      <div class="nav-buttons">
        ${currentQuestionIndex > 0 ? '<button class="btn btn-secondary" onclick="window.previousQuestion()">이전</button>' : ''}
      </div>
    </div>
  `;

  // Add click event listeners to choice cards
  document.querySelectorAll('.choice-card').forEach(card => {
    card.addEventListener('click', () => {
      const option = card.dataset.option;
      handleAnswer(question.id, option);
    });
  });
}

// Render Result Page
async function renderResultPage() {
  const result = calculateMBTI(responses);
  const typeInfo = await getMBTIDescription(result.type);

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section result-page">
      <div class="result-card" id="result-card">
        <h2>당신의 노션 MBTI는</h2>
        <div class="result-type">${result.type}</div>
        <div class="result-nickname">${typeInfo.nickname}</div>
        <div class="result-description">${typeInfo.description}</div>

        <div class="result-scores">
          <h3>📊 상세 분석</h3>
          ${renderScoreDimension('E', 'I', '협업형', '개인형', result.percentages.EI)}
          ${renderScoreDimension('S', 'N', '실용형', '창의형', result.percentages.SN)}
          ${renderScoreDimension('T', 'F', '논리형', '감성형', result.percentages.TF)}
          ${renderScoreDimension('J', 'P', '계획형', '즉흥형', result.percentages.JP)}
        </div>
      </div>

      <div class="result-actions">
        <button class="btn btn-primary" onclick="window.shareResultAction()">
          📤 결과 공유하기
        </button>
        <button class="btn btn-secondary" onclick="window.captureResultAction()">
          📸 이미지 저장
        </button>
        <button class="btn btn-secondary" onclick="window.retakeTest()">
          🔄 다시 검사하기
        </button>
      </div>

      <!-- Name Input & Notion Integration -->
      <div class="notion-form">
        <h3>📝 노션에 결과 저장하기</h3>
        <p style="font-size: 0.875rem; color: var(--text-light); margin-bottom: 16px;">
          결과를 자동으로 데이터베이스에 저장해드려요
        </p>

        <div class="form-group">
          <label class="form-label">이름 (선택)</label>
          <input type="text" id="user-name" class="form-input" placeholder="홍길동">
          <span class="form-hint">이름을 입력하지 않으면 '익명'으로 저장됩니다</span>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" onclick="window.saveToNotion()" style="width: 100%;">
            💾 노션에 저장하기
          </button>
        </div>

        <div id="notion-message"></div>
      </div>

      <div class="footer">
        <p>Made with 💜 for Notion Lovers</p>
      </div>
    </div>
  `;
}

// Render score dimension
function renderScoreDimension(leftKey, rightKey, leftLabel, rightLabel, percentages) {
  const leftPercent = percentages[leftKey];
  const rightPercent = percentages[rightKey];

  return `
    <div class="score-dimension">
      <div class="dimension-label">
        <span class="dimension-left">${leftKey} ${leftLabel}</span>
        <span class="dimension-right">${rightKey} ${rightLabel}</span>
      </div>
      <div class="dimension-bar-wrapper">
        <div class="dimension-bar-fill" style="width: ${leftPercent}%"></div>
        <span class="dimension-percentage left">${leftPercent}%</span>
        <span class="dimension-percentage right">${rightPercent}%</span>
      </div>
    </div>
  `;
}

// Handle answer selection
function handleAnswer(questionId, selectedOption) {
  // Save response
  responses.push({ questionId, selectedOption });
  saveResponses(responses);

  // Move to next question
  currentQuestionIndex++;

  // Re-render test page or go to result
  if (currentQuestionIndex < questions.length) {
    renderTestPage();
  } else {
    window.location.hash = '#result';
  }
}

// Global functions
window.startTest = () => {
  currentQuestionIndex = 0;
  responses = [];
  window.location.hash = '#test';
};

window.previousQuestion = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    responses.pop();
    saveResponses(responses);
    renderTestPage();
  }
};

window.retakeTest = () => {
  currentQuestionIndex = 0;
  responses = [];
  window.location.hash = '#test';
};

window.shareResultAction = async () => {
  const result = calculateMBTI(responses);
  const typeInfo = await getMBTIDescription(result.type);
  const shareResultData = await shareResult(result.type, typeInfo.nickname);

  if (shareResultData.success || shareResultData.message) {
    alert(shareResultData.message || '공유 완료!');
  }
};

window.captureResultAction = async () => {
  const captureResultData = await captureResult('result-card');

  if (captureResultData.success) {
    alert(captureResultData.message);
  } else {
    alert('이미지 저장에 실패했습니다: ' + (captureResultData.error || ''));
  }
};

window.saveToNotion = async () => {
  const userName = document.getElementById('user-name').value.trim() || '익명';
  const messageDiv = document.getElementById('notion-message');

  // Show loading
  messageDiv.innerHTML = '<div class="message">노션에 저장하는 중...</div>';

  // Get result data
  const result = calculateMBTI(responses);
  const typeInfo = await getMBTIDescription(result.type);

  try {
    // Call Vercel serverless function
    const response = await fetch('/api/save-to-notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        result: {
          type: result.type,
          nickname: typeInfo.nickname,
          description: typeInfo.description,
          percentages: result.percentages
        }
      })
    });

    const data = await response.json();

    // Show result
    if (response.ok && data.success) {
      messageDiv.innerHTML = '<div class="message message-success">✅ ' + data.message + '</div>';
    } else {
      messageDiv.innerHTML = '<div class="message message-error">❌ 저장 실패: ' + (data.error || '알 수 없는 오류') + '</div>';
    }
  } catch (error) {
    console.error('Failed to save:', error);
    messageDiv.innerHTML = '<div class="message message-error">❌ 저장 실패: 네트워크 오류가 발생했습니다.</div>';
  }
};

// Initialize app
init();
