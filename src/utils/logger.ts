export function log(
  message: string,
  level: "info" | "warn" | "error" = "info"
): void {
  if (level == "info" && process.env.NODE_ENV !== "developer") return;
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${level.toUpperCase()}]: ${message}`);
}

export const logInfo = (msg: string) => log(msg, "info");
export const logWarn = (msg: string) => log(msg, "warn");
export const logError = (msg: string) => log(msg, "error");
