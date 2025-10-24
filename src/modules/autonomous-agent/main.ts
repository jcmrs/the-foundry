// src/modules/autonomous-agent/main.ts

import { createPlanFromGoal } from "../planner/main.ts";
import { executePlan } from "../task-runner/main.ts";

/**
 * Orchestrates the autonomous execution of a high-level goal.
 * @param goal The natural language goal to achieve.
 */
export async function runGoal(goal: string): Promise<void> {
  console.log(`
--- Autonomous Agent: Starting to process goal: "${goal}" ---`);
  try {
    console.log("Autonomous Agent: Generating plan...");
    const plan = await createPlanFromGoal(goal);
    console.log("Autonomous Agent: Plan generated successfully.");
    console.log("Autonomous Agent: Executing plan...");
    await executePlan(plan, goal); // Pass the plan object and the original goal
    console.log(`--- Autonomous Agent: Goal "${goal}" achieved successfully! ---`);
  } catch (error) {
    console.error(`--- Autonomous Agent: Failed to achieve goal "${goal}": ${(error as Error).message} ---`);
    Deno.exit(1);
  }
}
