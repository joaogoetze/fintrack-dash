export type AppEnvironment = "local" | "production";

const LOCAL_API = "http://localhost:3001";
const PRODUCTION_API = "https://api-fintrack.joaogoetze.com.br";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function getEnvironment(): AppEnvironment {
  const host = window.location.hostname;
  return LOCAL_HOSTS.has(host) ? "local" : "production";
}

export function getApiBase(): string {
  return getEnvironment() === "local" ? LOCAL_API : PRODUCTION_API;
}
