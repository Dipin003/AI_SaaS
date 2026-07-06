"use client";
import { chatWithInterviewer, parseResume } from "@/actions/live-interview";
import { useState, useRef, useEffect } from "react";

export default function InterviewRoom() {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [debugLog, setDebugLog] = useState("Upload your resume to begin.");

  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);

  // Refs for tracking state inside async event listeners
  const historyRef = useRef([]);
  const resumeRef = useRef("");
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const statusRef = useRef(status);
  const utteranceRef = useRef(null); // Critical fix to prevent Chrome garbage collection of speech

  // Sync state to ref for the Web Speech event listeners
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("error");
      setDebugLog("Speech Recognition not supported in this browser.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false; // We handle restarting manually

    rec.onstart = () => {
      setStatus("listening");
      setDebugLog("Microphone is live. Speak now...");
    };

    rec.onresult = async (event) => {
      const userText = event.results[0][0].transcript;

      if (!userText || userText.trim() === "") return;

      setTranscript(userText);
      setStatus("thinking");
      setDebugLog("Thinking...");

      try {
        const currentHistory = [...historyRef.current];
        const userTurn = { role: "user", parts: [{ text: userText }] };

        const aiResponseText = await chatWithInterviewer(
          currentHistory,
          userText,
          resumeRef.current
        );

        historyRef.current = [
          ...currentHistory,
          userTurn,
          { role: "model", parts: [{ text: aiResponseText }] },
        ];

        speakText(aiResponseText);
      } catch (error) {
        console.error(error);
        setStatus("idle");
        setDebugLog("API Error. Check console.");
        speakText("I had a network glitch. Could you repeat that?");
      }
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech") {
        setDebugLog("Paused: No speech detected.");
      } else {
        setDebugLog(`Mic Error: ${e.error}`);
      }
      setStatus("idle");
    };

    rec.onend = () => {
      // If mic turns off naturally (e.g., silence) while we expected it to be listening
      if (statusRef.current === "listening") {
        setStatus("idle");
        setDebugLog("Mic paused. Click the circle to speak.");
      }
    };

    recognitionRef.current = rec;

    return () => {
      clearTimeout(timeoutRef.current);
      if (recognitionRef.current) recognitionRef.current.abort();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setStatus("speaking");
    setDebugLog("AI is talking...");

    const utterance = new SpeechSynthesisUtterance(text);
    // Save to ref to prevent Chrome garbage collection bug mid-sentence
    utteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];

    utterance.onend = () => {
      setDebugLog("AI finished. Restarting mic...");
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && statusRef.current !== "listening") {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.log("Mic already running:", err);
          }
        }
      }, 400);
    };


    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (status === "idle") {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Could not start mic", err);
      }
    } else if (status === "listening") {
      recognitionRef.current.stop();
      setStatus("idle");
      setDebugLog("Mic paused manually.");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    setResumeFileName(file.name);
    setDebugLog("Reading resume...");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const extractedText = await parseResume(formData);

      resumeRef.current = extractedText;
      setResumeText(extractedText);
      setDebugLog("Resume loaded. Ready to start.");
    } catch (error) {
      console.error(error);
      setDebugLog("Could not read resume. Try a different file.");
      setResumeFileName("");
      resumeRef.current = "";
      setResumeText("");
    } finally {
      setIsParsingResume(false);
    }
  };

  const startInterview = async () => {
    if (!resumeRef.current) {
      setDebugLog("Please upload your resume first.");
      return;
    }

    historyRef.current = [];
    setTranscript("");
    setStatus("thinking");
    setDebugLog("Preparing your first question...");

    try {
      const openingQuestion = await chatWithInterviewer(
        [],
        "__START_INTERVIEW__",
        resumeRef.current
      );

      historyRef.current = [
        { role: "model", parts: [{ text: openingQuestion }] },
      ];

      speakText(openingQuestion);
    } catch (error) {
      console.error(error);
      setStatus("idle");
      setDebugLog("Failed to start interview. Try again.");
    }
  };

  const canStart =
    !isParsingResume &&
    !!resumeText &&
    (status === "idle" || status === "error");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Visualizer Ring - Now Clickable to toggle Mic */}
      <div
        onClick={toggleMic}
        className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${status === "speaking" ? "bg-blue-600 animate-pulse scale-105" :
          status === "listening" ? "bg-emerald-500 animate-pulse scale-110 shadow-emerald-500/50" :
            status === "thinking" ? "bg-amber-500 animate-bounce scale-100 cursor-not-allowed" :
              status === "error" ? "bg-red-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        title={status === "idle" ? "Click to turn on mic" : "Click to pause mic"}
      >
        <span className="font-bold tracking-widest uppercase text-sm select-none">
          {status}
        </span>
      </div>

      {/* Resume Upload */}
      <div className="mt-10 w-full max-w-lg">
        <label
          htmlFor="resume-upload"
          className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all bg-gray-800/40"
        >
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
            {resumeFileName ? "Resume Uploaded" : "Upload Your Resume"}
          </span>
          <span className="text-xs text-gray-500 text-center">
            {isParsingResume
              ? "Parsing resume..."
              : resumeFileName || "PDF, DOCX, or TXT"}
          </span>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleResumeUpload}
            disabled={isParsingResume || status === "listening" || status === "thinking" || status === "speaking"}
            className="hidden"
          />
        </label>
      </div>

      <button
        onClick={startInterview}
        disabled={!canStart}
        className="mt-6 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-full font-bold tracking-wide transition-all"
      >
        Start Interview
      </button>

      {/* Transcript Box */}
      <div className="mt-12 w-full max-w-lg bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">You Said:</p>
        <p className="text-lg italic text-gray-300 min-h-[28px]">
          {transcript ? `"${transcript}"` : "..."}
        </p>
      </div>

      {/* Status Console */}
      <div className="absolute bottom-4 text-xs font-mono text-gray-500">
        Status: <span className="text-indigo-400">{debugLog}</span>
      </div>
    </div>
  );
}



