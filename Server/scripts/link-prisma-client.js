const fs = require('fs');
const path = require('path');

function ensurePrismaClientSymlink() {
  const projectRoot = path.resolve(__dirname, '..');
  const generated = path.join(projectRoot, 'node_modules', '.prisma');
  const targetDir = path.join(
    projectRoot,
    'node_modules',
    '@prisma',
    'client',
    '.prisma'
  );

  if (!fs.existsSync(generated)) {
    throw new Error(
      `Expected generated Prisma client at "${generated}". Run "npm run prisma:generate" first.`
    );
  }

  // If it already exists (dir or symlink), leave it alone.
  if (fs.existsSync(targetDir)) return;

  fs.mkdirSync(path.dirname(targetDir), { recursive: true });

  // On Windows, "junction" is the most reliable.
  const type = process.platform === 'win32' ? 'junction' : 'dir';
  fs.symlinkSync(generated, targetDir, type);
}

try {
  ensurePrismaClientSymlink();
  console.log('✅ Linked @prisma/client/.prisma to node_modules/.prisma');
} catch (err) {
  console.error('❌ Failed to link Prisma client types:', err);
  process.exitCode = 1;
}
