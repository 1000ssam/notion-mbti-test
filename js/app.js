/**
 * Main App Logic - SPA Routing & Page Rendering
 * Lanorx-style Minimal SaaS Design
 */

import { questions } from './questions.js';
import { calculateMBTI, getMBTIDescription } from './mbti-calculator.js';
import { saveResponses, loadResponses, captureResult, sendToNotion } from './utils.js';

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
    case '#face':
      renderFacePage();
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
  arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  externalLink: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  upload: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  image: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
};

// Render Start Page
function renderStartPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section start-page">
      <div class="fade-in fade-in-delay-1">
        <span class="hero-badge">
          ${icons.sparkle}
          Notiontalk 2nd Meetup
        </span>
      </div>

      <h1 class="fade-in fade-in-delay-2">
        <span class="gradient-text">노션톡 2nd 밋업</span><br>
        <span class="accent-highlight">온보딩</span>
      </h1>

      <p class="subtitle fade-in fade-in-delay-3">
        나만의 노션 페이스를 만들고<br>
        노션 MBTI를 알아보세요
      </p>

      <div class="onboarding-steps fade-in fade-in-delay-3">
        <div class="onboarding-step">
          <span class="onboarding-step-num">1</span>
          <span class="onboarding-step-text">노션 페이스 만들기</span>
        </div>
        <div class="onboarding-step">
          <span class="onboarding-step-num">2</span>
          <span class="onboarding-step-text">노션 MBTI 검사</span>
        </div>
      </div>

      <div class="cta-wrapper fade-in fade-in-delay-4">
        <button class="btn btn-primary btn-large" onclick="window.startTest()">
          시작하기
        </button>
        <div class="meta-info">
          <span class="meta-item">
            ${icons.clock}
            약 3분 소요
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

// Render Face Page (Notion Face creation guide)
function renderFacePage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section face-page">
      <div class="fade-in fade-in-delay-1">
        <span class="hero-badge">
          ${icons.sparkle}
          Step 1
        </span>
      </div>

      <h1 class="fade-in fade-in-delay-2">
        <span class="gradient-text">나만의</span><br>
        <span class="accent-highlight">노션 페이스</span> 만들기
      </h1>

      <p class="subtitle fade-in fade-in-delay-3">
        MBTI 검사 전에 나만의 노션 페이스를 만들어보세요!<br>
        완성된 이미지는 핸드폰에 저장해두세요.
      </p>

      <div class="face-guide fade-in fade-in-delay-3">
        <div class="face-step">
          <span class="face-step-num">1</span>
          <span class="face-step-text">아래 버튼을 눌러 노션 페이스를 만드세요</span>
        </div>
        <div class="face-step">
          <span class="face-step-num">2</span>
          <span class="face-step-text">완성된 이미지를 핸드폰에 저장하세요</span>
        </div>
        <div class="face-step">
          <span class="face-step-num">3</span>
          <span class="face-step-text">돌아와서 "다음" 버튼을 눌러주세요</span>
        </div>
      </div>

      <div class="cta-wrapper fade-in fade-in-delay-4">
        <a href="https://faces.notion.com" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-large">
          ${icons.externalLink} 노션 페이스 만들러 가기
        </a>
        <button class="btn btn-secondary btn-large" onclick="window.goToTest()" style="margin-top: 12px;">
          만들었어요! 다음으로 ${icons.arrowRight}
        </button>
      </div>

      <div class="footer fade-in fade-in-delay-4">
        <p>&copy; Notiontalk</p>
      </div>
    </div>
  `;

  triggerImmediateFadeIn();
}

window.goToTest = () => {
  currentQuestionIndex = 0;
  responses = [];
  window.location.hash = '#test';
};

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
      <div class="fade-in" style="text-align: center; margin-bottom: 8px;">
        <span class="hero-badge">
          ${icons.sparkle}
          Step 2
        </span>
      </div>
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
        <button class="btn btn-primary" onclick="window.captureResultAction()">
          ${icons.camera} 이미지 저장
        </button>
        <button class="btn btn-secondary" onclick="window.retakeTest()">
          ${icons.refresh} 다시 검사하기
        </button>
      </div>

      <!-- Notion Integration -->
      <div class="notion-form fade-in fade-in-delay-4">
        <h3>${icons.save} 온보딩 완료하기</h3>
        <p class="form-description">
          참가 신청 시 입력한 이름과 노션 페이스를 등록해주세요
        </p>

        <div class="form-group">
          <label class="form-label">성함</label>
          <input type="text" id="user-name" class="form-input" placeholder="참가 신청 시 입력한 이름" oninput="window.validateSaveForm()">
          <span class="form-hint">신청서에 작성한 이름과 동일하게 입력해주세요</span>
        </div>

        <div class="form-group">
          <label class="form-label">노션 페이스 이미지</label>
          <div class="image-upload-area" id="image-upload-area" onclick="document.getElementById('face-image-input').click()">
            <input type="file" id="face-image-input" accept="image/*" style="display: none;" onchange="window.onFaceImageSelected(event)">
            <div class="image-upload-placeholder" id="image-upload-placeholder">
              ${icons.upload}
              <span>이미지를 선택해주세요</span>
            </div>
            <div class="image-upload-preview" id="image-upload-preview" style="display: none;">
              <img id="face-image-preview" src="" alt="노션 페이스 미리보기">
              <button class="image-remove-btn" onclick="event.stopPropagation(); window.removeFaceImage();">&times;</button>
            </div>
          </div>
          <span class="form-hint">faces.notion.com에서 만든 이미지를 업로드해주세요</span>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary btn-save-notion" id="btn-save-notion" onclick="window.saveToNotion()" style="width: 100%;" disabled>
            온보딩 완료하기
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
  // Remove any existing answer for this question to prevent duplicates
  responses = responses.filter(r => r.questionId !== questionId);
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
  window.location.hash = '#face';
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

window.captureResultAction = async () => {
  const captureResultData = await captureResult('result-card');

  if (!captureResultData.success) {
    alert('이미지 저장에 실패했습니다: ' + (captureResultData.error || ''));
  }
};

// Face image state
let faceImageBase64 = null;

window.validateSaveForm = () => {
  const input = document.getElementById('user-name');
  const btn = document.getElementById('btn-save-notion');
  if (btn) {
    btn.disabled = !(input.value.trim() && faceImageBase64);
  }
};

window.onFaceImageSelected = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Max 5MB check
  if (file.size > 5 * 1024 * 1024) {
    alert('이미지 크기는 5MB 이하여야 합니다.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    faceImageBase64 = e.target.result;

    // Show preview
    const placeholder = document.getElementById('image-upload-placeholder');
    const preview = document.getElementById('image-upload-preview');
    const img = document.getElementById('face-image-preview');

    if (placeholder && preview && img) {
      img.src = faceImageBase64;
      placeholder.style.display = 'none';
      preview.style.display = 'flex';
    }

    window.validateSaveForm();
  };
  reader.readAsDataURL(file);
};

window.removeFaceImage = () => {
  faceImageBase64 = null;
  const input = document.getElementById('face-image-input');
  const placeholder = document.getElementById('image-upload-placeholder');
  const preview = document.getElementById('image-upload-preview');

  if (input) input.value = '';
  if (placeholder) placeholder.style.display = 'flex';
  if (preview) preview.style.display = 'none';

  window.validateSaveForm();
};

window.saveToNotion = async () => {
  const userName = document.getElementById('user-name').value.trim();
  if (!userName || !faceImageBase64) return;
  const messageDiv = document.getElementById('notion-message');

  messageDiv.innerHTML = `
    <div class="message" style="display: flex; align-items: center; gap: 8px;">
      <div class="loading-dots" style="margin: 0;">
        <span></span><span></span><span></span>
      </div>
      온보딩 처리 중...
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
        faceImage: faceImageBase64,
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
