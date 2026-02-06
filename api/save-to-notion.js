/**
 * Vercel Serverless Function - Save MBTI result to Notion
 * Supports Notion File Upload API for face images
 * API Version: 2022-06-28
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID_TEST || process.env.NOTION_DATABASE_ID;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return res.status(500).json({
      error: 'Server configuration error: Missing Notion credentials'
    });
  }

  const cleanDatabaseId = NOTION_DATABASE_ID.replace(/-/g, '');
  const { userName, faceImage, result } = req.body;

  if (!result || !result.type) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    let fileUploadId = null;

    // If face image is provided, upload to Notion via File Upload API
    if (faceImage) {
      try {
        fileUploadId = await uploadImageToNotion(faceImage, NOTION_API_KEY);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without image if upload fails
      }
    }

    // Build properties
    const properties = {
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
    };

    // Add face image if uploaded successfully
    if (fileUploadId) {
      properties['노션 페이스'] = {
        files: [
          {
            type: 'file_upload',
            file_upload: { id: fileUploadId },
            name: `${userName || 'face'}-notion-face.png`
          }
        ]
      };
    }

    // Create Notion page
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: cleanDatabaseId },
        properties,
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

/**
 * Upload image to Notion using File Upload API (3-step process)
 * Step 1: Create file upload object
 * Step 2: Send file data
 * Returns: file_upload ID
 */
async function uploadImageToNotion(base64Data, apiKey) {
  // Extract binary data from base64
  const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Content, 'base64');

  // Detect content type
  let contentType = 'image/png';
  if (base64Data.startsWith('data:image/jpeg')) contentType = 'image/jpeg';
  else if (base64Data.startsWith('data:image/webp')) contentType = 'image/webp';
  else if (base64Data.startsWith('data:image/gif')) contentType = 'image/gif';

  const ext = contentType.split('/')[1];

  // Step 1: Create file upload object
  const createRes = await fetch('https://api.notion.com/v1/file_uploads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(`File upload create failed: ${err.message || createRes.status}`);
  }

  const fileUpload = await createRes.json();
  const fileUploadId = fileUpload.id;

  // Step 2: Send the actual file data (multipart/form-data)
  const boundary = '----NotionFileUpload' + Date.now();
  const filename = `notion-face.${ext}`;

  const bodyParts = [
    `--${boundary}\r\n`,
    `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`,
    `Content-Type: ${contentType}\r\n\r\n`,
  ];

  const headerBuffer = Buffer.from(bodyParts.join(''), 'utf-8');
  const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
  const multipartBody = Buffer.concat([headerBuffer, buffer, footerBuffer]);

  const sendRes = await fetch(`https://api.notion.com/v1/file_uploads/${fileUploadId}/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length.toString(),
    },
    body: multipartBody,
  });

  if (!sendRes.ok) {
    const err = await sendRes.json();
    throw new Error(`File upload send failed: ${err.message || sendRes.status}`);
  }

  return fileUploadId;
}
