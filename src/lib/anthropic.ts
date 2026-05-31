import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// AI features are optional. Without ANTHROPIC_API_KEY the routes return
// { configured: false } and the UI shows a friendly "set up AI" message.
export const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

// Defaults to the current flagship model. Override with ANTHROPIC_MODEL=claude-haiku-4-5
// to cut cost (~5× cheaper) for a high-volume consumer app.
export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

let client: Anthropic | null = null;
export function anthropic(): Anthropic | null {
  if (!hasAnthropic) return null;
  client ??= new Anthropic(); // reads ANTHROPIC_API_KEY from env
  return client;
}
