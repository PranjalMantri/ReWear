import jwt from "jsonwebtoken";

const createAccessToken = (payload: jwt.JwtPayload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload: jwt.JwtPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export { verifyToken, createAccessToken, createRefreshToken };
