# 행정법 OX 퀴즈

각종 시험(국가직 9급, 지방직, 법원직, 변호사 시험 등)의 행정법 기출문제를 OX 퀴즈로 풀 수 있는 웹앱입니다.

## 기능

- **구글 로그인**: Firebase Authentication
- **회원 등급**: 비회원 / 무료 / 유료
- **접근 권한**:
  - 비회원: 퀴즈 + 정답
  - 무료 회원: 퀴즈 + 정답 + 기본 해설
  - 유료 회원: 퀴즈 + 정답 + 기본 해설 + 상세 해설 + 오답 노트
- **결제**: Creem.io (월 $7, 연 $77, 평생 $100)
- **관리자**: 기출문제 텍스트/파일 업로드 → AI가 OX 퀴즈·해설 생성

## 설치 및 실행

```bash
npm install
cp .env.example .env.local
# .env.local에 Firebase, Creem, OpenAI 키 입력
npm run dev
```

## 환경 변수

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase 클라이언트 설정 |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Admin JSON (한 줄) |
| `CREEM_API_KEY` | Creem API 키 (테스트: creem_test_...) |
| `CREEM_WEBHOOK_SECRET` | Creem 웹훅 시크릿 |
| `NEXT_PUBLIC_ADMIN_EMAIL` | 관리자 이메일 |
| `OPENAI_API_KEY` | OpenAI API 키 |

## Firestore 컬렉션

- `users`: 회원 프로필 (membershipTier, creemCustomerId 등)
- `sourceQuestions`: 관리자 업로드 기출문제
- `quizzes`: AI 생성 OX 퀴즈
- `wrongAnswers`: 유료 회원 오답 노트

## Creem 웹훅 URL

`https://your-domain.com/api/webhook/creem` 를 Creem 대시보드에 등록하세요.

## Firestore 인덱스

키워드 검색 시 Firestore에서 복합 인덱스 생성이 필요할 수 있습니다. 콘솔에서 안내에 따라 인덱스를 생성하세요.
