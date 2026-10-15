import { randomBytes } from 'crypto';
import { updateEnvFile } from './envFileWriter';

export interface Keys {
  access: string;
  refresh: string;
  previousAccess?: string;
  previousRefresh?: string;
}

class KeyRotation {
  private keys: Keys;
  private lastRotation: Date | null;
  private readonly ROTATION_INTERVAL: number;

  constructor() {
    this.keys = {
      access: process.env.ACCESS_SECRET || this.generateKey(),
      refresh: process.env.REFRESH_SECRET || this.generateKey(),
      previousAccess: process.env.PREVIOUS_ACCESS_SECRET,
      previousRefresh: process.env.PREVIOUS_REFRESH_SECRET,
    };
    this.lastRotation = process.env.LAST_ROTATION
      ? new Date(process.env.LAST_ROTATION)
      : null;
    this.ROTATION_INTERVAL =
      Number(process.env.REFRESH_EXPIRES_IN || 30) * 24 * 60 * 60 * 1000;
  }

  private generateKey(): string {
    return randomBytes(64).toString('hex');
  }

  public async rotateKeys(): Promise<void> {
    this.keys.previousAccess = this.keys.access;
    this.keys.previousRefresh = this.keys.refresh;

    this.keys.access = this.generateKey();
    this.keys.refresh = this.generateKey();
    this.lastRotation = new Date();

    process.env.ACCESS_SECRET = this.keys.access;
    process.env.REFRESH_SECRET = this.keys.refresh;
    process.env.PREVIOUS_ACCESS_SECRET = this.keys.previousAccess;
    process.env.PREVIOUS_REFRESH_SECRET = this.keys.previousRefresh;
    process.env.LAST_ROTATION = this.lastRotation.toISOString();

    updateEnvFile({
      ACCESS_SECRET: this.keys.access,
      REFRESH_SECRET: this.keys.refresh,
      PREVIOUS_ACCESS_SECRET: this.keys.previousAccess,
      PREVIOUS_REFRESH_SECRET: this.keys.previousRefresh,
      LAST_ROTATION: this.lastRotation.toISOString(),
    });
  }

  // Check if rotation is needed
  public async checkAndRotate(): Promise<void> {
    if (!this.lastRotation) {
      this.lastRotation = new Date('1970-01-01T00:00:00Z');
    }

    const now = new Date();
    const timeSinceLastRotation = now.getTime() - this.lastRotation.getTime();

    if (timeSinceLastRotation >= this.ROTATION_INTERVAL) {
      await this.rotateKeys();
    }
  }

  public getCurrentKeys(): Pick<Keys, 'access' | 'refresh'> {
    return {
      access: this.keys.access,
      refresh: this.keys.refresh,
    };
  }

  public getPreviousKeys(): Pick<Keys, 'previousAccess' | 'previousRefresh'> {
    return {
      previousAccess: this.keys.previousAccess,
      previousRefresh: this.keys.previousRefresh,
    };
  }
}

export default new KeyRotation();
