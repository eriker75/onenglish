import axios from "axios";
// import { getSession } from "next-auth/react";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

const api = axios.create({
  baseURL: BACKEND_URL + "/api/v1",
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    console.log("📤 [API REQUEST]", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data instanceof FormData ? "FormData" : config.data,
    });

    if (typeof window !== "undefined") {
      // const session = await getSession();
      // const accessToken = session?.user?.accessToken as string | undefined;

      // Try to get token from localStorage
      const accessToken = localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log("🔑 [API REQUEST] Token added to headers");
      } else {
        console.warn("⚠️ [API REQUEST] No token found in localStorage");
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ [API REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("📥 [API RESPONSE]", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ [API RESPONSE ERROR]", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

export default api;
