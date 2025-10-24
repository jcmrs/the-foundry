// forge.ts

import { parseArgs } from "./src/modules/command-parser/main.ts";
import { analyzeProjectStructure } from "./src/modules/analysis-engine/main.ts";
import { scaffoldModule } from "./src/modules/module-scaffolder/main.ts";

const parsedCommand = parseArgs(Deno.args);

if (parsedCommand.command === "project" && parsedCommand.subcommand === "analyze") {
  analyzeProjectStructure().then(report => {
    console.log(report);
  }).catch(error => {
    console.error(`Error during project analysis: ${(error as Error).message}`);
  });
} else if (parsedCommand.command === "module" && parsedCommand.subcommand === "create") {
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
} else {
  console.log(`Command: '${parsedCommand.command}', Subcommand: '${parsedCommand.subcommand}', Args: [${parsedCommand.args.map(arg => `'${arg}'`).join(', ')}]`);
}
