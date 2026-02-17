import { GoogleGenAI } from "@google/genai";

/**
 * Google Gemini를 사용한 AI 퀴즈 생성
 * (나중에 관리자 업로드 → AI 퀴즈 생성 기능 추가 시 사용)
 */
export async function generateQuizWithGemini(sourceText: string, examInfo: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `당신은 행정법 시험 전문가입니다. 주어진 기출문제 텍스트에서 OX 퀴즈를 생성합니다.
응답은 반드시 다음 JSON 형식으로만 출력하세요 (다른 텍스트 없이):
{
  "question": "OX 퀴즈 문장 (참/거짓 판단)",
  "answer": "O" 또는 "X",
  "basicExplanation": "2-3문장의 기본 해설",
  "detailedExplanation": "상세한 법리 해설 (여러 문단 가능)",
  "keywords": ["키워드1", "키워드2", ...],
  "caseNumbers": ["대법원 2020다12345", ...] (판례가 있으면)
}

시험 정보: ${examInfo}

기출문제:
${sourceText}`,
  });

  const text = response.text;
  if (!text) throw new Error("Gemini 응답이 비어 있습니다.");

  // JSON 추출 (마크다운 코드 블록 제거)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : text;
  return JSON.parse(jsonStr);
}
