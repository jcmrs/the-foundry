// forge.ts

import { parseArgs } from "./src/modules/command-parser/main.ts";

const parsedCommand = parseArgs(Deno.args);

console.log(`Command: '${parsedCommand.command}', Subcommand: '${parsedCommand.subcommand}', Args: [${parsedCommand.args.map(arg => `'${arg}'`).join(', ')}]`);
