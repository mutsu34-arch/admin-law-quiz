# Cursor에서 GitHub로 올리기 - 초보자용

---

## 준비: GitHub 저장소 만들기

1. 브라우저에서 https://github.com 접속
2. 로그인
3. 오른쪽 위 **+** 버튼 클릭 → **New repository** 선택
4. **Repository name**에 `admin-law-quiz` 입력
5. **Create repository** 클릭
6. **생성된 페이지의 URL 복사** (예: `https://github.com/내아이디/admin-law-quiz`)

---

## 방법 A: Cursor 화면에서 하기

### 1. Source Control 열기

- Cursor 왼쪽 세로 메뉴에서 **세 번째 아이콘** (가지 모양) 클릭
- 또는 키보드: `Ctrl + Shift + G`

### 2. "Initialize Repository" 클릭

- "Source Control" 패널에 **"Initialize Repository"** 버튼이 보이면 클릭
- (이미 초기화됐으면 이 단계 건너뛰기)

### 3. 파일 스테이징

- "Changes" 아래에 파일 목록이 보임
- **"Changes" 옆 + 버튼** 클릭 → 모든 파일이 스테이징됨

### 4. 커밋

- 위쪽 메시지 입력칸에 `first commit` 입력
- **✓ Commit** 버튼 클릭

### 5. GitHub에 올리기 (Publish)

- **"Publish Branch"** 버튼 클릭
- GitHub 로그인 창이 뜨면 로그인
- **Repository name**에 `admin-law-quiz` 입력
- **Publish** 클릭

---

## 방법 B: 터미널에서 하기 (화면이 안 보일 때)

Cursor 하단 **터미널**을 열고, 아래를 **한 줄씩** 순서대로 입력하세요.

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/내아이디/admin-law-quiz.git
git push -u origin main
```

> ⚠️ `내아이디`를 본인 GitHub 아이디로 바꾸세요.
> 예: 아이디가 `mutsu34`면 → `https://github.com/mutsu34/admin-law-quiz.git`

---

## GitHub 로그인

처음 push할 때 로그인 창이 뜨면:

- **Browser** 선택 → 브라우저에서 로그인
- 또는 **Token** 사용: GitHub → Settings → Developer settings → Personal access tokens 에서 토큰 생성 후 비밀번호 대신 입력

---

## 문제가 생기면

- "Git이 설치되지 않았습니다" → https://git-scm.com 에서 Git 설치
- "Permission denied" → GitHub 로그인 다시 시도
- "Repository not found" → GitHub에서 저장소를 만들었는지, URL이 맞는지 확인
