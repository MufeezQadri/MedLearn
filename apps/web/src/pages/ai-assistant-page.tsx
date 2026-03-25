import { useState } from "react";
import { Bot, SendHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/auth-context";
import { mockApp } from "../data/mock-app";

export const AIAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(mockApp.getAssistantConversation());
  const [prompt, setPrompt] = useState("");
  const recommendations = mockApp.getRecommendations(user!.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
      <Card className="flex min-h-[640px] flex-col">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-primary-fixed p-3 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-headline text-2xl font-extrabold">Doubt solving assistant</h2>
            <p className="text-sm text-on-surface-variant">Ask about concepts, weak topics, or study sequencing.</p>
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-auto pr-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-7 ${message.role === "assistant" ? "bg-surface-container-low" : "ml-auto bg-secondary-container text-primary"}`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <form
          className="mt-6 flex gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!prompt.trim()) return;
            const userMessage = {
              id: `user-${Date.now()}`,
              role: "user" as const,
              content: prompt,
              createdAt: new Date().toISOString(),
            };
            const reply = mockApp.askAssistant(prompt);
            setMessages((current) => [...current, userMessage, reply]);
            setPrompt("");
          }}
        >
          <input
            className="flex-1 rounded-3xl bg-surface-container-low px-5 py-4 outline-none"
            placeholder="Ask MedLearn AI about a concept you’re stuck on..."
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <Button>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </Card>

      <Card className="bg-signature text-white">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-fixed">AI recommendations</p>
        <div className="mt-4 space-y-4">
          {recommendations.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white/10 p-4">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-2 text-sm text-primary-fixed">{item.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
