const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiCall = async (
  endpoint: string,
  options?: RequestInit
) => {
  const url = `${API_URL}${endpoint}`;
  return fetch(url, options);
};

export const apiGet = (endpoint: string) => {
  return apiCall(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const apiPost = (endpoint: string, body: any) => {
  return apiCall(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

export const apiDelete = (endpoint: string) => {
  return apiCall(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
};
