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
let startTime = null;
let durationText = "0분 0초";

async function startPractice() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    const video = document.getElementById("camera");
    video.srcObject = stream;

    startTime = new Date();

    document.getElementById("status").textContent =
      " 발표 진행 중입니다. 카메라와 마이크가 작동하고 있어요.";

  } catch (error) {
    alert("카메라 또는 마이크 권한을 허용해주세요!");
  }
}

function stopPractice() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  const endTime = new Date();
  const durationSeconds = startTime
    ? Math.floor((endTime - startTime) / 1000)
    : 0;

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  durationText = `${minutes}분 ${seconds}초`;

  const habit =
    "말버릇: 발표 중 ‘음’, ‘어’ 같은 표현을 줄이면 더 자신감 있어 보입니다.";

  const speed =
    durationSeconds < 30
      ? "발표 속도: 발표 시간이 짧아 내용이 빠르게 지나갈 수 있습니다. 핵심 내용을 조금 더 천천히 설명해보세요."
      : "발표 속도: 전체적으로 안정적입니다. 중요한 문장 앞뒤로 잠깐 멈추면 전달력이 더 좋아집니다.";

  const eye =
    "시선 처리: 카메라를 청중이라고 생각하고 정면을 보는 연습이 필요합니다.";

  const posture =
    "자세 안정성: 어깨를 펴고 몸을 너무 많이 흔들지 않으면 더 차분한 발표가 됩니다.";

  const feedback =
    `이번 발표 시간은 ${durationText}입니다. 발표 속도는 비교적 안정적이지만, 중요한 내용에서는 잠깐 멈추는 연습이 필요합니다. 또한 ‘음’, ‘어’ 같은 말버릇을 줄이면 발표가 더 자연스럽게 들립니다. 카메라를 청중이라고 생각하고 정면을 바라보는 연습을 하면 시선 처리도 좋아질 수 있습니다.`;

  document.getElementById("status").textContent =
    "✅ 발표가 종료되었습니다. AI 분석 결과를 확인해보세요.";

  document.getElementById("habitResult").textContent = habit;
  document.getElementById("speedResult").textContent = speed;
  document.getElementById("eyeResult").textContent = eye;
  document.getElementById("postureResult").textContent = posture;
  document.getElementById("aiFeedback").textContent = feedback;

  saveHistory(durationText, habit, speed, eye, posture);
  showPage("analysis");
}

function saveHistory(duration, habit, speed, eye, posture) {
  const history =
    JSON.parse(localStorage.getItem("presentationHistory")) || [];

  history.push({
    date: new Date().toLocaleString(),
    duration,
    habit,
    speed,
    eye,
    posture
  });

  localStorage.setItem(
    "presentationHistory",
    JSON.stringify(history)
  );

  renderHistory();
}

function deleteHistory(index) {
  const history =
    JSON.parse(localStorage.getItem("presentationHistory")) || [];

  history.splice(index, 1);

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
        <p>발표 시간: ${item.duration}</p>
        <p>${item.habit}</p>
        <p>${item.speed}</p>
        <p>${item.eye}</p>
        <p>${item.posture}</p>
        <button class="delete-btn" onclick="deleteHistory(${index})">
          기록 삭제
        </button>
      </div>
    `;
  });
}

renderHistory();