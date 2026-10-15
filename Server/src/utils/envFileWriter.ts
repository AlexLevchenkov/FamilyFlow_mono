import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const ENV_PATH = join(process.cwd(), '.env');

export function updateEnvFile(vars: Record<string, string | undefined>) {
  let envContent = '';
  if (existsSync(ENV_PATH)) {
    envContent = readFileSync(ENV_PATH, 'utf-8');
  }
  const envLines = envContent.split('\n').filter(Boolean);
  const envObj: Record<string, string> = {};
  envLines.forEach(line => {
    const [key, ...rest] = line.split('=');
    envObj[key] = rest.join('=');
  });
  Object.entries(vars).forEach(([key, value]) => {
    if (value !== undefined) {
      envObj[key] = value;
    }
  });
  const newContent = Object.entries(envObj)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  writeFileSync(ENV_PATH, newContent);
}
