// forge.ts

import { parseArgs, ParsedCommand } from "./src/modules/command-parser/main.ts";
import { analyzeProjectStructure } from "./src/modules/analysis-engine/main.ts";
import { scaffoldModule } from "./src/modules/module-scaffolder/main.ts";
import { createFile, editFile } from "./src/modules/file-manager/main.ts";
import { runGoal } from "./src/modules/autonomous-agent/main.ts"; // Import runGoal

interface CommandEntry {
  command: string;
  subcommand: string;
  description: string;
  usage: string;
  handler: (parsedCommand: ParsedCommand) => Promise<void> | void;
}

const commandRegistry: CommandEntry[] = [
  {
    command: "project",
    subcommand: "analyze",
    description: "Analyzes and reports on the project's structure.",
    usage: "project analyze",
    handler: async () => {
      analyzeProjectStructure().then(report => {
        console.log(report);
      }).catch(error => {
        console.error(`Error during project analysis: ${(error as Error).message}`);
      });
    },
  },
  {
    command: "module",
    subcommand: "create",
    description: "Creates a new module with boilerplate files and updates the project manifest.",
    usage: "module create <name>",
    handler: async (parsedCommand: ParsedCommand) => {
      const moduleName = parsedCommand.args[0];
      if (!moduleName) {
        console.error("Error: Module name not provided for 'module create' command.");
        Deno.exit(1);
      }
      try {
        await scaffoldModule(moduleName);
      } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        Deno.exit(1);
      }
    },
  },
  {
    command: "file",
    subcommand: "create",
    description: "Creates a new file at the specified path with the given content.",
    usage: "file create <path> <content>",
    handler: async (parsedCommand: ParsedCommand) => {
      const filePath = parsedCommand.args[0];
      const content = parsedCommand.args.slice(1).join(" "); // Join remaining args as content
      if (!filePath || content === undefined) {
        console.error("Error: File path and content must be provided for 'file create' command.");
        Deno.exit(1);
      }
      try {
        await createFile(filePath, content);
      } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        Deno.exit(1);
      }
    },
  },
  {
    command: "file",
    subcommand: "edit",
    description: "Overwrites an existing file with new content.",
    usage: "file edit <path> <new-content>",
    handler: async (parsedCommand: ParsedCommand) => {
      const filePath = parsedCommand.args[0];
      const newContent = parsedCommand.args.slice(1).join(" "); // Join remaining args as new content
      if (!filePath || newContent === undefined) {
        console.error("Error: File path and new content must be provided for 'file edit' command.");
        Deno.exit(1);
      }
      try {
        await editFile(filePath, newContent);
      } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        Deno.exit(1);
      }
    },
  },
  {
    command: "goal",
    subcommand: "run",
    description: "Executes a high-level goal autonomously.",
    usage: "goal run \"<goal-string>\"",
    handler: async (parsedCommand: ParsedCommand) => {
      const goalString = parsedCommand.args.join(" "); // The entire remaining args form the goal string
      if (!goalString) {
        console.error("Error: Goal string not provided for 'goal run' command.");
        Deno.exit(1);
      }
      try {
        await runGoal(goalString);
      } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        Deno.exit(1);
      }
    },
  },
  {
    command: "help",
    subcommand: "", // Help command doesn't have a subcommand in this context
    description: "Displays help information for available commands.",
    usage: "help",
    handler: () => {
      console.log("Available Commands:");
      commandRegistry.forEach(entry => {
        console.log(`  ${entry.usage.padEnd(25)} - ${entry.description}`);
      });
    },
  },
];

const parsedCommand = parseArgs(Deno.args);

const matchedCommand = commandRegistry.find(
  (entry) =>
    entry.command === parsedCommand.command &&
    (entry.subcommand === parsedCommand.subcommand || (entry.command === "help" && parsedCommand.command === "help"))
);

if (matchedCommand) {
  matchedCommand.handler(parsedCommand);
} else {
  console.log(`Unknown command: '${parsedCommand.command}' '${parsedCommand.subcommand}'`);
  console.log("Run 'forge help' for a list of commands.");
}