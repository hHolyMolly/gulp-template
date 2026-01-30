import fs from 'fs/promises';

export const clean = async () => {
  try {
    await fs.rm(app.paths.build, { recursive: true, force: true });
  } catch {
    // Directory doesn't exist, ignore
  }
};
