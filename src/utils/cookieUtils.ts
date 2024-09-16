import { Cookies } from "react-cookie";

const cookies = new Cookies();

/**
 * Retrieve a cookie by its name
 * @param cookieName - The name of the cookie to retrieve
 * @returns {string | undefined} - The value of the cookie
 */
export const getCookie = (cookieName: string): string | undefined => {
  return cookies.get(cookieName);
};

/**
 * Set a cookie with a specified name and value
 * @param cookieName - The name of the cookie to set
 * @param value - The value of the cookie
 * @param options - Optional configurations for setting the cookie
 */
export const setCookie = (cookieName: string, value: string, options = {}) => {
  cookies.set(cookieName, value, { path: "/", ...options });
};

/**
 * Remove a cookie by its name
 * @param cookieName - The name of the cookie to remove
 */
export const removeCookie = (cookieName: string) => {
  cookies.remove(cookieName, { path: "/" });
};
