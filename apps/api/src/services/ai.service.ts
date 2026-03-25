import { state } from "../data/store.js";
import { AppError } from "../lib/http-error.js";

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const scoreText = (query: string, text: string) => {
  const queryTokens = tokenize(query);
  const textTokens = new Set(tokenize(text));
  return queryTokens.reduce((sum, token) => sum + Number(textTokens.has(token)), 0);
};

export const aiService = {
  chat(userId: string, prompt: string) {
    const user = state.users.find((item) => item.id === userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const searchableContent = [
      ...state.modules.map((item) => ({
        type: "module",
        title: item.title,
        body: `${item.title} ${item.summary}`,
      })),
      ...state.questions.map((item) => ({
        type: "question",
        title: item.topic,
        body: `${item.prompt} ${item.explanation}`,
      })),
      ...state.books.map((item) => ({
        type: "book",
        title: item.title,
        body: `${item.title} ${item.description} ${item.tags.join(" ")}`,
      })),
    ]
      .map((item) => ({
        ...item,
        score: scoreText(prompt, item.body),
      }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 3);

    const weakTopicHint = user.weakTopics.length
      ? `You should prioritize ${user.weakTopics.slice(0, 2).join(" and ")}.`
      : "Your recent performance is balanced across subjects.";

    const sourceHint =
      searchableContent.length > 0
        ? `Relevant material: ${searchableContent.map((item) => `${item.title} (${item.type})`).join(", ")}.`
        : "I could not find a direct internal match, so I’m giving a general medical learning answer.";

    const response = `${weakTopicHint} ${sourceHint} For this doubt, focus on mechanism first, then memorize the exception patterns that exam questions like to exploit.`;

    const message = {
      id: `ai-${Date.now()}`,
      role: "assistant" as const,
      content: response,
      createdAt: new Date().toISOString(),
    };

    state.assistantConversation.push(
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: prompt,
        createdAt: new Date().toISOString(),
      },
      message,
    );

    return {
      message,
      contextMatches: searchableContent,
    };
  },

  getRecommendations(userId: string) {
    return state.recommendations.filter((item) => item.userId === userId);
  },

  analyzePerformance(userId: string, payload?: { attemptId?: string }) {
    const progress = state.progressSnapshots.find((item) => item.userId === userId);
    const attempt = payload?.attemptId
      ? state.quizAttempts.find((item) => item.id === payload.attemptId && item.userId === userId)
      : state.quizAttempts
          .filter((item) => item.userId === userId && item.status === "submitted")
          .sort((left, right) => right.startedAt.localeCompare(left.startedAt))[0];

    return {
      summary: progress
        ? `Current average accuracy is ${progress.averageAccuracy}%. Weak topics are ${progress.weakTopics.join(", ") || "not enough data yet"}.`
        : "Not enough activity yet to build a performance profile.",
      suggestedActions: [
        "Do a 10-question revision drill on your weakest topic.",
        "Review one PDF summary before starting the next quiz.",
        "Use the AI assistant to clarify one concept you keep missing.",
      ],
      attempt,
    };
  },
};
