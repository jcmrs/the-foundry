// src/modules/file-manager/main.ts

/**
 * Creates a new file at the specified path with the given content.
 * Creates necessary parent directories if they don't exist.
 * @param filePath The path to the file to create.
 * @param content The content to write to the file.
 */
export async function createFile(filePath: string, content: string): Promise<void> {
  try {
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    if (dirPath) {
      await Deno.mkdir(dirPath, { recursive: true });
    }
    await Deno.writeTextFile(filePath, content);
    console.log(`File created: ${filePath}`);
  } catch (error) {
    console.error(`Error creating file ${filePath}: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Overwrites the content of an existing file at the specified path with the new content.
 * @param filePath The path to the file to edit.
 * @param newContent The new content to write to the file.
 */
export async function editFile(filePath: string, newContent: string): Promise<void> {
  try {
    await Deno.writeTextFile(filePath, newContent);
    console.log(`File edited: ${filePath}`);
  } catch (error) {
    console.error(`Error editing file ${filePath}: ${(error as Error).message}`);
    throw error;
  }
}
