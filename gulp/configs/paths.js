import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildFolder = 'dist';
const srcFolder = 'src';
const rootDir = path.resolve(__dirname, '../../');

export const paths = {
  build: buildFolder,
  src: srcFolder,
  root: rootDir,
};
