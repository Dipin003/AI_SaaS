"use server";

const pdfParse = require("pdf-parse");
import mammoth from "mammoth";



export async function parseResume(formData) {
  const file = formData.get("resume");
  if (!file) throw new Error("No resume file provided");

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  try {
    if (name.endsWith(".pdf")) {
      // CRITICAL FIX: Dynamically require the library inside the block
      // This bypasses Webpack's top-level import issues in Next.js
      const pdfParse = require("pdf-parse");

      const data = await pdfParse(buffer);
      return data.text ? data.text.trim() : "";
    }

    if (name.endsWith(".docx") || name.endsWith(".doc")) {
      const { value } = await mammoth.extractRawText({ buffer });
      return value ? value.trim() : "";
    }

    // plain text fallback (.txt)
    return buffer.toString("utf-8").trim();
  } catch (err) {
    console.error("Resume parsing failed:", err.message);
    throw new Error("Could not read resume file. Try a different format.");
  }
}


export async function chatWithInterviewer(pastHistory, latestUserMessage, resumeText = "") {
  if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY in environment variables.");
  if (!latestUserMessage || latestUserMessage.trim() === "") throw new Error("Empty message");

  // 1. DEBUG LOG: Check your terminal when starting the interview!
  console.log(`[Interview API] Received resume text length: ${resumeText?.length || 0} characters`);
  if (resumeText.length === 0) {
    console.warn("[Interview API] WARNING: Resume text is empty! The AI has no context.");
  }

  const isStartSignal = latestUserMessage === "__START_INTERVIEW__";

  // Format history strictly for the Groq/OpenAI API payload
  const safeHistory = pastHistory.map((turn) => ({
    role: turn.role === "user" ? "user" : "assistant",
    content: turn.parts?.[0]?.text || "",
  }));

  const messages = [...safeHistory];

  // Properly append the current user instruction
  if (isStartSignal) {
    messages.push({
      role: "user",
      content: "Hi, let's start the interview. Please greet me briefly and ask your first question specifically tailored to a project or skill listed on my resume.",
    });
  } else {
    messages.push({ role: "user", content: latestUserMessage });
  }

  // 2. PROMPT RESTRUCTURE: Use XML tags and strong constraint language for Llama 3
  const systemPrompt = `You are an expert technical interviewer conducting a mock interview for a software engineering role.

${resumeText ? `CRITICAL CONTEXT: Here is the candidate's resume. You MUST base your interview questions directly on the skills, projects, and experiences listed below.
<candidate_resume>
${resumeText}
</candidate_resume>\n` : ""}
STRICT INSTRUCTIONS:
- Follow the SAME ORDER in which sections appear in the resume above (for example: Skills first, then Projects, then Experience, then Education — whatever order the resume actually lists them in).
- Do NOT jump straight to Projects or Experience. Start with whatever section comes first in the resume (usually Skills/Languages), ask 1-2 questions about it, then move to the next section in order.
- Within a section, ask about the specific items listed (e.g. if the candidate lists "Python, JavaScript, SQL" under skills, ask about one or more of those specifically before moving on).
- Do NOT move to the next resume section until you have asked at least one question about the current section.
- Ask exactly ONE clear question at a time.
- Do not ask generic trivia unless it relates to their listed skills.
- Wait for the user to answer.
- Evaluate their answer briefly, then ask the next question.
- Keep your responses under two sentences so they sound natural when spoken aloud.
- DO NOT use markdown, bold text, or bullet points.`;


  let maxRetries = 3;

  while (maxRetries > 0) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          temperature: 0.5, // Lowered slightly so the AI is more factual and sticks to the resume
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (err) {
      const errorMsg = err.message || "";
      if (errorMsg.includes("429") || errorMsg.includes("503") || errorMsg.includes("500")) {
        console.warn(`⚠️ Groq API Busy. Retrying... (${maxRetries} left)`);
        maxRetries--;
        if (maxRetries === 0) throw new Error("Groq API is currently busy. Try again later.");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        console.error("GROQ API ERROR:", errorMsg);
        throw new Error(`Failed to process conversation: ${errorMsg}`);
      }
    }
  }
}