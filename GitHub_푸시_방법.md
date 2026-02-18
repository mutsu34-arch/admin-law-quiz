# GitHub 푸시 오류 해결 방법

## 원인
**"The provided GitHub repository does not contain the requested branch or commit reference"** 오류는  
GitHub 저장소가 **비어 있거나**, 지정한 브랜치에 **코드가 푸시되지 않았을 때** 발생합니다.

현재 로컬 Git에는 `main` 브랜치와 `first commit`이 있지만, **원격(origin)이 설정되지 않았거나 푸시가 되지 않은 상태**입니다.

---

## 해결 방법

### 1단계: GitHub 저장소 확인
- https://github.com 에서 `admin-law-quiz` 저장소가 있는지 확인
- 없다면: **New repository** → 이름 `admin-law-quiz` → **Create repository**
- 있다면: 저장소가 **비어 있는지** 확인 (README만 있어도 됨)

### 2단계: Cursor 터미널에서 원격 추가 및 푸시

**원격 URL은 이미 `mutsu34-7353`으로 설정되어 있습니다.**

```powershell
cd "c:\Users\mutsu\Desktop\행정법큐"

# 원격이 이미 있으면 생략
# git remote add origin https://github.com/mutsu34-7353/admin-law-quiz.git

# 현재 변경사항 커밋 (선택)
git add .
git commit -m "Add Vercel 배포 가이드"

# main 브랜치 푸시
git push -u origin main
```

### 3단계: 푸시 후 Vercel에서 다시 시도
1. https://vercel.com/new 접속
2. **Import** → `admin-law-quiz` 저장소 선택
3. **Import** 클릭
4. 환경 변수 설정 후 **Deploy**

---

## 주의사항
- GitHub 사용자명이 `YOUR_GITHUB_USERNAME`이 아니라 실제 아이디여야 합니다.
- 푸시 시 GitHub 로그인 창이 뜨면 로그인하거나, Personal Access Token을 사용하세요.
- `main`이 아닌 `master` 브랜치를 사용 중이라면: `git push -u origin master` 로 푸시하세요.
