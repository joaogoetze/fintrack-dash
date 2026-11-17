import { useEffect } from "react";

import { useAuthStore } from "../stores/authStore";
import { useInviteStore } from "../stores/inviteStore";
import { getApiBase } from "../utils/environment";

function consumeSseBuffer(buffer: string, onInvite: () => void): string {
  const blocks = buffer.split("\n\n");
  const rest = blocks.pop() ?? "";

  for (const block of blocks) {
    let eventName = "message";
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      }
    }
    if (eventName === "invite") {
      onInvite();
    }
  }

  return rest;
}

export function useInviteEvents() {
  const token = useAuthStore((state) => state.token);
  const fetchInvites = useInviteStore((state) => state.fetchInvites);

  useEffect(() => {
    if (!token) return;

    const abortController = new AbortController();
    let cancelled = false;
    let retryMs = 1000;

    fetchInvites();

    const connect = async () => {
      while (!cancelled) {
        try {
          const response = await fetch(`${getApiBase()}/auth/invites/stream`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "text/event-stream",
            },
            signal: abortController.signal,
          });

          if (!response.ok || !response.body) {
            throw new Error("Falha ao abrir stream de convites");
          }

          retryMs = 1000;
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (!cancelled) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            buffer = consumeSseBuffer(buffer, fetchInvites);
          }
        } catch (error) {
          if (cancelled || abortController.signal.aborted) {
            return;
          }
          console.error("SSE de convites:", error);
        }

        if (cancelled) return;
        await new Promise((resolve) => setTimeout(resolve, retryMs));
        retryMs = Math.min(retryMs * 2, 30_000);
      }
    };

    connect();

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [token, fetchInvites]);
}
