import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hygenx-hr-super-secret-jwt-key-2026"
);

const ALGORITHM = "HS256";
const EXPIRY = "1h"; // 1-hour sessions

/**
 * Sign a JWT with the given payload.
 * @param {Object} payload - The data to encode (role, username, name, etc.)
 * @returns {Promise<string>} Signed JWT string
 */
export async function signJWT(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);
}

/**
 * Verify and decode a JWT token.
 * @param {string} token - The JWT string to verify
 * @returns {Promise<Object|null>} Decoded payload or null if invalid
 */
export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}
