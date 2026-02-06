/**
 * Main App Logic - SPA Routing & Page Rendering
 * Lanorx-style Minimal SaaS Design
 */

import { questions } from './questions.js';
import { calculateMBTI, getMBTIDescription } from './mbti-calculator.js';
import { saveResponses, loadResponses, shareResult, captureResult, sendToNotion } from './utils.js';

// App State
let currentQuestionIndex = 0;
let responses = [];

// Intersection Observer for fade-in animations
function initFadeInObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Trigger fade-in immediately for above-the-fold content
function triggerImmediateFadeIn() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('visible');
    });
  });
}

// Initialize App
function init() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', handleRoute);

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

// SVG Icons (Lucide-style line icons)
const icons = {
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  questions: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  sparkle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
  share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',
  camera: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  refresh: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
  save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  arrowLeft: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
};

// Render Start Page
function renderStartPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section start-page">
      <div class="fade-in fade-in-delay-1">
        <span class="hero-badge">
          ${icons.sparkle}
          노션 사용 성향 분석
        </span>
      </div>

      <h1 class="fade-in fade-in-delay-2">
        <span class="gradient-text">당신의 노션</span><br>
        <span class="accent-highlight">MBTI</span>는?
      </h1>

      <p class="subtitle fade-in fade-in-delay-3">
        12개의 이상형 월드컵으로 알아보는<br>
        나만의 노션 사용 스타일
      </p>

      <div class="cta-wrapper fade-in fade-in-delay-4">
        <button class="btn btn-primary btn-large" onclick="window.startTest()">
          검사 시작하기
        </button>
        <div class="meta-info">
          <span class="meta-item">
            ${icons.clock}
            약 2분 소요
          </span>
          <span class="meta-item">
            ${icons.questions}
            12문항
          </span>
        </div>
      </div>

      <div class="footer fade-in fade-in-delay-4">
        <p>&copy; Notiontalk</p>
      </div>
    </div>
  `;

  triggerImmediateFadeIn();
}

// Render Test Page
function renderTestPage() {
  if (currentQuestionIndex >= questions.length) {
    window.location.hash = '#result';
    return;
  }

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section test-page">
      <div class="progress-container fade-in">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <span class="progress-text">${currentQuestionIndex + 1} / ${questions.length}</span>
      </div>

      <div class="question-container">
        <div class="question-header fade-in fade-in-delay-1">
          <div class="question-number">Question ${String(currentQuestionIndex + 1).padStart(2, '0')}</div>
          <h2 class="question-text">어떤 노션을 더 선호하시나요?</h2>
        </div>

        <div class="choices-container">
          <div class="choice-card fade-in fade-in-delay-2" data-option="A">
            <div class="emoji">${question.optionA.emoji}</div>
            <div class="text">${question.optionA.text.replace(/\n/g, '<br>')}</div>
          </div>

          <div class="choice-card fade-in fade-in-delay-3" data-option="B">
            <div class="emoji">${question.optionB.emoji}</div>
            <div class="text">${question.optionB.text.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      </div>

      <div class="nav-buttons fade-in fade-in-delay-4">
        ${currentQuestionIndex > 0 ? `<button class="btn btn-ghost" onclick="window.previousQuestion()">${icons.arrowLeft} 이전</button>` : ''}
      </div>
    </div>
  `;

  // Add click event listeners to choice cards
  document.querySelectorAll('.choice-card').forEach(card => {
    card.addEventListener('click', () => {
      // Add selected animation
      card.classList.add('selected');
      const option = card.dataset.option;

      // Small delay for visual feedback
      setTimeout(() => {
        handleAnswer(question.id, option);
      }, 200);
    });
  });

  triggerImmediateFadeIn();
}

// Render Result Page
async function renderResultPage() {
  const app = document.getElementById('app');

  // Show loading state first
  app.innerHTML = `
    <div class="section">
      <div class="loading-container">
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>결과를 분석하고 있어요</p>
      </div>
    </div>
  `;

  const result = calculateMBTI(responses);
  const typeInfo = await getMBTIDescription(result.type);

  // Short delay for loading effect
  await new Promise(resolve => setTimeout(resolve, 800));

  app.innerHTML = `
    <div class="section result-page">
      <div class="result-card fade-in" id="result-card">
        <span class="result-badge fade-in fade-in-delay-1">노션 MBTI 결과</span>

        <div class="fade-in fade-in-delay-2" style="margin-top: 24px;">
          <div class="result-type">${result.type}</div>
          <div class="result-nickname">${typeInfo.nickname}</div>
        </div>

        <div class="result-description fade-in fade-in-delay-3">
          ${typeInfo.description}
        </div>

        <div class="result-scores fade-in fade-in-delay-4">
          <h3>상세 분석</h3>
          ${renderScoreDimension('E', 'I', '협업형', '개인형', result.percentages.EI)}
          ${renderScoreDimension('S', 'N', '실용형', '창의형', result.percentages.SN)}
          ${renderScoreDimension('T', 'F', '논리형', '감성형', result.percentages.TF)}
          ${renderScoreDimension('J', 'P', '계획형', '즉흥형', result.percentages.JP)}
        </div>
      </div>

      <div class="result-actions fade-in fade-in-delay-4">
        <button class="btn btn-primary" onclick="window.shareResultAction()">
          ${icons.share} 결과 공유하기
        </button>
        <button class="btn btn-secondary" onclick="window.captureResultAction()">
          ${icons.camera} 이미지 저장
        </button>
        <button class="btn btn-secondary" onclick="window.retakeTest()">
          ${icons.refresh} 다시 검사하기
        </button>
      </div>

      <!-- Notion Integration -->
      <div class="notion-form fade-in fade-in-delay-4">
        <h3>${icons.save} 노션에 결과 저장하기</h3>
        <p class="form-description">
          결과를 자동으로 데이터베이스에 저장해드려요
        </p>

        <div class="form-group">
          <label class="form-label">닉네임</label>
          <input type="text" id="user-name" class="form-input" placeholder="닉네임을 입력해주세요" oninput="window.onNicknameInput()">
          <span class="form-hint">닉네임을 입력해야 저장할 수 있어요</span>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary btn-save-notion" id="btn-save-notion" onclick="window.saveToNotion()" style="width: 100%;" disabled>
            노션에 저장하기
          </button>
        </div>

        <div id="notion-message"></div>
      </div>

      <div class="footer">
        <p>&copy; Notiontalk</p>
      </div>
    </div>
  `;

  triggerImmediateFadeIn();

  // Animate score bars after render
  requestAnimationFrame(() => {
    document.querySelectorAll('.dimension-bar-fill').forEach(bar => {
      const width = bar.dataset.width;
      if (width) {
        bar.style.width = width;
      }
    });
  });
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
        <div class="dimension-bar-fill" data-width="${leftPercent}%" style="width: 0%"></div>
        <span class="dimension-percentage left">${leftPercent}%</span>
        <span class="dimension-percentage right">${rightPercent}%</span>
      </div>
    </div>
  `;
}

// Handle answer selection
function handleAnswer(questionId, selectedOption) {
  responses.push({ questionId, selectedOption });
  saveResponses(responses);

  currentQuestionIndex++;

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
  window.location.hash = '#start';
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

window.onNicknameInput = () => {
  const input = document.getElementById('user-name');
  const btn = document.getElementById('btn-save-notion');
  if (btn) {
    btn.disabled = !input.value.trim();
  }
};

window.saveToNotion = async () => {
  const userName = document.getElementById('user-name').value.trim();
  if (!userName) return;
  const messageDiv = document.getElementById('notion-message');

  messageDiv.innerHTML = `
    <div class="message" style="display: flex; align-items: center; gap: 8px;">
      <div class="loading-dots" style="margin: 0;">
        <span></span><span></span><span></span>
      </div>
      노션에 저장하는 중...
    </div>
  `;

  const result = calculateMBTI(responses);
  const typeInfo = await getMBTIDescription(result.type);

  try {
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

    if (response.ok && data.success) {
      messageDiv.innerHTML = `
        <div class="message message-success">${data.message}</div>
        <div class="notion-link-card">
          <p class="notion-link-card-text">노션 교무수첩 종결자가 궁금하다면?</p>
          <a href="https://ioooss.notion.site/2nd-2fedd1dcd64480778897ff23457a9c1c?source=copy_link" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
            자세히 알아보기
          </a>
        </div>
      `;
    } else {
      messageDiv.innerHTML = '<div class="message message-error">저장 실패: ' + (data.error || '알 수 없는 오류') + '</div>';
    }
  } catch (error) {
    console.error('Failed to save:', error);
    messageDiv.innerHTML = '<div class="message message-error">저장 실패: 네트워크 오류가 발생했습니다.</div>';
  }
};

// Initialize app
init();
