// temp_test_planner.ts

import { createPlanFromGoal } from "./src/modules/planner/main.ts";

async function runTestPlanner() {
  const goal = "Create a new module named 'data-storage' for handling database interactions.";
  const outputPath = "./test-plan.jsonc";

  try {
    await createPlanFromGoal(goal, outputPath);
    console.log("\nTemporary planner test executed successfully.");
  } catch (error) {
    console.error(`\nTemporary planner test failed: ${(error as Error).message}`);
    Deno.exit(1);
  }
}

runTestPlanner();
