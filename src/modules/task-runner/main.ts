// src/modules/task-runner/main.ts

import { parse } from "https://deno.land/std@0.208.0/jsonc/mod.ts";
import { appendMemory, Memory } from "../memlog/main.ts"; // Import appendMemory and Memory

/**
 * Represents a plan file for executing a sequence of Forge commands.
 */
export interface ExecutionPlan {
  name: string;
  description: string;
  steps: string[];
}

/**
 * Executes a given ExecutionPlan.
 * @param plan The ExecutionPlan object to execute.
 * @param goal The original natural language goal that led to this plan.
 */
export async function executePlan(plan: ExecutionPlan, goal: string): Promise<void> {
  let outcome: "SUCCESS" | "FAILURE" = "FAILURE";
  let details: string = "";

  try {
    console.log(`Executing plan: ${plan.name} - ${plan.description}`);

    for (const step of plan.steps) {
      console.log(`\n--- Executing step: ${step} ---`);
      const commandArgs = ["run", "--allow-read", "--allow-write", "forge.ts", ...step.split(" ")];
      
      const command = new Deno.Command("deno", {
        args: commandArgs,
        stdout: "inherit",
        stderr: "inherit",
      });

      const process = command.spawn();
      const { success } = await process.status;

      if (!success) {
        throw new Error(`Command failed: ${step}`);
      }
      console.log(`--- Step completed: ${step} ---`);
    }
    console.log(`\nPlan '${plan.name}' executed successfully.`);
    outcome = "SUCCESS";
  } catch (error) {
    details = `Error executing plan: ${(error as Error).message}`;
    console.error(details);
    throw error;
  } finally {
    const memory: Memory = {
      timestamp: new Date().toISOString(),
      goal: goal,
      plan: plan.steps,
      outcome: outcome,
      details: details,
    };
    await appendMemory(memory);
  }
}
