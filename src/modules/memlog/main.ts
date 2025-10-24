// src/modules/memlog/main.ts

import { parse } from "https://deno.land/std@0.208.0/jsonc/mod.ts";

const MEMLOG_FILE = "memlog.jsonl";

/**
 * Represents a single memory entry for the MemLog.
 */
export interface Memory {
  timestamp: string;
  goal: string;
  plan: string[];
  outcome: "SUCCESS" | "FAILURE";
  details: string;
}

/**
 * Appends a new memory object as a single line to the memlog.jsonl file.
 * @param memory The Memory object to append.
 */
export async function appendMemory(memory: Memory): Promise<void> {
  const memoryLine = JSON.stringify(memory);
  await Deno.writeTextFile(MEMLOG_FILE, memoryLine + "\n", { append: true });
}

/**
 * Reads the last 'count' lines from memlog.jsonl, parses them, and returns an array of Memory objects.
 * @param count The number of recent memories to load. Defaults to 5.
 * @returns An array of Memory objects.
 */
export async function loadRecentMemories(count: number = 5): Promise<Memory[]> {
  try {
    const fileContent = await Deno.readTextFile(MEMLOG_FILE);
    const lines = fileContent.split("\n").filter(line => line.trim() !== "");
    const recentLines = lines.slice(Math.max(lines.length - count, 0));
    return recentLines.map(line => parse(line) as Memory);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return []; // MemLog file doesn't exist yet
    }
    console.error(`Error loading recent memories: ${(error as Error).message}`);
    return [];
  }
}
