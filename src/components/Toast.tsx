import { useState, useCallback, createContext, useContext, type ReactNode } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          insetInlineEnd: "1.5rem",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          pointerEvents: "none",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-sm)",
              background:
                item.type === "success"
                  ? "var(--success-bg)"
                  : item.type === "error"
                    ? "var(--error-bg)"
                    : "var(--surface2)",
              border:
                item.type === "success"
                  ? "1px solid var(--success)"
                  : item.type === "error"
                    ? "1px solid var(--error)"
                    : "1px solid var(--border)",
              color:
                item.type === "success"
                  ? "var(--success)"
                  : item.type === "error"
                    ? "var(--error)"
                    : "var(--text)",
              fontSize: "0.9rem",
              fontWeight: 500,
              maxWidth: "360px",
              wordBreak: "break-word",
              boxShadow: "var(--shadow-lg)",
              pointerEvents: "auto",
              animation: "slideUp 0.25s ease",
            }}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const c = useContext(ToastContext);
  if (!c) throw new Error("useToast must be inside ToastProvider");
  return c;
}
