function showPage(pageId) {
  const pages = document.querySelectorAll(".page");

  pages.forEach((page) => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
}

let stream = null;
let timerInterval = null;
let seconds = 0;

async function startPractice() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    const video = document.getElementById("camera");
    video.srcObject = stream;

    seconds = 0;

    timerInterval = setInterval(() => {
      seconds++;

      const min = String(Math.floor(seconds / 60)).padStart(2, "0");
      const sec = String(seconds % 60).padStart(2, "0");

      document.getElementById("timer").textContent =
        `${min}:${sec}`;
    }, 1000);

    document.getElementById("liveHabit").textContent =
      "발표 분석 중...";

  } catch (error) {
    alert("카메라 또는 마이크 권한을 허용해주세요!");
  }
}

function stopPractice() {

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  clearInterval(timerInterval);

  document.getElementById("habitResult").textContent =
    "음..., 어... 등의 말버릇 분석 예정";

  document.getElementById("speedResult").textContent =
    "발표 속도 분석 예정";

  document.getElementById("eyeResult").textContent =
    "시선 처리 분석 예정";

  document.getElementById("postureResult").textContent =
    "자세 안정성 분석 예정";

  document.getElementById("aiFeedback").textContent =
    "발표가 종료되었습니다. 추후 ChatGPT API와 MediaPipe를 연결하여 실제 분석 결과를 제공할 예정입니다.";

  document.getElementById("liveHabit").textContent =
    "분석 완료";
}