// src/modules/file-manager/main_test.ts

import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { createFile, editFile } from "./main.ts";

Deno.test("createFile and editFile work correctly", async () => {
  const testFilePath = "./test_file_manager.txt";
  const initialContent = "Hello, Deno!";
  const updatedContent = "Hello, World!";

  try {
    // Clean up any previous test file
    try {
      await Deno.remove(testFilePath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }

    // Test createFile
    await createFile(testFilePath, initialContent);
    let content = await Deno.readTextFile(testFilePath);
    assertEquals(content, initialContent);

    // Test editFile
    await editFile(testFilePath, updatedContent);
    content = await Deno.readTextFile(testFilePath);
    assertEquals(content, updatedContent);

  } finally {
    // Clean up test file
    try {
      await Deno.remove(testFilePath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
  }
});
