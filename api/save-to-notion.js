/**
 * Vercel Serverless Function - Save MBTI result to Notion
 * API Key is stored in environment variables (secure)
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get Notion credentials from environment variables
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return res.status(500).json({
      error: 'Server configuration error: Missing Notion credentials'
    });
  }

  // Get data from request body
  const { userName, result } = req.body;

  if (!result || !result.type) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    // Call Notion API
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          '닉네임': {
            title: [{ text: { content: userName || '익명' } }]
          },
          '노션 MBTI': {
            select: { name: `${result.type} - ${result.nickname}` }
          },
          '온보딩 완료 일시': {
            date: {
              start: new Date().toISOString(),
              time_zone: 'Asia/Seoul'
            }
          }
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Notion API Error:', error);
      return res.status(response.status).json({
        error: error.message || 'Failed to save to Notion'
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      message: 'Notion에 저장되었습니다!',
      pageId: data.id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
