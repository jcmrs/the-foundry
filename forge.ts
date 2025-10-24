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
} else if (parsedCommand.command === "module" && parsedCommand.subcommand === "create") {
  const moduleName = parsedCommand.args[0];
  if (!moduleName) {
    console.error("Error: Module name not provided for 'module create' command.");
    Deno.exit(1);
  }

  const modulePath = `src/modules/${moduleName}`;
  const mainTsContent = `// ${modulePath}/main.ts\n\nexport function placeholder(): string {\n  return "This is a placeholder function for ${moduleName}.";\n}\n`;
  const mainTestTsContent = `// ${modulePath}/main_test.ts\n\nimport { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";\nimport { placeholder } from "./main.ts";\n\nDeno.test("placeholder function returns correct string", () => {\n  assertEquals(placeholder(), "This is a placeholder function for ${moduleName}.");\n});\n`;

  try {
    // Create module directory
    await Deno.mkdir(modulePath, { recursive: true });

    // Create boilerplate files
    await Deno.writeTextFile(`${modulePath}/main.ts`, mainTsContent);
    await Deno.writeTextFile(`${modulePath}/main_test.ts`, mainTestTsContent);

    // Update foundry.jsonc
    const manifestPath = "foundry.jsonc";
    const manifestContent = await Deno.readTextFile(manifestPath);
    const manifest = JSON.parse(manifestContent);

    manifest.modules.push({
      name: moduleName,
      path: modulePath,
    });

    await Deno.writeTextFile(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`Module '${moduleName}' created successfully.`);
  } catch (error) {
    console.error(`Error creating module '${moduleName}': ${(error as Error).message}`);
    Deno.exit(1);
  }
} else {
  console.log(`Command: '${parsedCommand.command}', Subcommand: '${parsedCommand.subcommand}', Args: [${parsedCommand.args.map(arg => `'${arg}'`).join(', ')}]`);
}
