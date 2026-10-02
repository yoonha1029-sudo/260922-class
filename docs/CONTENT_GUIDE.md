# 콘텐츠 작성 안내

단원 정보는 `data/units.json`의 `units` 배열에서 관리합니다. 명세에서 정한 단원 필드는 `id`, `grade`, `order`, `title`, `updated`, `worksheets`, `virtualLabs`, `resources`뿐입니다. 단원 소개, 핵심 개념, 차시 목록 등 다른 필드는 추가하지 마세요.

## 단원 항목 복사 예시

새 단원을 추가하려면 아래 항목을 복사해 `units` 배열 안에 넣고, ID는 기존 항목과 겹치지 않게 바꾸세요. 아직 없는 자료 분류는 빈 배열 `[]`로 둘 수 있습니다. 실자료가 아닌 예시 제목이나 설명에는 `(샘플)`을 표시합니다.

```json
{
  "id": "g2-u1",
  "grade": 2,
  "order": 1,
  "title": "단원 제목",
  "updated": "2026-10-02",
  "worksheets": [
    {
      "title": "(샘플) 학습지 제목",
      "file": "grade2/unit1/worksheet.pdf",
      "description": "(샘플) 자료 설명"
    }
  ],
  "virtualLabs": [
    {
      "title": "(샘플) 가상실험 제목",
      "url": "https://example.com/",
      "description": "(샘플) 자료 설명"
    }
  ],
  "resources": [
    {
      "title": "(샘플) 영상 또는 복습 자료 제목",
      "url": "https://example.com/",
      "description": "(샘플) 자료 설명"
    }
  ]
}
```

JSON 항목 사이에는 쉼표를 넣고 마지막 항목 뒤에는 쉼표를 쓰지 않습니다. 문자열은 큰따옴표로 감쌉니다. 단원 ID와 자료 카드의 필수 항목을 빠뜨리지 마세요.

## 자료 분류와 카드 필드

- `worksheets`: PDF 학습지. 카드마다 `title`과 `file`을 적습니다.
- `virtualLabs`: 가상실험 등 외부 시뮬레이션 링크. 카드마다 `title`과 `url`을 적습니다.
- `resources`: 영상, 복습 자료 등 나머지 자료. 카드마다 `title`과 `url` 또는 `file`을 적습니다.
- 각 자료의 `description`은 선택 항목입니다. 한 줄 설명이 있으면 적고, 없으면 생략합니다.
- 자료가 없는 분류는 빈 배열이나 생략으로 둡니다. 화면에서 해당 분류를 숨기며 세 분류가 모두 비면 “자료 준비 중”으로 표시합니다.

## PDF 파일 연결

1. PDF를 `content/` 아래 단원 폴더에 넣습니다. 예: `content/grade2/unit1/worksheet.pdf`
2. JSON의 `file`에는 `content/` 뒤 경로만 적습니다. 예: `grade2/unit1/worksheet.pdf`
3. PDF마다 `worksheets` 항목을 하나씩 만들고 `title`, `file`을 채웁니다.
4. 로컬 서버로 단원 페이지를 열어 미리보기, 새 창 열기, 다운로드를 확인합니다.

파일이 없거나 경로가 잘못되면 사이트는 미리보기를 만들지 않고 “미등록” 안내를 표시합니다. 파일명과 대소문자를 실제 경로와 똑같이 입력하세요.

## 필드 설명

- `id`: 고유 ID. URL은 `unit.html?id=g2-u1` 형식입니다.
- `grade`: 학년 숫자 (`2` 또는 `3`)
- `order`: 학년 안에서 단원 순서를 나타내는 숫자
- `title`: 단원명
- `updated`: 마지막 수정일 (`YYYY-MM-DD`)
- `worksheets`, `virtualLabs`, `resources`: 위 분류별 자료 카드 배열

외부 URL은 HTTP 또는 HTTPS 링크를 사용하세요. 외부 링크는 새 탭에서 열립니다. 학생 이름, 학번, 성적, 제출물 등 개인정보가 포함된 자료는 추가하지 마세요.
