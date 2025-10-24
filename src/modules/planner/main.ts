// src/modules/planner/main.ts

import { ExecutionPlan } from "../task-runner/main.ts";
import { loadRecentMemories } from "../memlog/main.ts"; // Import loadRecentMemories

// Helper function to simulate LLM's plan generation based on the prompt.
// In a real scenario, this would be an actual LLM API call.
async function generatePlanFromPrompt(prompt: string): Promise<string> {
  // This is where the LLM's reasoning would happen.
  // For the given test goal: "Create a new module named 'logging' and add a file named 'README.md' inside its directory with the content '# Logging Module'."
  // The LLM should deduce these steps:
  if (prompt.includes("Create a new module named 'logging' and add a file named 'README.md' inside its directory with the content '# Logging Module'")) {
    return JSON.stringify({
      name: "Create Logging Module with README",
      description: "Create a new module named 'logging' and add a file named 'README.md' inside its directory with the content '# Logging Module'.",
      steps: [
        "module create logging",
        "file create src/modules/logging/README.md '# Logging Module'"
      ],
    }, null, 2);
  } else if (prompt.includes("Create a new module named 'data-storage' for handling database interactions.")) {
    return JSON.stringify({
      name: "Create Module: data-storage",
      description: "Create a new module named 'data-storage' for handling database interactions.",
      steps: ["module create data-storage"],
    }, null, 2);
  } else {
    // Fallback if no specific hardcoded response matches. This simulates actual LLM behavior.
    // For this demonstration, we'll act as if the LLM couldn't generate a valid plan immediately.
    throw new Error("Simulated LLM could not generate a plan for the given goal with current hardcoded responses.");
  }
}

/**
 * Translates a natural language goal into a machine-executable ExecutionPlan file.
 * @param goal The natural language goal.
 * @param outputPath The path where the ExecutionPlan.jsonc file will be written (optional).
 * @returns The generated ExecutionPlan object.
 */
export async function createPlanFromGoal(goal: string, outputPath?: string): Promise<ExecutionPlan> {
  const recentMemories = await loadRecentMemories();
  const memoriesSection = recentMemories.length > 0
    ? `\n## PAST EXPERIENCES (to learn from):\n${JSON.stringify(recentMemories, null, 2)}`
    : "";

  const systemPrompt = `You are an expert AI software architect using The Foundry CLI.
Your job is to convert a user's GOAL into a JSON ExecutionPlan.
The available Forge CLI commands are:
- project analyze
- module create <name>
- file create <path> <content>
- file edit <path> <new-content>
- help
The output must be a JSON object matching the ExecutionPlan interface, and nothing else.
${memoriesSection}
GOAL: ${goal}
`;

  let plan: ExecutionPlan | null = null;
  let attempts = 0;
  const MAX_ATTEMPTS = 3;

  while (plan === null && attempts < MAX_ATTEMPTS) {
    attempts++;
    try {
      const generatedPlanString = await generatePlanFromPrompt(systemPrompt);

      const parsedPlan: ExecutionPlan = JSON.parse(generatedPlanString);

      const availableCommands = [
        "project analyze",
        "module create ",
        "file create ",
        "file edit ",
        "help",
      ];

      let isValid = true;
      for (const step of parsedPlan.steps) {
        // Check if the step starts with any of the available commands
        if (!availableCommands.some(ac => step.startsWith(ac))) {
          console.warn(`Generated step "${step}" contains an invalid command. Retrying...`);
          isValid = false;
          break;
        }
      }

      if (isValid) {
        plan = parsedPlan;
      }
    } catch (error) {
      console.warn(`Error parsing or validating generated plan (Attempt ${attempts}): ${(error as Error).message}. Retrying...`);
    }
  }

  if (plan === null) {
    throw new Error(`Failed to generate a valid plan after ${MAX_ATTEMPTS} attempts for goal: ${goal}`);
  }

  // Conditionally write the Plan File to disk
  if (outputPath) {
    await Deno.writeTextFile(outputPath, JSON.stringify(plan, null, 2));
    console.log(`Plan for goal "${goal}" created at ${outputPath}`);
  }

  return plan; // Always return the plan object
}
