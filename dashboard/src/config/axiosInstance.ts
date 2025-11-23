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
    if (typeof window !== "undefined") {
      // const session = await getSession();
      // const accessToken = session?.user?.accessToken as string | undefined;
      
      // Try to get token from localStorage
      const accessToken = localStorage.getItem("token") || localStorage.getItem("accessToken");
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
