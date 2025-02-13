import { GeorefUnidade } from "types/georef";
import { User } from "types/user";

type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

/**
 * Authentication Data
 */
export const saveAuthData = (obj: LoginResponse) => {
  localStorage.setItem("authData", JSON.stringify(obj));
};

export const getAuthData = () => {
  const str = localStorage.getItem("authData") ?? "{}";
  return JSON.parse(str) as LoginResponse;
};

export const removeAuthData = () => {
  localStorage.removeItem("authData");
};

/**
 * User Data
 */
export const saveUserData = (obj: User) => {
  localStorage.setItem("userData", JSON.stringify(obj));
};

export const getUserData = () => {
  const str = localStorage.getItem("userData") ?? "{}";
  return JSON.parse(str) as User;
};

export const removeUserData = () => {
  localStorage.removeItem("userData");
};

/**
 * GeoRef Data
 */
export const saveGeoRefData = (data: GeorefUnidade[]) => {
  localStorage.setItem("geoRef", JSON.stringify(data));
};

export const getGeoRefData = () => {
  const str = localStorage.getItem("geoRef") ?? "{}";
  return JSON.parse(str) as GeorefUnidade;
};

export const removeGeoRefData = () => {
  localStorage.removeItem("geoRef");
};
