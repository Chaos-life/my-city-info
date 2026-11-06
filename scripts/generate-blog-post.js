const fs = require("fs");
const path = require("path");

async function main() {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  // [1단계] 최신 데이터 확인
  const cityInfoPath = path.join(__dirname, "../public/data/city-info.json");
  const postsDir = path.join(__dirname, "../src/content/posts");

  let cityData;
  try {
    if (!fs.existsSync(cityInfoPath)) {
      console.error("city-info.json 파일이 존재하지 않습니다.");
      process.exit(1);
    }
    const fileContent = fs.readFileSync(cityInfoPath, "utf-8");
    cityData = JSON.parse(fileContent);
  } catch (error) {
    console.error("city-info.json 읽기 실패:", error.message);
    process.exit(1);
  }

  if (!cityData.items || cityData.items.length === 0) {
    console.error("city-info.json에 데이터 항목이 없습니다.");
    process.exit(1);
  }

  // 마지막 항목 가져오기
  const latestItem = cityData.items[cityData.items.length - 1];
  const targetName = (latestItem.name || "").trim();

  // src/content/posts/ 폴더 내 파일들과 비교
  if (fs.existsSync(postsDir)) {
    const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
    for (const file of postFiles) {
      try {
        const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
        if (targetName && content.includes(targetName)) {
          console.log("이미 작성된 글입니다");
          return;
        }
      } catch (err) {
        // 개별 파일 읽기 오류는 무시하고 계속 검사
      }
    }
  } else {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // [2단계] Gemini AI로 블로그 글 생성
  const today = new Date().toISOString().split("T")[0];
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiApiKey}`;

  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.
정보: ${JSON.stringify(latestItem, null, 2)}
아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---
(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

  console.log("Gemini AI에 블로그 글 생성 요청 중...");

  let responseText = "";
  try {
    const res = await fetch(geminiEndpoint, {
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

    if (!res.ok) {
      throw new Error(`Gemini API 요청 실패 (HTTP 상태 코드: ${res.status})`);
    }

    const data = await res.json();
    responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("블로그 글 생성 중 에러 발생:", error.message);
    process.exit(1);
  }

  if (!responseText) {
    console.error("Gemini AI로부터 빈 응답을 받았습니다.");
    process.exit(1);
  }

  // [3단계] 파일 저장
  // 마크다운 코드블록 제거
  let cleanText = responseText.replace(/^```markdown\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();

  // FILENAME 추출 분리
  const filenameRegex = /FILENAME:\s*([^\r\n]+)/i;
  const match = cleanText.match(filenameRegex);

  let finalFilename = "";
  if (match) {
    finalFilename = match[1].trim();
    // 본문에서 FILENAME 줄 제거
    cleanText = cleanText.replace(filenameRegex, "").trim();
  }

  if (!finalFilename) {
    finalFilename = `${today}-post`;
  }

  if (!finalFilename.endsWith(".md")) {
    finalFilename += ".md";
  }

  // 특수문자 정제
  finalFilename = finalFilename.replace(/[<>:"/\\|?*]/g, "");

  const targetFilePath = path.join(postsDir, finalFilename);

  try {
    fs.writeFileSync(targetFilePath, cleanText, "utf-8");
    console.log(`블로그 글 생성 성공: ${finalFilename}`);
  } catch (error) {
    console.error("블로그 글 파일 저장 실패:", error.message);
    process.exit(1);
  }
}

main();

