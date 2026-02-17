# 2단계: 구글 로그인 설정하기

코드는 이미 추가되어 있습니다. 아래 순서대로 Firebase를 설정하면 됩니다.

---

## 1. Firebase 프로젝트 만들기

1. https://console.firebase.google.com 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력 (예: admin-law-quiz) → 다음
4. Google Analytics는 필요 없으면 끄고 → 프로젝트 만들기

---

## 2. 웹 앱 등록

1. Firebase 콘솔에서 **프로젝트 개요** 옆 톱니바퀴 → **프로젝트 설정**
2. **일반** 탭에서 아래로 스크롤
3. **내 앱** → **</>** (웹) 아이콘 클릭
4. 앱 닉네임 입력 (예: 행정법퀴즈) → **앱 등록**
5. 나오는 설정값을 복사해둡니다 (나중에 .env.local에 넣을 거예요)

---

## 3. 구글 로그인 사용 설정

1. Firebase 콘솔 왼쪽 메뉴 **빌드** → **Authentication**
2. **시작하기** 클릭
3. **Sign-in 방법** 탭 → **Google** 선택
4. **사용 설정** 켜기 → **저장**

---

## 4. .env.local에 값 넣기

`.env.local` 파일을 열고, Firebase 섹션을 아래처럼 **실제 값**으로 바꾸세요:

```
NEXT_PUBLIC_FIREBASE_API_KEY=여기에_복사한_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=프로젝트ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=프로젝트ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=프로젝트ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=숫자
NEXT_PUBLIC_FIREBASE_APP_ID=1:숫자:web:영문숫자
```

> ⚠️ Firebase Admin과 FIREBASE_SERVICE_ACCOUNT는 **지금은 비워두어도 됩니다.**  
> 나중에 Firestore(DB)를 쓸 때만 필요해요.

---

## 5. 서버 재시작

`.env.local`을 수정했으면 터미널에서:

1. `Ctrl + C` 로 서버 종료
2. `npm run dev` 다시 실행
3. 브라우저에서 **구글 로그인** 버튼 클릭

---

## ❓ 문제가 생겼을 때

### "Firebase가 설정되지 않았습니다"
→ .env.local의 Firebase 값이 아직 placeholder(예: AIza..., your-project)인지 확인하세요.

### "auth/unauthorized-domain"
→ Firebase 콘솔 → Authentication → 설정 → **승인된 도메인**에 `localhost`가 있는지 확인하세요. (보통은 자동으로 추가됨)

### "auth/popup-blocked"
→ 브라우저가 팝업을 막았을 수 있어요. 팝업 허용을 켜거나, 시크릿 창에서 시도해보세요.
