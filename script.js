document.addEventListener("DOMContentLoaded", function () {
  // 요소 참조
  const techNameInput = document.getElementById("tech-name");
  const badgeColorInput = document.getElementById("badge-color");
  const colorPicker = document.getElementById("color-picker");
  const badgePreview = document.getElementById("badge-preview");

  // 전역 변수로 현재 마크다운 코드 저장
  let currentMarkdownCode = "";

  // 초기 뱃지 생성
  updateBadge();

  // 이벤트 리스너
  techNameInput.addEventListener("input", updateBadge);
  badgeColorInput.addEventListener("input", updateBadge);

  // 색상 선택기와 텍스트 입력 동기화
  colorPicker.addEventListener("input", function () {
    badgeColorInput.value = this.value;
    updateBadge();
  });

  badgeColorInput.addEventListener("input", function () {
    // 올바른 HEX 색상 형식인지 확인
    if (/^#[0-9A-F]{6}$/i.test(this.value)) {
      colorPicker.value = this.value;
    }
  });

  // 뱃지 클릭 시 마크다운 복사
  badgePreview.addEventListener("click", function () {
    copyToClipboard(currentMarkdownCode);
  });

  // 복사 기능 함수
  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // 복사 성공 효과
        showCopySuccess();
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err);
        alert("클립보드 복사에 실패했습니다.");
      });
  }

  // 복사 성공 효과 표시
  function showCopySuccess() {
    const notification = document.createElement("div");
    notification.className = "copy-notification";
    notification.textContent = "마크다운 코드가 복사되었습니다!";

    document.body.appendChild(notification);

    // 효과 애니메이션
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }

  // 뱃지 업데이트 함수
  function updateBadge() {
    const techName = techNameInput.value.trim() || "Tech";
    let badgeColor = badgeColorInput.value;

    // HEX 색상 코드 검증
    if (!/^#[0-9A-F]{6}$/i.test(badgeColor)) {
      badgeColor = "#F7DF1E"; // 기본값
    }

    // 뱃지 색상의 밝기에 따라 텍스트 색상 선택 (밝은 배경 -> 어두운 텍스트, 어두운 배경 -> 밝은 텍스트)
    const textColor = isLightColor(badgeColor) ? "333333" : "ffffff";

    // shields.io 뱃지 URL 생성
    const badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(techName)}-${badgeColor.substring(1)}?style=for-the-badge&logo=${encodeURIComponent(techName)}&logoColor=${textColor}`;

    // 마크다운 코드 생성 및 저장
    currentMarkdownCode = `![${techName}](${badgeUrl})`;

    // 뱃지 미리보기 업데이트
    badgePreview.innerHTML = `<img src="${badgeUrl}" alt="${techName} 뱃지" title="클릭하여 마크다운 복사">`;
  }

  // 색상 밝기 계산 함수
  function isLightColor(color) {
    // #을 제거하고 RGB 값으로 변환
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // 밝기 계산 공식 (HSP)
    const brightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    // 임계값 (128)보다 큰 경우 밝은 색상으로 판단
    return brightness > 128;
  }
});
