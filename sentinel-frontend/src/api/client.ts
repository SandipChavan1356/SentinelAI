import axios, { AxiosError } from "axios";

/**
 * In local dev, leave VITE_API_BASE_URL unset — requests go to the
 * relative "/api/v1" path, which vite.config.ts proxies to your Express
 * backend (see VITE_DEV_PROXY_TARGET in .env). This sidesteps CORS
 * entirely while developing.
 *
 * For a production build (frontend and backend on different origins),
 * set VITE_API_BASE_URL to the full deployed API URL, e.g.
 * https://sentinel-api.onrender.com/api/v1 — and make sure the backend
 * has app.use(cors()) enabled (see README).
 */
const baseURL = import.meta.env.VITE_API_BASE_URL?.trim() || "/api/v1";

export const client = axios.create({
  baseURL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export class ApiRequestError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

/**
 * The backend's asyncHandler forwards thrown ApiError instances to
 * next(err), but no global error-handling middleware is registered in
 * app.ts — so failures currently fall through to Express's default
 * handler instead of the custom { statusCode, message, success } shape.
 * This normalizer copes with both: a proper JSON envelope, or whatever
 * Express's default handler sends back (HTML / plain text / empty body).
 */
export function normalizeError(error: unknown): ApiRequestError {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string }>;
    const status = err.response?.status;
    const data = err.response?.data;

    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      return new ApiRequestError(data.message, status);
    }
    if (err.code === "ECONNABORTED") {
      return new ApiRequestError("Request timed out. The backend took too long to respond.", status);
    }
    if (!err.response) {
      return new ApiRequestError(
        "Can't reach the Sentinel backend. Check that your API server is running and the proxy target / VITE_API_BASE_URL is correct.",
        undefined
      );
    }
    return new ApiRequestError(err.response.statusText || `Request failed with status ${status}`, status);
  }
  if (error instanceof Error) return new ApiRequestError(error.message);
  return new ApiRequestError("Something went wrong.");
}
