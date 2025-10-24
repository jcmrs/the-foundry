// src/modules/config-manager/main_test.ts

import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { loadProjectManifest } from "./main.ts";

Deno.test("loadProjectManifest loads and parses foundry.jsonc", async () => {
  const manifest = await loadProjectManifest();

  assertEquals(manifest.name, "The Foundry");
  assertEquals(manifest.version, "0.1.0");
  assertEquals(manifest.language, "TypeScript/Deno");
  assertEquals(manifest.description, "An AI-led development framework for managing and implementing projects with maximum efficiency and autonomy.");
  assertEquals(manifest.modules.length, 2); // core-engine and config-manager
  assertEquals(manifest.modules[0].name, "core-engine");
  assertEquals(manifest.modules[1].name, "config-manager");
});
