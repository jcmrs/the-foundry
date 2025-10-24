// src/modules/planner/main_test.ts

import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { createPlanFromGoal } from "./main.ts";
import { ExecutionPlan } from "../task-runner/main.ts";

Deno.test("createPlanFromGoal creates correct plan for module creation", async () => {
  const goal = "Create a new module named 'data-storage' for handling database interactions.";
  const outputPath = "./test-plan.jsonc";

  await createPlanFromGoal(goal, outputPath);

  const planContent = await Deno.readTextFile(outputPath);
  const plan: ExecutionPlan = JSON.parse(planContent);

  assertEquals(plan.name, "Create Module: data-storage");
  assertEquals(plan.description, goal);
  assertEquals(plan.steps.length, 1);
  assertEquals(plan.steps[0], "module create data-storage");

  // Clean up the created plan file
  await Deno.remove(outputPath);
});
