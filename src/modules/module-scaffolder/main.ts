// src/modules/module-scaffolder/main.ts

/**
 * Scaffolds a new module with boilerplate files and updates the project manifest.
 * @param moduleName The name of the module to scaffold.
 */
export async function scaffoldModule(moduleName: string): Promise<void> {
  if (!moduleName) {
    throw new Error("Module name not provided.");
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
    throw error; // Re-throw to be handled by the caller (forge.ts)
  }
}
