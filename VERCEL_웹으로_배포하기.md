# Vercel 배포 - GitHub로 (CLI 없이)

CLI가 안 될 때, GitHub에 올리고 Vercel 웹에서 연결하는 방법입니다.

---

## 1단계: GitHub 저장소 만들기

1. https://github.com 접속 후 로그인
2. 오른쪽 위 **+** → **New repository**
3. Repository name: `admin-law-quiz`
4. **Create repository** 클릭 (README 등 추가 안 해도 됨)

---

## 2단계: Cursor에서 GitHub에 올리기

1. Cursor 왼쪽 **Source Control** (또는 `Ctrl+Shift+G`) 클릭
2. **Initialize Repository** 클릭 (처음이면)
3. 변경된 파일들이 보이면 **+** 눌러서 모두 스테이징
4. 위에 메시지 입력: `Initial commit`
5. **✓ Commit** 클릭
6. **Publish Branch** 클릭 → GitHub 선택 → `admin-law-quiz` 저장소 선택

> ⚠️ `.env.local`, `firebase-service-account.json`은 .gitignore에 있어서 자동으로 제외됩니다.

---

## 3단계: Vercel에서 GitHub 연결

1. https://vercel.com/new 접속
2. **Import Git Repository**에서 방금 만든 `admin-law-quiz` 선택
3. **Import** 클릭
4. **Environment Variables** 섹션에서 아래 변수 추가 (Add 입력 후 다음 변수):

   | Name | Value |
   |------|-------|
   | CREEM_API_KEY | (값 붙여넣기) |
   | CREEM_WEBHOOK_SECRET | (값 붙여넣기) |
   | GEMINI_API_KEY | (값 붙여넣기) |
   | NEXT_PUBLIC_FIREBASE_API_KEY | (값 붙여넣기) |
   | NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | adminlawqcursor.firebaseapp.com |
   | NEXT_PUBLIC_FIREBASE_PROJECT_ID | adminlawqcursor |
   | NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | adminlawqcursor.firebasestorage.app |
   | NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | 537201900424 |
   | NEXT_PUBLIC_FIREBASE_APP_ID | 1:537201900424:web:a524bf29701fa84c44183d |
   | FIREBASE_SERVICE_ACCOUNT | (firebase-service-account.json 전체 내용 한 줄로) |

5. **Deploy** 클릭

---

## 4단계: Creem 웹훅 설정

1. 배포 완료 후 `https://admin-law-quiz-xxx.vercel.app` 같은 URL 확인
2. Creem 대시보드 → Webhooks → URL을 `https://주소.vercel.app/api/webhook/creem` 로 설정
