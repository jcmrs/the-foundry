// forge.ts

import { parseArgs } from "./src/modules/command-parser/main.ts";
import { analyzeProjectStructure } from "./src/modules/analysis-engine/main.ts";

const parsedCommand = parseArgs(Deno.args);

if (parsedCommand.command === "project" && parsedCommand.subcommand === "analyze") {
  analyzeProjectStructure().then(report => {
    console.log(report);
  }).catch(error => {
    console.error(`Error during project analysis: ${(error as Error).message}`);
  });
} else {
  console.log(`Command: '${parsedCommand.command}', Subcommand: '${parsedCommand.subcommand}', Args: [${parsedCommand.args.map(arg => `'${arg}'`).join(', ')}]`);
}
