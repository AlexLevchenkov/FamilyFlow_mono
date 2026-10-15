import jwt, { SignOptions } from 'jsonwebtoken';

export const generateAccessToken = (userId: number) => {
  const secret = process.env.ACCESS_SECRET;
  const signOptions = {
    expiresIn: `${process.env.ACCESS_EXPIRES_IN}m`,
    algorithm: 'HS256',
    issuer: 'familyflow-api',
    audience: 'familyflow-client',
  } as SignOptions;

  if (!secret || !signOptions || !signOptions.expiresIn) {
    throw new Error('ACCESS_SECRET or ACCESS_EXPIRES_IN is not defined');
  }

  return jwt.sign({ userId }, secret, signOptions);
};

export const generateRefreshToken = (userId: number, jti: string) => {
  const secret = process.env.REFRESH_SECRET;
  const signOptions = {
    expiresIn: `${process.env.REFRESH_EXPIRES_IN}d`,
    algorithm: 'HS256',
    issuer: 'familyflow-api',
    audience: 'familyflow-client',
    jwtid: jti,
  } as SignOptions;

  if (!secret) {
    throw new Error('REFRESH_SECRET is not defined');
  }

  if (!signOptions || !signOptions.expiresIn) {
    throw new Error('REFRESH_EXPIRES_IN is not defined');
  }

  return jwt.sign({ userId }, secret, signOptions);
};

export const getDataFromAccessToken = (token: string) => {
  const secret = process.env.ACCESS_SECRET;
  if (!secret) {
    throw new Error('ACCESS_SECRET is not defined');
  }

  const data = jwt.verify(token, secret, {
    issuer: 'familyflow-api',
    audience: 'familyflow-client',
  });

  return data;
};

export const getDataFromRefreshToken = (token: string) => {
  const secret = process.env.REFRESH_SECRET;
  if (!secret) {
    throw new Error('REFRESH_SECRET is not defined');
  }

  const data = jwt.verify(token, secret, {
    issuer: 'familyflow-api',
    audience: 'familyflow-client',
  });

  return data;
};
