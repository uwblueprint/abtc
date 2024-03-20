export type Role = "VOLUNTEER" | "ADMIN";

export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User"; // TODO: change to type Role when ready
  accessToken: string;
} | null;

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };
