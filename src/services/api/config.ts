const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const API_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1"
);

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL ||
    API_URL.replace(/\/api\/v\d+$/, "")
);

export const API_WORKER_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL_WORKER || API_URL
);

export const API_KEY = import.meta.env.VITE_API_KEY;
