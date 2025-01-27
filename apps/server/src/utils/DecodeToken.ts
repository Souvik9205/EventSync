import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./Secret";

/**
 * Decodes a JWT and extracts the userId.
 * @param token The JWT token to decode.
 * @returns The userId extracted from the token.
 * @throws Will throw an error if the token is invalid or expired.
 */
export function decodeToken(token: string): string {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || JWT_SECRET
    ) as jwt.JwtPayload;

    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token payload");
    }

    return decoded.userId;
  } catch (error) {
    console.error("Token decoding error:", error);
    throw new Error("Invalid or expired token");
  }
}
