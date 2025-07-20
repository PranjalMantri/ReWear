import { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  _id: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}
