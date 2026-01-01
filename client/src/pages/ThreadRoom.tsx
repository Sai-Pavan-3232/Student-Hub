import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRoute } from "wouter";
import { ArrowLeft, Send, MoreVertical, Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "wouter";

type Message = {
  id: string;
  author: string;
  text: string;
  time: string;
  isCurrentUser?: boolean;
};

type Thread = {
  id: string;
  title: string;
  category: string;
  author: string;
  likes: number;
  replies: number;
};

const mockThreads: Record<string, Thread> = {
  "1": {
    id: "1",
    title: "Best Study Techniques for Finals",
    category: "Academic",
    author: "Sarah Chen",
    likes: 24,
    replies: 12,
  },
};

const mockMessagesByThread: Record<string, Message[]> = {
  "1": [
    { id: "m1", author: "Alice Johnson", text: "I find Pomodoro technique really effective for study sessions. 25 minutes of focused work followed by 5-minute breaks helps me stay productive.", time: "2:10 PM" },
    { id: "m2", author: "Bob Smith", text: "Also try active recall and spaced repetition. They're scientifically proven to improve retention!", time: "2:12 PM" },
    { id: "m3", author: "Charlie Davis", text: "Group study works for me on weekends. We quiz each other and explain concepts.", time: "2:15 PM" },
  ],
};

export default function ThreadRoom() {
  const [match, params] = useRoute("/forums/thread/:id");
  const threadId = params?.id ?? "";
  const thread = mockThreads[threadId];

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
      isCurrentUser: true,
    };
    setMessages((s) => [...s, next]);
    setInput("");
  };

  if (!threadId || !thread) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <p className="text-muted-foreground">No thread selected.</p>
          <Link href="/forums">
            <Button variant="link" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forums
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Compact Thread Header */}
      <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4 mb-2">
            <Link href="/forums">
              <Button variant="ghost" size="sm" className="h-8">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">{thread.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{thread.category}</Badge>
                <span className="text-xs text-muted-foreground">by {thread.author}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-none">
              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Heart className="h-3.5 w-3.5" />
                <span>{thread.likes}</span>
              </button>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{thread.replies}</span>
              </div>
              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area - This is the only scrollable part */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-background to-muted/10">
        <div
          ref={containerRef}
          className="h-full overflow-y-auto px-4 py-4"
        >
          <div className="max-w-4xl mx-auto space-y-3">
            {messages.map((m) => {
              const isCurrentUser = m.author === "You" || m.isCurrentUser;
              const initials = m.author.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="h-8 w-8 flex-none border-2 border-background shadow-sm">
                    <AvatarFallback className={isCurrentUser ? "bg-primary text-primary-foreground text-xs" : "bg-muted text-xs"}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex flex-col gap-0.5 max-w-[65%] ${isCurrentUser ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-xs font-medium">{m.author}</span>
                      <span className="text-[10px] text-muted-foreground">{m.time}</span>
                    </div>

                    <Card className={`${isCurrentUser
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card shadow-sm"
                      }`}>
                      <CardContent className="p-2.5 px-3">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        </div>
      </div>

      {/* Compact Input Area */}
      <div className="flex-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-h-[44px] max-h-[120px] px-3 py-2 text-sm rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                aria-label="message-input"
                autoFocus
              />

              <Button
                onClick={send}
                data-testid="button-send"
                size="default"
                className="h-[44px] px-4"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to send •
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] ml-1">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
