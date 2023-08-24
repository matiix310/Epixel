import jwt from "jsonwebtoken";

type JwtBody = {
  iat?: number;
  exp?: number;
  token: string;
  refreshToken: string;
  username: string;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Variable JWT_SECRET is not set in environment variables.");
  }

  return secret;
};

const generateJwt = (jwtBody: JwtBody, expiresIn?: number) => {
  const secret = getJwtSecret();
  const token = expiresIn
    ? jwt.sign(jwtBody, secret, { expiresIn })
    : jwt.sign(jwtBody, secret);

  return token;
};

const readJwt = (token: string): JwtBody | undefined => {
  const secret = getJwtSecret();
  try {
    const jwtBody = jwt.verify(token, secret) as JwtBody;
    return jwtBody;
  } catch (error) {
    return;
  }
};

const isValidJwt = (token: string): boolean => {
  try {
    jwt.verify(token, getJwtSecret());
    return true;
  } catch (error) {
    return false;
  }
};

export { generateJwt, readJwt, isValidJwt };
export type { JwtBody };
