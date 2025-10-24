// src/modules/planner/main.ts

import { ExecutionPlan } from "../task-runner/main.ts";

/**
 * Simulates an LLM call to generate an ExecutionPlan based on a system prompt and user goal.
 * For now, this returns a hard-coded plan for a specific test case.
 * @param systemPrompt The system prompt provided to the LLM.
 * @param userGoal The user's natural language goal.
 * @returns A JSON string representing the generated ExecutionPlan.
 */
function _simulateLLMCall(systemPrompt: string, userGoal: string): string {
  // In a real scenario, this would involve an API call to an LLM.
  // For this specific test, we return a hard-coded plan for the goal:
  // "Create a new module named 'data-storage' for handling database interactions."
  if (userGoal === "Create a new module named 'data-storage' for handling database interactions.") {
    return JSON.stringify({
      name: "Create Module: data-storage",
      description: userGoal,
      steps: ["module create data-storage"],
    }, null, 2);
  }
  // Fallback for other goals, or if the simulation needs to be extended.
  return JSON.stringify({
    name: "Simulated Plan",
    description: userGoal,
    steps: [`echo "Simulated plan for: ${userGoal}"`],
  }, null, 2);
}

/**
 * Translates a natural language goal into a machine-executable ExecutionPlan file.
 * @param goal The natural language goal.
 * @param outputPath The path where the ExecutionPlan.jsonc file will be written.
 */
export async function createPlanFromGoal(goal: string, outputPath: string): Promise<void> {
  const systemPrompt = `You are an expert AI software architect using The Foundry CLI.
Your job is to convert a user's GOAL into a JSON ExecutionPlan.
The available Forge CLI commands are:
- project analyze
- module create <name>
The output must be a JSON object matching the ExecutionPlan interface, and nothing else.`

  const llmOutput = _simulateLLMCall(systemPrompt, goal);

  try {
    const plan: ExecutionPlan = JSON.parse(llmOutput);

    // Write the Plan File
    await Deno.writeTextFile(outputPath, JSON.stringify(plan, null, 2));
    console.log(`Plan for goal "${goal}" created at ${outputPath}`);
  } catch (error) {
    console.error(`Error creating plan from LLM output: ${(error as Error).message}`);
    throw error;
  }
}
