// src/modules/config-manager/main.ts

/**
 * Loads and parses the foundry.jsonc file from the project root.
 * @returns The parsed Project Manifest object.
 */
export async function loadProjectManifest(): Promise<any> {
  try {
    const manifestPath = "foundry.jsonc"; // Assuming it's in the project root
    const content = await Deno.readTextFile(manifestPath);
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading project manifest: ${(error as Error).message}`);
    throw error;
  }
}
