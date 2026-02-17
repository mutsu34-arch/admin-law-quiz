# Creem 웹훅 설정 - 결제 후 유료 회원 자동 업그레이드

웹훅을 설정하면 결제 완료 시 자동으로 회원 등급이 "유료"로 변경됩니다.

---

## 1. Firebase 서비스 계정 (필수)

웹훅은 서버에서 Firestore를 수정하므로 **Firebase Admin** 설정이 필요합니다.

### 1-1. 서비스 계정 키 다운로드

1. https://console.firebase.google.com → **adminlawqcursor** 프로젝트
2. ⚙️ **프로젝트 설정** → **서비스 계정** 탭
3. **새 비공개 키 생성** 클릭 → JSON 파일 다운로드

### 1-2. .env.local에 추가

1. 다운로드한 JSON 파일을 메모장으로 열기
2. **한 줄로** 만들기 (줄바꿈, 공백 제거)
3. `.env.local`에서 `FIREBASE_SERVICE_ACCOUNT=` 뒤에 붙여넣기

```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"adminlawqcursor",...}
```

> 💡 JSON을 한 줄로 만드는 방법: https://www.textfixer.com/tools/remove-line-breaks.php 에 붙여넣고 변환

---

## 2. Firestore 데이터베이스 생성

1. Firebase 콘솔 → **Firestore Database** → **데이터베이스 만들기**
2. **테스트 모드로 시작** 선택 (나중에 규칙 수정)
3. 위치 선택 (예: asia-northeast3) → **사용 설정**

---

## 3. Firestore 규칙 설정

1. Firebase 콘솔 → **Firestore Database** → **규칙** 탭
2. 아래 규칙으로 저장 (개발용 - 나중에 보안 강화 필요)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

> ⚠️ 서버(웹훅)는 Admin SDK를 사용하므로 이 규칙과 무관하게 쓰기 가능합니다.

---

## 4. Creem 웹훅 설정

### 4-1. 로컬 테스트 (ngrok 사용)

로컬에서는 Creem이 직접 접속할 수 없으므로 **ngrok**으로 터널을 뚫습니다.

1. https://ngrok.com 에서 가입 후 ngrok 설치
2. 터미널에서:
   ```bash
   ngrok http 3002
   ```
3. 나오는 `https://xxxx.ngrok.io` 주소 복사

### 4-2. Creem 대시보드에 웹훅 등록

1. https://creem.io/dashboard → **Developers** → **Webhooks**
2. **Add webhook** 클릭
3. **URL**: `https://xxxx.ngrok.io/api/webhook/creem` (ngrok 주소 사용)
4. **Events**: `subscription.created`, `subscription.cancelled` 등 구독 관련 이벤트 선택
5. **Signing secret** 복사 → `.env.local`의 `CREEM_WEBHOOK_SECRET=` 뒤에 붙여넣기

### 4-3. 배포 후 (실제 도메인)

Vercel 등에 배포했다면:

- **URL**: `https://your-domain.com/api/webhook/creem`
- Creem 대시보드에서 URL을 실제 도메인으로 변경

---

## 5. 확인

1. `npm install` (firebase-admin 설치)
2. 서버 재시작
3. 결제 테스트 → Creem 웹훅 발송 → Firestore `users/{uid}` 업데이트
4. 페이지 새로고침 또는 홈으로 이동 → "⭐ 유료 회원" 표시 확인
