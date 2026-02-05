# 🎯 노션 MBTI 검사

당신의 노션 사용 성향을 MBTI로 분석하는 웹 애플리케이션

## 🚀 Vercel 배포 방법

### 1. GitHub에 업로드
```bash
# GitHub에 새 레포지토리 생성 후
git remote add origin https://github.com/YOUR_USERNAME/notion-mbti-test.git
git branch -M main
git push -u origin main
```

### 2. Vercel에서 배포
1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 레포지토리 선택
4. **환경변수 설정** (중요!)
   - `NOTION_API_KEY`: Notion Integration API Key
   - `NOTION_DATABASE_ID`: Notion Database ID (32자리)
5. "Deploy" 클릭

### 3. 환경변수 설정 방법
Vercel 대시보드 → 프로젝트 선택 → Settings → Environment Variables

| 변수명 | 값 |
|--------|-----|
| `NOTION_API_KEY` | secret_xxxxxxxxxxxxxxxxxxxxxxx |
| `NOTION_DATABASE_ID` | 32자리 Database ID |

끝! 몇 분 안에 배포 완료됩니다.

## ✨ 기능

- ✅ 12개 양자택일 문항 (이상형 월드컵 스타일)
- ✅ 16가지 노션 MBTI 유형 분석
- ✅ 결과 이미지 다운로드
- ✅ 결과 공유 (Web Share API)
- ✅ Notion 데이터베이스 연동
- ✅ 반응형 디자인

## 🔧 Notion 데이터베이스 설정

결과를 Notion에 저장하려면 다음 속성을 가진 데이터베이스를 생성하세요:

| 속성명 | 타입 | 설명 |
|--------|------|------|
| 이름 | Title | 사용자 이름 |
| MBTI | Rich Text | MBTI 유형 (예: INTJ) |
| 별명 | Rich Text | 유형 별명 |
| 설명 | Rich Text | 유형 설명 |
| 날짜 | Date | 테스트 날짜 |
| E/I | Number | E 퍼센티지 |
| S/N | Number | S 퍼센티지 |
| T/F | Number | T 퍼센티지 |
| J/P | Number | J 퍼센티지 |

### Notion Integration 생성
1. https://www.notion.so/my-integrations 접속
2. "New integration" 클릭
3. API Key 복사
4. 데이터베이스를 Integration에 공유

## 📁 프로젝트 구조

```
mbti-test/
├── index.html          # 메인 HTML
├── css/
│   ├── base.css       # 기본 스타일
│   ├── components.css # 컴포넌트
│   ├── layout.css     # 레이아웃
│   └── result.css     # 결과 페이지
├── js/
│   ├── app.js         # 메인 로직
│   ├── questions.js   # 문항 데이터
│   ├── mbti-calculator.js # 계산 로직
│   └── utils.js       # 유틸리티
└── data/
    └── mbti-types.json # MBTI 유형 정보
```

## 🎨 디자인 시스템

- **폰트**: Pretendard Variable
- **액센트 컬러**: #D2886F (테라코타)
- **최대 너비**: 600px (모바일 우선)
- **반응형**: 모바일, 태블릿, 데스크탑

## 📄 라이선스

MIT License

---

Made with 💜 for Notion Lovers
