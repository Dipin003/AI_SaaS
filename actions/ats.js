"use server";

import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeResumeATS(formData) {
  const file = formData.get("resume");

  if (!file) {
    throw new Error("Resume file required");
  }

  const bytes = await file.arrayBuffer();
  const uint8Array = new Uint8Array(bytes);

  // Extract text from PDF
  const pdf = await getDocument({ data: uint8Array }).promise;
  let resumeText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    resumeText += pageText + "\n";
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Analyze this resume for ATS compatibility.

Resume:
${resumeText}

Return ONLY valid JSON with no extra text.

{
  "score": 85,
  "strengths": [],
  "weaknesses": [],
  "improvements": [],
  "summary": ""
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}