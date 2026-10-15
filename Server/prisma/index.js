const { readdirSync, readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const basePath = join(__dirname, '../src/models/base.prisma');
const base = existsSync(basePath) ? readFileSync(basePath, 'utf-8') : '';

function getAllPrismaFiles(dir) {
  const files = [];
  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllPrismaFiles(fullPath));
    } else if (
      item.isFile() &&
      item.name.endsWith('.prisma') &&
      item.name !== 'base.prisma'
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

const modelsDir = join(__dirname, '../src/models');
const modelFiles = getAllPrismaFiles(modelsDir).map(f =>
  readFileSync(f, 'utf-8')
);

const schema = [base, ...modelFiles].join('\n\n');

writeFileSync(join(__dirname, './schema.prisma'), schema);

console.log('✅ schema.prisma successfully compiled.');
