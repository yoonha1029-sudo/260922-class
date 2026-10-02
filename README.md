# 과학 자료실

중학교 2·3학년 수업 자료를 제공하는 정적 웹사이트 초안입니다. HTML, CSS, 바닐라 JavaScript와 JSON만 사용하며 빌드 단계, 외부 CDN, 외부 글꼴, 분석 도구, 추적 스크립트, 외부 폼이 없습니다. 개인정보를 입력하거나 저장하는 기능도 없습니다.

## 로컬에서 확인하기

단원 정보는 `fetch()`로 `data/units.json`에서 읽습니다. 브라우저에서 HTML 파일을 `file://` 주소로 직접 열면 보안 제한으로 JSON을 불러오지 못할 수 있으므로 로컬 서버를 사용하세요.

Python이 설치되어 있다면 저장소 루트에서 다음 명령을 실행합니다.

```sh
python -m http.server 8000
```

브라우저에서 `http://localhost:8000/`을 열고, 종료할 때는 서버 터미널에서 `Ctrl+C`를 누릅니다. Python을 사용할 수 없다면 VS Code의 Live Server 등 정적 파일 서버를 이용할 수 있습니다.

## 배포

GitHub 저장소를 Netlify 또는 Vercel에 연결하고 별도 빌드 명령 없이 저장소 루트를 배포하면 됩니다. 상세 단계는 [배포 안내](docs/DEPLOY.md)를 참고하세요.

## 공개 범위와 검색

`robots.txt`와 모든 HTML 페이지의 `noindex` 메타 태그는 검색 엔진에 수집하지 말라고 요청합니다. 이는 접근 통제가 아니며, 기본 배포 주소를 아는 사람은 자료를 볼 수 있습니다. 실제로 접근을 제한해야 한다면 학교 계정 제한, 호스팅 플랫폼의 비밀번호 보호, 인증 서비스 연동을 검토하세요. 개인정보가 포함된 자료를 올리지 마세요.

## 파일 구성

- `index.html`: 홈 및 최근 수정 단원
- `grade.html`: 학년별 단원 목록 (`?g=2`, `?g=3`)
- `unit.html`: 단원 공통 템플릿 (`?id=g2-u6` 등)
- `data/units.json`: 모든 단원 정보의 단일 관리 장소
- `content/`: PDF 및 기타 자료 파일
- `assets/`: 공통 스타일, 동작, 이미지
- `docs/`: 설계 명세와 자료 작성·배포 안내

단원마다 별도 HTML을 만들지 않고 공통 템플릿 하나를 사용해 새 자료 추가 시 파일과 JSON 항목만 관리하도록 했습니다.

## 자료 수정

단원 JSON에는 명세에 정한 `id`, `grade`, `order`, `title`, `updated`, `worksheets`, `virtualLabs`, `resources` 필드만 사용합니다. 자료 카드의 필수 항목은 제목과 파일 또는 URL이며, 설명은 선택입니다. 상세 예시와 PDF 연결법은 [자료 추가 안내](docs/CONTENT_GUIDE.md)를 참고하세요.

현재 3학년 2단원에는 `content/grade3/unit2/2-1.pdf`, `content/grade3/unit2/2-2.pdf`가 연결되어 있습니다. 2학년 6단원의 자료는 교체용 `(샘플)` 항목입니다.
