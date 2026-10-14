import keyRotationService from './keyRotation';
import { updateEnvFile } from './envFileWriter';

jest.mock('./envFileWriter', () => ({
  updateEnvFile: jest.fn(),
}));

describe('KeyRotation Service', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let originalKeys: any;
  let originalLastRotation: Date | null;

  beforeAll(() => {
    originalEnv = { ...process.env };
    originalKeys = { ...(keyRotationService as any).keys };
    originalLastRotation = (keyRotationService as any).lastRotation;
  });

  afterAll(() => {
    process.env = originalEnv;
    (keyRotationService as any).keys = originalKeys;
    (keyRotationService as any).lastRotation = originalLastRotation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return current keys', () => {
    const current = keyRotationService.getCurrentKeys();
    expect(current).toHaveProperty('access');
    expect(current).toHaveProperty('refresh');
    expect(current.access).toBe((keyRotationService as any).keys.access);
    expect(current.refresh).toBe((keyRotationService as any).keys.refresh);
  });

  it('should return previous keys', () => {
    const previous = keyRotationService.getPreviousKeys();
    expect(previous).toHaveProperty('previousAccess');
    expect(previous).toHaveProperty('previousRefresh');
  });

  it('should rotate keys successfully', async () => {
    const oldKeys = { ...keyRotationService.getCurrentKeys() };

    await keyRotationService.rotateKeys();

    const newKeys = keyRotationService.getCurrentKeys();
    const prevKeys = keyRotationService.getPreviousKeys();

    expect(newKeys.access).not.toBe(oldKeys.access);
    expect(newKeys.refresh).not.toBe(oldKeys.refresh);

    expect(prevKeys.previousAccess).toBe(oldKeys.access);
    expect(prevKeys.previousRefresh).toBe(oldKeys.refresh);

    expect(process.env.ACCESS_SECRET).toBe(newKeys.access);
    expect(process.env.REFRESH_SECRET).toBe(newKeys.refresh);
    expect(process.env.PREVIOUS_ACCESS_SECRET).toBe(prevKeys.previousAccess);
    expect(process.env.PREVIOUS_REFRESH_SECRET).toBe(prevKeys.previousRefresh);

    expect(updateEnvFile).toHaveBeenCalledWith({
      ACCESS_SECRET: newKeys.access,
      REFRESH_SECRET: newKeys.refresh,
      PREVIOUS_ACCESS_SECRET: prevKeys.previousAccess,
      PREVIOUS_REFRESH_SECRET: prevKeys.previousRefresh,
      LAST_ROTATION: expect.any(String),
    });
  });

  it('should not rotate keys if ROTATION_INTERVAL has not passed', async () => {
    (keyRotationService as any).lastRotation = new Date();
    const rotateSpy = jest.spyOn(keyRotationService, 'rotateKeys');

    await keyRotationService.checkAndRotate();

    expect(rotateSpy).not.toHaveBeenCalled();
    rotateSpy.mockRestore();
  });

  it('should rotate keys if ROTATION_INTERVAL has passed', async () => {
    const longAgo = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
    (keyRotationService as any).lastRotation = longAgo;
    const rotateSpy = jest.spyOn(keyRotationService, 'rotateKeys').mockImplementation(async () => {});

    await keyRotationService.checkAndRotate();

    expect(rotateSpy).toHaveBeenCalled();
    rotateSpy.mockRestore();
  });
});
