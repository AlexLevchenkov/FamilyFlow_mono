import jwt, { DecodeOptions, SignOptions } from "jsonwebtoken";

export const generateAccessToken = (userId: number) => {
  const secret = process.env.ACCESS_SECRET;
  const expiresIn = `${process.env.ACCESS_EXPIRES_IN}m`;

  if (!secret || !expiresIn) {
    return;
  }

  return jwt.sign({ userId }, secret, { expiresIn } as SignOptions);
}

export const generateRefreshToken = (userId: number) => {
  const secret = process.env.REFRESH_SECRET;
  const expiresIn = `${process.env.REFRESH_EXPIRES_IN}d`;

  if (!secret || !expiresIn) {
    return;
  }

  return jwt.sign({ userId }, secret, { expiresIn } as SignOptions);
}

export const getDataFromAccessToken = (token: string) => {
  const secret = process.env.ACCESS_SECRET;
  if (!secret) return;

  const data = jwt.verify(token, secret)

  return data
}

export const getDataFromRefreshToken = (token: string) => {
  const secret = process.env.REFRESH_SECRET;
  if (!secret) return;

  const data = jwt.verify(token, secret)

  return data
}