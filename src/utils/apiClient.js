// Centralized API Client & JWT Token Manager

export const AUTH_TOKEN_KEY = 'kalpanaaa_auth_token';

/**
 * Retrieves the stored JWT authentication token from localStorage.
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || '';
  } catch (e) {
    return '';
  }
};

/**
 * Stores or removes the JWT authentication token in localStorage.
 */
export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (e) {}
};

/**
 * Constructs request headers including Authorization Bearer token when available.
 */
export const getAuthHeaders = (extraHeaders = {}) => {
  const token = getAuthToken();
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Authenticated Fetch Wrapper that automatically attaches Authorization Bearer headers.
 */
export const authenticatedFetch = async (url, options = {}) => {
  const headers = getAuthHeaders(options.headers || {});
  const config = { ...options, headers };

  try {
    const response = await fetch(url, config);
    if (response.status === 401) {
      console.warn(`[API Auth] 401 Unauthorized returned from ${url}. Token may be invalid or missing.`);
    } else if (response.status === 403) {
      console.warn(`[API Auth] 403 Forbidden returned from ${url}. User lacks required role permissions.`);
    }
    return response;
  } catch (err) {
    console.error(`[API Network Error] Failed fetch request to ${url}:`, err);
    throw err;
  }
};
