import { useState, useRef, useEffect } from "react";
import { useI18n } from "../context/LocaleContext";
import { loadSettings } from "../lib/settings";
import styles from "./Chat.module.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function Chat() {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setBusy(true);

    try {
      const cfg = loadSettings();
      if (!cfg.lmStudioEnabled) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: t("chat.error") },
        ]);
        return;
      }
      const base = cfg.lmStudioBaseUrl.replace(/\/$/, "");
      const url = `${base}/v1/chat/completions`;
      const model = cfg.lmStudioModel.trim() || undefined;

      const systemMsg = `You are a helpful AI assistant for image and video generation. Respond in the same language as the user (${locale === "ar" ? "Arabic" : locale === "fr" ? "French" : "English"} or Darija). You can help with: crafting better prompts, explaining AI models, suggesting settings, and creative ideas. Keep responses concise and helpful.`;

      const payload: Record<string, unknown> = {
        messages: [
          { role: "system", content: systemMsg },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: text },
        ],
        temperature: 0.7,
        stream: false,
      };
      if (model) payload.model = model;

      const init: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      };

      let res: Response;
      if (typeof window !== "undefined" && window.aiGeanret?.localLlmFetch) {
        const result = await window.aiGeanret.localLlmFetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!result.ok) throw new Error(`HTTP ${result.status}`);
        const data = result.data as {
          choices?: { message?: { content?: string } }[];
        };
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error("Empty response");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: content.trim() },
        ]);
      } else {
        res = await fetch(url, init);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error("Empty response");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: content.trim() },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.error") },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("chat.title")}</h2>
          <button
            className={styles.clearBtn}
            onClick={() => setMessages([])}
            disabled={messages.length === 0}
          >
            {t("chat.clear")}
          </button>
        </div>
        <div className={styles.list} ref={listRef}>
          {messages.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>💬</div>
              <p>{t("chat.placeholder")}</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={msg.role === "user" ? styles.userMsg : styles.assistantMsg}
            >
              <div className={styles.bubble}>
                {msg.content}
              </div>
            </div>
          ))}
          {busy && (
            <div className={styles.assistantMsg}>
              <div className={styles.thinking}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            </div>
          )}
        </div>
        <div className={styles.inputRow}>
          <textarea
            className={styles.input}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.placeholder")}
            disabled={busy}
          />
          <button
            className={styles.sendBtn}
            onClick={send}
            disabled={!input.trim() || busy}
          >
            {t("chat.send")}
          </button>
        </div>
      </div>
    </div>
  );
}
