// src/modules/core-engine/main_test.ts

import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { greet } from "./main.ts";

Deno.test("greet function returns correct greeting", () => {
  assertEquals(greet("World"), "Hello, World from core-engine!");
});
