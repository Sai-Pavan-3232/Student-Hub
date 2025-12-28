import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoute } from "wouter";

type Message = {
  id: string;
  author: string;
  text: string;
  time: string;
};

const mockMessagesByThread: Record<string, Message[]> = {
  "1": [
    { id: "m1", author: "Alice", text: "I find Pomodoro effective for study sessions.", time: "2:10 PM" },
    { id: "m2", author: "Bob", text: "Also try active recall and spaced repetition.", time: "2:12 PM" },
    { id: "m3", author: "Charlie", text: "Group study works for me on weekends.", time: "2:15 PM" },
  ],
};

export default function ThreadRoom() {
  const [match, params] = useRoute("/forums/thread/:id");
  const threadId = params?.id ?? "";

  const [messages, setMessages] = useState<Message[]>(() => mockMessagesByThread[threadId] ?? []);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(mockMessagesByThread[threadId] ?? []);
  }, [threadId]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      // scroll to bottom so chats appear anchored at bottom
      el.scrollTop = el.scrollHeight;
    } else {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const next: Message = {
      id: String(Date.now()),
      author: "You",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((s) => [...s, next]);
    setInput("");
  };

  if (!threadId) {
    return (
      <div className="p-4">No thread selected.</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-testid={`page-thread-${threadId}`}>
      <div className="flex-1 flex flex-col h-full">
        <Card className="flex-1 m-0">
          <div ref={containerRef} className="p-4 flex flex-col gap-3 h-full overflow-auto justify-end" style={{ background: "transparent" }}>
            {messages.map((m) => (
              <div key={m.id} className={`p-3 rounded-lg max-w-[80%] ${m.author === "You" ? "bg-primary/10 self-end ml-auto" : "bg-muted-foreground/5 self-start"}`}>
                <div className="text-sm font-medium">{m.author} <span className="text-xs text-muted-foreground ml-2">{m.time}</span></div>
                <div className="text-sm mt-1">{m.text}</div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </Card>
      </div>

      <div className="border-t p-3 bg-background">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 textarea bg-background border rounded-md p-2 resize-none h-12"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              aria-label="message-input"
              autoFocus
            />
            <Button onClick={send} data-testid="button-send">Send</Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">Press Enter to send — hold Shift+Enter for a new line.</div>
        </div>
      </div>
    </div>
  );
}
