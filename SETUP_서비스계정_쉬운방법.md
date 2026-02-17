# Firebase 서비스 계정 - 쉬운 방법 (파일 사용)

JSON을 .env에 넣는 대신, **파일**로 두고 경로만 적으면 됩니다.

---

## 1단계: JSON 파일 다운로드

1. https://console.firebase.google.com → **adminlawqcursor** 프로젝트
2. ⚙️ **프로젝트 설정** → **서비스 계정** 탭
3. **새 비공개 키 생성** 클릭
4. JSON 파일이 다운로드됨 (이름이 `adminlawqcursor-xxxx.json` 같은 형태)

---

## 2단계: 프로젝트 폴더에 복사

1. 다운로드한 JSON 파일을 **행정법큐** 프로젝트 폴더에 복사
2. 파일 이름을 `firebase-service-account.json` 으로 변경
3. 최종 위치: `행정법큐/firebase-service-account.json`

```
행정법큐/
  ├── firebase-service-account.json   ← 여기
  ├── .env.local
  ├── package.json
  └── ...
```

---

## 3단계: .env.local에 한 줄 추가

`.env.local` 파일을 열고 아래 줄을 추가하세요:

```
GOOGLE_APPLICATION_CREDENTIALS=firebase-service-account.json
```

(또는 `FIREBASE_SERVICE_ACCOUNT=` 줄을 이걸로 **교체**해도 됩니다)

---

## 4단계: 확인

- `firebase-service-account.json` 은 `.gitignore`에 있어서 Git에 올라가지 않습니다.
- 서버를 재시작한 뒤 웹훅이 정상 동작하는지 확인하세요.
