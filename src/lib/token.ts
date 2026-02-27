import { jwtDecode, type JwtPayload } from "jwt-decode";

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    if (typeof decodedToken.exp === "undefined") {
      return false;
    }

    return decodedToken.exp > currentTime;
  } catch (error) {
    return false;
  }
};
