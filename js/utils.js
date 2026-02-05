/**
 * Utility Functions - Storage, Share, Capture
 */

// LocalStorage helpers
export function saveResponses(responses) {
  localStorage.setItem('mbti-responses', JSON.stringify(responses));
}

export function loadResponses() {
  const saved = localStorage.getItem('mbti-responses');
  return saved ? JSON.parse(saved) : [];
}

export function saveResult(result) {
  localStorage.setItem('mbti-result', JSON.stringify(result));
}

export function loadResult() {
  const saved = localStorage.setItem('mbti-result');
  return saved ? JSON.parse(saved) : null;
}

export function clearStorage() {
  localStorage.removeItem('mbti-responses');
  localStorage.removeItem('mbti-result');
}

// Share result
export async function shareResult(mbtiType, nickname) {
  const shareText = `나의 노션 MBTI는 ${mbtiType} - ${nickname}입니다!`;
  const shareUrl = window.location.origin + window.location.pathname + '#result';

  const shareData = {
    title: '노션 MBTI 검사 결과',
    text: shareText,
    url: shareUrl
  };

  // Check if Web Share API is available (mainly on mobile)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { success: true, message: '공유 완료!' };
    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled, try clipboard instead
        return await copyToClipboard(shareText + '\n' + shareUrl);
      }
      // Other error, fallback to clipboard
      return await copyToClipboard(shareText + '\n' + shareUrl);
    }
  } else {
    // Desktop: fallback to clipboard
    return await copyToClipboard(shareText + '\n' + shareUrl);
  }
}

// Copy to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: '링크가 복사되었습니다!' };
  } catch (error) {
    console.error('Failed to copy:', error);
    return { success: false, error: 'Failed to copy link' };
  }
}

// Capture result as image
export async function captureResult(elementId = 'result-card') {
  // Check if html2canvas is loaded
  if (typeof html2canvas === 'undefined') {
    return { success: false, error: 'html2canvas 라이브러리가 로드되지 않았습니다.' };
  }

  const element = document.getElementById(elementId);
  if (!element) {
    return { success: false, error: 'Element not found' };
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    const image = canvas.toDataURL('image/png');

    // Download image
    const link = document.createElement('a');
    link.download = `notion-mbti-result-${Date.now()}.png`;
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, message: '이미지가 다운로드되었습니다!' };
  } catch (error) {
    console.error('Failed to capture:', error);
    return { success: false, error: error.message || 'Failed to capture image' };
  }
}

// Send to Notion (DEPRECATED - Now using Vercel Function)
// This function is kept for backward compatibility but not used
export async function sendToNotion(result, userName, databaseId, apiKey) {
  // Remove dashes from database ID if present
  const cleanDatabaseId = databaseId.replace(/-/g, '');

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: cleanDatabaseId },
        properties: {
          '이름': {
            title: [{ text: { content: userName || '익명' } }]
          },
          'MBTI': {
            rich_text: [{ text: { content: result.type } }]
          },
          '별명': {
            rich_text: [{ text: { content: result.nickname } }]
          },
          '설명': {
            rich_text: [{ text: { content: result.description } }]
          },
          '날짜': {
            date: { start: new Date().toISOString().split('T')[0] }
          },
          'E/I': {
            number: result.percentages.EI.E
          },
          'S/N': {
            number: result.percentages.SN.S
          },
          'T/F': {
            number: result.percentages.TF.T
          },
          'J/P': {
            number: result.percentages.JP.J
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Notion API Error:', error);

      // Provide helpful error messages
      if (error.code === 'object_not_found') {
        return { success: false, error: 'Database ID를 찾을 수 없습니다. ID를 확인해주세요.' };
      } else if (error.code === 'unauthorized') {
        return { success: false, error: 'API Key가 유효하지 않거나 권한이 없습니다.' };
      } else if (error.code === 'validation_error') {
        return { success: false, error: '데이터베이스 속성 구조가 맞지 않습니다. 속성명을 확인해주세요.' };
      }

      return { success: false, error: error.message || 'Notion 저장 실패' };
    }

    return { success: true, message: 'Notion에 저장되었습니다!' };
  } catch (error) {
    console.error('Failed to send to Notion:', error);

    // CORS error
    if (error.message.includes('CORS') || error.message.includes('fetch')) {
      return {
        success: false,
        error: 'CORS 에러: 브라우저에서 직접 Notion API를 호출할 수 없습니다. Vercel 등에 배포하거나 Make.com Webhook을 사용해주세요.'
      };
    }

    return { success: false, error: error.message };
  }
}

// Format percentage for display
export function formatPercentage(value) {
  return Math.round(value);
}
