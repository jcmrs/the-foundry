// src/modules/planner/main.ts

import { ExecutionPlan } from "../task-runner/main.ts";

/**
 * Translates a natural language goal into a machine-executable ExecutionPlan file.
 * @param goal The natural language goal.
 * @param outputPath The path where the ExecutionPlan.jsonc file will be written.
 */
export async function createPlanFromGoal(goal: string, outputPath: string): Promise<void> {
  // Analyze the goal and determine Forge CLI commands
  let steps: string[] = [];
  let planName: string = "";
  let planDescription: string = goal;

  // Simple heuristic for now: if goal contains 'create module X', then create a module.
  const createModuleMatch = goal.match(/create a new module named '([a-zA-Z0-9-]+)'/i);
  if (createModuleMatch && createModuleMatch[1]) {
    const moduleName = createModuleMatch[1];
    steps.push(`module create ${moduleName}`);
    planName = `Create Module: ${moduleName}`;
  } else {
    // Default or more complex logic can be added here later
    steps.push(`echo "No specific Forge command inferred for: ${goal}"`);
    planName = `Generic Plan for: ${goal.substring(0, 30)}...`;
  }

  const plan: ExecutionPlan = {
    name: planName,
    description: planDescription,
    steps: steps,
  };

  // Write the Plan File
  await Deno.writeTextFile(outputPath, JSON.stringify(plan, null, 2));
  console.log(`Plan for goal "${goal}" created at ${outputPath}`);
}
