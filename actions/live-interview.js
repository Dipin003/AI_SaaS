"use server";

import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function parseResume(formData) {
  const file = formData.get("resume");
  if (!file) throw new Error("No resume file provided");

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  try {
    if (name.endsWith(".pdf")) {
      const data = await pdfParse(buffer);
      return data.text.trim();
    }

    if (name.endsWith(".docx") || name.endsWith(".doc")) {
      const { value } = await mammoth.extractRawText({ buffer });
      return value.trim();
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
      content: "Hi, let's start the interview. Please greet me briefly and ask your first question based on my resume.",
    });
  } else {
    messages.push({ role: "user", content: latestUserMessage });
  }

  const systemPrompt = `You are an expert technical interviewer conducting a mock interview for a software engineering role.
- Ask exactly ONE clear question at a time.
- Wait for the user to answer.
- Evaluate their answer briefly, then ask the next question.
- Keep your responses under two sentences so they sound natural when spoken aloud.
- DO NOT use markdown, bold text, or bullet points.
${resumeText ? `\n\nHere is the candidate's resume. Use it to ask relevant, personalized questions:\n"""\n${resumeText}\n"""` : ""}`;

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
          temperature: 0.7,
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