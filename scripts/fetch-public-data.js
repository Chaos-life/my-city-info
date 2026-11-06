const fs = require("fs");
const path = require("path");

async function main() {
  const publicDataKey = process.env.PUBLIC_DATA_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!publicDataKey) {
    console.error("PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  const cityInfoPath = path.join(__dirname, "../public/data/city-info.json");
  let cityData = { lastUpdated: "", items: [] };

  try {
    if (fs.existsSync(cityInfoPath)) {
      const fileContent = fs.readFileSync(cityInfoPath, "utf-8");
      cityData = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("기존 city-info.json 읽기 실패:", error.message);
    process.exit(1);
  }

  // [1단계] 공공데이터포털 API에서 데이터 가져오기
  console.log("공공데이터포털 API 호출 중...");
  const endpoint = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(
    publicDataKey
  )}`;

  let rawList = [];
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API 요청 실패 (HTTP 상태 코드: ${response.status})`);
    }
    const json = await response.json();
    rawList = json.data || json.dataList || json.items || [];
    if (!Array.isArray(rawList)) {
      rawList = [];
    }
  } catch (error) {
    console.error("공공데이터 API 호출 오류:", error.message);
    process.exit(1);
  }

  if (rawList.length === 0) {
    console.log("공공데이터 API로부터 받은 데이터가 없습니다.");
    return;
  }

  // 필터링: 1. 성남 -> 2. 경기 -> 3. 전체
  const containsWord = (item, word) => {
    const name = item.서비스명 || item.serviceNm || "";
    const purpose = item.서비스목적요약 || item.purpose || "";
    const target = item.지원대상 || item.target || "";
    const agency = item.소관기관명 || item.agency || "";
    const combined = `${name} ${purpose} ${target} ${agency}`;
    return combined.includes(word);
  };

  let filteredList = rawList.filter((item) => containsWord(item, "성남"));
  if (filteredList.length === 0) {
    filteredList = rawList.filter((item) => containsWord(item, "경기"));
  }
  if (filteredList.length === 0) {
    filteredList = rawList;
  }

  // [2단계] 기존 데이터와 비교 (name 기준)
  const existingNames = new Set(cityData.items.map((item) => (item.name || "").trim()));
  const candidate = filteredList.find((item) => {
    const serviceName = (item.서비스명 || item.serviceNm || "").trim();
    return serviceName && !existingNames.has(serviceName);
  });

  if (!candidate) {
    console.log("새로운 데이터가 없습니다");
    return;
  }

  // [3단계] Gemini AI로 새 항목 1개만 가공
  console.log("새 항목 Gemini AI 분석 및 가공 요청 중...");
  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터:
${JSON.stringify(candidate, null, 2)}`;

  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiApiKey}`;

  let newItem = null;
  try {
    const geminiRes = await fetch(geminiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      throw new Error(`Gemini API 호출 실패 (HTTP ${geminiRes.status})`);
    }

    const geminiData = await geminiRes.json();
    let textResponse =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 마크다운 코드블록 제거 (```json ... ``` 또는 ``` ... ```)
    textResponse = textResponse.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

    newItem = JSON.parse(textResponse);
  } catch (error) {
    console.error("Gemini AI 가공 중 에러 발생:", error.message);
    console.log("기존 city-info.json을 유지합니다.");
    process.exit(1);
  }

  if (!newItem || typeof newItem !== "object") {
    console.error("유효하지 않은 Gemini 응답 형식입니다. 기존 데이터를 유지합니다.");
    process.exit(1);
  }

  // id 보정 (고유 id 부여)
  newItem.id = Date.now();

  // [4단계] 기존 데이터에 추가
  cityData.items.push(newItem);
  cityData.lastUpdated = new Date().toISOString().split("T")[0];

  try {
    fs.writeFileSync(cityInfoPath, JSON.stringify(cityData, null, 2), "utf-8");
    console.log(`새로운 항목이 추가되었습니다: ${newItem.name}`);
  } catch (error) {
    console.error("city-info.json 파일 쓰기 실패:", error.message);
    process.exit(1);
  }
}

main();

