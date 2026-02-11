const isProduction = process.env.NODE_ENV === "production";

const normalizeBaseUrl = (value) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const apiBaseUrl = normalizeBaseUrl(
  process.env.REACT_APP_API_BASE_URL ||
    (isProduction ? "" : "http://127.0.0.1:8000")
);

const uploadsBaseUrl = normalizeBaseUrl(
  process.env.REACT_APP_UPLOADS_BASE_URL || apiBaseUrl
);

export const server = `${apiBaseUrl}/api/v2`;
export const backend_url = `${uploadsBaseUrl}/uploads/`;
export const socket_server = process.env.REACT_APP_SOCKET_URL || "";
