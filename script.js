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
// [기능 1] 사용자가 입력한 API 키를 브라우저에 임시 저장하는 마법
function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value;
  if (key) {
    localStorage.setItem('GEMINI_API_KEY', key);
    alert('비밀번호(API 키)가 안전하게 저장되었습니다! 🐻');
  } else {
    alert('API 키를 입력창에 적어주세요!');
  }
}

// [기능 2] 구글 AI에게 발표 데이터를 보내고 대답을 받아오는 마법
async function startAIFeedbackTest() {
  const apiKey = localStorage.getItem('GEMINI_API_KEY');
  const responseArea = document.getElementById('responseArea');

  // 키를 저장 안 했으면 경고창 띄우기
  if (!apiKey) {
    alert("화면 상단에 API 키를 입력하고 [키 저장하기]를 먼저 눌러주세요!");
    return;
  }

  // 상자에 로딩 글씨 띄우기
  responseArea.innerText = "곰돌이 AI 코치가 발표 데이터를 분석 중입니다... 🐾 잠시만 기다려주세요!";

  // 가상의 발표 결과 데이터 (나중에 카메라 연동할 때 진짜 수치로 바뀔 거예요)
  const swayCount = 8;        // 몸 흔들림 8회
  const badHabitCount = 7;    // 말버릇 '음...' 7회
  const gazePercent = 65;     // 정면 응시율 65%

  // 구글 제미나이 AI에게 보낼 편지내용(프롬프트)
  const myPrompt = `
    사용자가 발표 연습을 마쳤습니다. 다음 데이터를 바탕으로 친근하고 귀여운 곰돌이 코치 말투로 종합 피드백을 작성해 주세요.
    - 몸 흔들림: ${swayCount}회
    - 말버릇 사용: ${badHabitCount}회
    - 시선 처리: 정면 응시율 ${gazePercent}%
    잘한 점과 개선할 점을 데이터 수치를 언급하며 친절하게 격려해 주세요.
  `;

  try {
    // 구글 AI 서버 주소 (최신 Gemini 2.5 Flash 모델)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    // 인터넷을 통해 구글 서버에 요청 보내기
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: myPrompt }] }]
      })
    });

    // 구글의 대답 가공하기
    const data = await response.json();
    
    // 대답에서 글자만 쏙 빼내기
    const aiAnswer = data.candidates[0].content.parts[0].text;
    
    // 우리 웹앱 화면 상자에 AI 글씨 채워넣기
    responseArea.innerText = aiAnswer;

  } catch (error) {
    console.error(error);
    responseArea.innerText = "❌ 에러가 발생했습니다! API 키가 정확한지 다시 확인해 주세요.";
  }
}