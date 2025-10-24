// temp_test_runner.ts

import { executePlan } from "./src/modules/task-runner/main.ts";

async function runTestPlan() {
  try {
    await executePlan('./sample-plan.jsonc');
    console.log("\nTemporary test plan executed successfully.");
  } catch (error) {
    console.error(`\nTemporary test plan failed: ${(error as Error).message}`);
    Deno.exit(1);
  }
}

runTestPlan();
