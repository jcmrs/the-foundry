// src/modules/task-runner/main.ts

/**
 * Represents a plan file for executing a sequence of Forge commands.
 */
export interface ExecutionPlan {
  name: string;
  description: string;
  steps: string[];
}

/**
 * Reads a Plan File from disk and executes the sequence of Forge commands defined within it.
 * @param planPath The path to the JSONC Plan File.
 */
export async function executePlan(planPath: string): Promise<void> {
  try {
    const planContent = await Deno.readTextFile(planPath);
    // Assuming JSONC can be parsed directly by JSON.parse for now,
    // as comments are typically stripped by Deno's JSON loader.
    const plan: ExecutionPlan = JSON.parse(planContent);

    console.log(`Executing plan: ${plan.name} - ${plan.description}`);

    for (const step of plan.steps) {
      console.log(`\n--- Executing step: ${step} ---`);
      const commandArgs = ["run", "--allow-read", "--allow-write", "forge.ts", ...step.split(" ")];
      
      const command = new Deno.Command("deno", {
        args: commandArgs,
        stdout: "inherit",
        stderr: "inherit",
      });

      const { success } = await command.output();

      if (!success) {
        throw new Error(`Command failed: ${step}`);
      }
      console.log(`--- Step completed: ${step} ---`);
    }
    console.log(`\nPlan '${plan.name}' executed successfully.`);
  } catch (error) {
    console.error(`Error executing plan: ${(error as Error).message}`);
    throw error;
  }
}
