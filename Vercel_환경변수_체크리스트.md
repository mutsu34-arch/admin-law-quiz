# Vercel 환경 변수 - 체크리스트

## .env.local에 있는 값 (그대로 복사)

| Name | .env.local에서 |
|------|----------------|
| CREEM_API_KEY | 2번 줄 값 |
| GEMINI_API_KEY | 6번 줄 값 |
| NEXT_PUBLIC_FIREBASE_API_KEY | 9번 줄 값 |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | 10번 줄 값 |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | 11번 줄 값 |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | 12번 줄 값 |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | 13번 줄 값 |
| NEXT_PUBLIC_FIREBASE_APP_ID | 14번 줄 값 |

---

## .env.local에 없는 값 (별도로 준비)

### 1. CREEM_WEBHOOK_SECRET

- **어디서:** Creem 대시보드 → Developers → Webhooks → 웹훅 추가 시 **Signing secret** 복사
- **참고:** 웹훅을 먼저 등록해야 시크릿이 나옵니다. 배포 URL이 있어야 웹훅 URL을 입력할 수 있어요.
- **순서:** ① Vercel 배포 → ② Creem 웹훅 등록 → ③ Signing secret 복사 → ④ Vercel 환경 변수에 추가 → ⑤ Redeploy

---

### 2. FIREBASE_SERVICE_ACCOUNT

- **로컬:** `firebase-service-account.json` 파일 사용 (경로만 .env에 있음)
- **Vercel:** 파일이 없으므로 **JSON 내용 전체**를 환경 변수에 넣어야 함

**준비 방법:**
1. `firebase-service-account.json` 파일을 메모장으로 열기
2. 내용 **전체** 복사
3. **한 줄로** 만들기 (줄바꿈 제거)
   - https://www.textfixer.com/tools/remove-line-breaks.php 에 붙여넣고 변환
4. Vercel 환경 변수 `FIREBASE_SERVICE_ACCOUNT`에 붙여넣기

---

## 최소한으로 먼저 배포하려면

- **CREEM_WEBHOOK_SECRET**: 나중에 추가해도 됨 (결제 후 유료 전환만 나중에 됨)
- **FIREBASE_SERVICE_ACCOUNT**: 웹훅용이므로, 웹훅 쓰려면 **필수**

**정리:** FIREBASE_SERVICE_ACCOUNT만 준비하면 일단 배포 가능. CREEM_WEBHOOK_SECRET은 웹훅 등록 후 추가.
