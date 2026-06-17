function showPage(pageId) {
  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
}

function startPractice() {
  const text = document.getElementById("speechText").value;

  if (text.trim() === "") {
    alert("발표문을 먼저 입력해 주세요!");
    return;
  }

  const habitCount =
    (text.match(/음/g) || []).length +
    (text.match(/어/g) || []).length +
    (text.match(/그/g) || []).length;

  document.getElementById("habitResult").textContent =
    `말버릇 표현이 약 ${habitCount}회 감지되었습니다.`;

  document.getElementById("speedResult").textContent =
    "문장 길이를 기준으로 보았을 때 발표 속도는 보통으로 예상됩니다.";

  document.getElementById("postureResult").textContent =
    "자세 분석은 웹캠 기능과 연동하여 추가할 예정입니다.";

  document.getElementById("aiFeedback").innerHTML = `
    발표문의 주제는 비교적 잘 드러납니다.<br>
    다만 도입부에 질문이나 사례를 추가하면 청중의 관심을 더 끌 수 있습니다.<br>
    결론 부분에서는 발표 내용을 한 문장으로 정리하면 전달력이 높아집니다.
  `;

  showPage("analysis");
}