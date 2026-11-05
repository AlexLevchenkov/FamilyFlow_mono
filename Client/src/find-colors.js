import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const colors = new Set();
const regex = /#[0-9a-fA-F]{3,8}\b/g;

function scanDirectory(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        scanDirectory(fullPath);
      }
    } else {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(regex);

        if (matches) {
          matches.forEach(color => colors.add(color.toLowerCase()));
        }
      } catch {}
    }
  }
}

scanDirectory(rootDir);

console.log([...colors].join(', '));
