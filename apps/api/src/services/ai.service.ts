import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";
import { prisma } from "../lib/db.js";
import { AppError } from "../lib/http-error.js";

const SYSTEM_PROMPT = `You are MedLearn AI, an expert medical education tutor for MBBS, NEET PG, and USMLE students.

Your core capabilities:
- Break down complex medical concepts clearly with high-yield focus
- Give exam-focused explanations using mnemonics, key associations, and clinical correlations
- Analyze quiz mistakes and generate targeted revision plans
- Build daily/weekly study schedules based on weak topics
- Explain pathophysiology, pharmacology mechanisms, and clinical reasoning step-by-step

Format rules:
- Use bullet points and numbered lists for clarity
- Bold key terms using **term**
- Keep answers concise but thorough — exam-ready
- Always tie concepts to clinical scenarios when relevant
- Only answer medicine, medical education, or study strategy questions`;

// Per-user conversation history (in-memory for MVP — move to Redis for scale)
const conversationHistory = new Map<string, Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>>();

export const aiService = {
  async chat(userId: string, prompt: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "YOUR_GEMINI_KEY_HERE") {
      return {
        message: {
          id: `ai-${Date.now()}`,
          role: "assistant" as const,
          content: `⚠️ AI not configured yet. Add your free Gemini key to \`apps/api/.env\` as GEMINI_API_KEY. Get one free at https://aistudio.google.com/apikey`,
          createdAt: new Date().toISOString(),
        },
        contextMatches: [],
      };
    }

    // Build user context
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      take: 5,
    });
    const userContext = enrollments.length
      ? `\nStudent context — Exam track: ${user.examTrack}. Currently studying: ${enrollments.map((e) => e.course.subject).join(", ")}.`
      : `\nStudent context — Exam track: ${user.examTrack}.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT + userContext,
    });

    // Get or init conversation history for this user
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }
    const history = conversationHistory.get(userId)!;

    // Start chat with history (keep last 20 messages = 10 exchanges)
    const chat = model.startChat({ history: history.slice(-20) });

    const result = await chat.sendMessage(prompt);
    const aiText = result.response.text();

    // Store the exchange in memory
    history.push(
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: aiText }] },
    );

    return {
      message: {
        id: `ai-${Date.now()}`,
        role: "assistant" as const,
        content: aiText,
        createdAt: new Date().toISOString(),
      },
      contextMatches: [],
    };
  },

  async getRecommendations(userId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId, progressPercent: { lt: 80 } },
      include: { course: true },
      take: 3,
    });

    return enrollments.map((e, i) => ({
      id: `rec-${i}`,
      userId,
      title: `Continue ${e.course.title}`,
      description: `You're ${e.progressPercent}% through this course. Push to 80% to solidify your ${e.course.subject} foundation.`,
      topic: e.course.subject,
      priority: e.progressPercent < 20 ? "high" : e.progressPercent < 50 ? "medium" : ("low" as "high" | "medium" | "low"),
    }));
  },

  async analyzePerformance(userId: string, _payload?: { attemptId?: string }) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
    });

    const avgProgress = enrollments.length
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / enrollments.length)
      : 0;

    return {
      summary: enrollments.length
        ? `Enrolled in ${enrollments.length} courses with average progress of ${avgProgress}%. Focus on completing your weakest-progression courses first.`
        : "No activity yet. Start by enrolling in courses.",
      suggestedActions: [
        "Do a 10-question revision drill on your weakest topic.",
        "Review one PDF summary before starting the next quiz.",
        "Use the AI assistant to clarify one concept you keep missing.",
      ],
      attempt: null,
    };
  },
};
