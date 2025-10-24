// src/modules/memlog/main_test.ts

import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { appendMemory, loadRecentMemories, Memory } from "./main.ts";

Deno.test("appendMemory and loadRecentMemories work correctly", async () => {
  const testMemlogFile = "test_memlog.jsonl";
  // Temporarily override MEMLOG_FILE for testing
  const originalMemlogFile = (globalThis as any).MEMLOG_FILE;
  (globalThis as any).MEMLOG_FILE = testMemlogFile;

  try {
    // Clean up any previous test file
    try {
      await Deno.remove(testMemlogFile);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }

    const memory1: Memory = {
      timestamp: new Date().toISOString(),
      goal: "Test Goal 1",
      plan: ["step 1", "step 2"],
      outcome: "SUCCESS",
      details: "Details 1",
    };
    await appendMemory(memory1);

    const memory2: Memory = {
      timestamp: new Date().toISOString(),
      goal: "Test Goal 2",
      plan: ["step 3"],
      outcome: "FAILURE",
      details: "Details 2",
    };
    await appendMemory(memory2);

    const loadedMemories = await loadRecentMemories(2);
    assertEquals(loadedMemories.length, 2);
    assertEquals(loadedMemories[0].goal, memory1.goal);
    assertEquals(loadedMemories[1].goal, memory2.goal);

    const loadedMemory1 = await loadRecentMemories(1);
    assertEquals(loadedMemory1.length, 1);
    assertEquals(loadedMemory1[0].goal, memory2.goal);

  } finally {
    // Restore original MEMLOG_FILE
    (globalThis as any).MEMLOG_FILE = originalMemlogFile;
    // Clean up test file
    try {
      await Deno.remove(testMemlogFile);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
  }
});
