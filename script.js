function showPage(pageId) {
  const pages = document.querySelectorAll(".page");

  pages.forEach((page) => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
}

let stream = null;

async function startPractice() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    const video = document.getElementById("camera");
    video.srcObject = stream;

    document.getElementById("status").textContent =
      "🎤 발표 진행 중입니다. 카메라와 마이크가 작동하고 있어요.";

  } catch (error) {
    alert("카메라 또는 마이크 권한을 허용해주세요!");
  }
}

function stopPractice() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  document.getElementById("status").textContent =
    "✅ 발표가 종료되었습니다. AI 분석 결과를 확인해보세요.";

  document.getElementById("habitResult").textContent =
    "발표 중 불필요한 말버릇을 줄이는 연습이 필요합니다.";

  document.getElementById("speedResult").textContent =
    "발표 속도는 비교적 안정적인 편입니다.";

  document.getElementById("eyeResult").textContent =
    "시선 처리는 웹캠 분석 기능과 연결하여 확인할 예정입니다.";

  document.getElementById("postureResult").textContent =
    "자세는 안정적으로 유지하는 연습이 필요합니다.";

  document.getElementById("aiFeedback").textContent =
    "발표를 마쳤습니다. 말 속도는 안정적이지만, 발표 중 시선과 자세를 함께 신경 쓰면 전달력이 더 좋아질 수 있습니다. 추후 ChatGPT API를 연결하면 실제 발표 데이터를 바탕으로 더 구체적인 피드백을 받을 수 있습니다.";

  showPage("analysis");
}