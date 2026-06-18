// [기능 1] 메뉴 전환 함수 (analysis 화면도 열리도록 수정 완료!)
function showPage(pageId) {
  // 모든 페이지를 숨김
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  // 클릭한 페이지를 보여줌
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
}

// [기능 2] 사용자가 입력한 API 키를 브라우저에 임시 저장
function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value;
  if (key) {
    localStorage.setItem('GEMINI_API_KEY', key);
    alert('비밀번호(API 키)가 안전하게 저장되었습니다! ');
  } else {
    alert('API 키를 입력창에 적어주세요!');
  }
}

// [기능 3] 구글 AI에게 발표 데이터를 보내고 대답을 받아오기
async function startAIFeedbackTest() {
  const apiKey = localStorage.getItem('GEMINI_API_KEY');
  const responseArea = document.getElementById('responseArea');

  if (!apiKey) {
    alert("화면 상단에 API 키를 입력하고 [키 저장하기]를 먼저 눌러주세요!");
    return;
  }

  responseArea.innerText = "곰돌이 AI 코치가 발표 데이터를 분석 중입니다... 🐾 잠시만 기다려주세요!";

  // 가상의 데이터 (MediaPipe 연동 전 테스트용)
  const swayCount = 8;        
  const badHabitCount = 7;    
  const gazePercent = 65;     

  const myPrompt = `
    사용자가 발표 연습을 마쳤습니다. 다음 데이터를 바탕으로 친근하고 귀여운 곰돌이 코치 말투로 종합 피드백을 작성해 주세요.
    - 몸 흔들림: ${swayCount}회
    - 말버릇 사용: ${badHabitCount}회
    - 시선 처리: 정면 응시율 ${gazePercent}%
    잘한 점과 개선할 점을 데이터 수치를 언급하며 친절하게 격려해 주세요. 마지막에 화이팅 응원도 한마디 덧붙여주세요.
  `;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: myPrompt }] }]
      })
    });

    const data = await response.json();
    const aiAnswer = data.candidates[0].content.parts[0].text;
    
    responseArea.innerText = aiAnswer;

  } catch (error) {
    console.error(error);
    responseArea.innerText = " 에러가 발생했습니다! API 키가 정확한지 다시 확인해 주세요.";
  }
}