function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  if (pageId === "growth") {
    renderHistory();
  }
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

  const habit = "말버릇 사용 보통";
  const speed = "발표 속도 안정적";
  const eye = "시선 처리 양호";
  const posture = "자세 안정적";

  document.getElementById("status").textContent =
    "✅ 발표가 종료되었습니다. AI 분석 결과를 확인해보세요.";

  document.getElementById("habitResult").textContent = habit;
  document.getElementById("speedResult").textContent = speed;
  document.getElementById("eyeResult").textContent = eye;
  document.getElementById("postureResult").textContent = posture;

  document.getElementById("aiFeedback").textContent =
    "발표 속도는 안정적인 편입니다. 시선 처리와 자세도 비교적 좋지만, 말버릇을 조금 줄이면 더 자연스럽고 전달력 있는 발표가 될 수 있습니다.";

  saveHistory(habit, speed, eye, posture);
  showPage("analysis");
}

function saveHistory(habit, speed, eye, posture) {
  const history =
    JSON.parse(localStorage.getItem("presentationHistory")) || [];

  history.push({
    date: new Date().toLocaleString(),
    habit: habit,
    speed: speed,
    eye: eye,
    posture: posture
  });

  localStorage.setItem(
    "presentationHistory",
    JSON.stringify(history)
  );

  renderHistory();
}

function renderHistory() {
  const history =
    JSON.parse(localStorage.getItem("presentationHistory")) || [];

  const historyList = document.getElementById("historyList");

  if (!historyList) return;

  if (history.length === 0) {
    historyList.innerHTML = `
      <div class="growth-box">
        아직 발표 기록이 없습니다.
      </div>
    `;
    return;
  }

  historyList.innerHTML = "";

  history.forEach((item, index) => {
    historyList.innerHTML += `
      <div class="growth-box">
        <h3>${index + 1}회차 발표 기록</h3>
        <p>날짜: ${item.date}</p>
        <p>말버릇: ${item.habit}</p>
        <p>발표 속도: ${item.speed}</p>
        <p>시선 처리: ${item.eye}</p>
        <p>자세 안정성: ${item.posture}</p>
      </div>
    `;
  });
}

renderHistory();