import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.60.126:7000/api/v1",
    // baseUrl: "http://69.62.67.86:7000/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "User",
    "Contact",
    "Video",
    "Category",
    "Package",
    "DailyVideo",
    "DailyChallenge",
    "DailyInspiration",
    "Admin",
    "Notification",
  ],
  endpoints: () => ({}),
});

export const imageUrl = "http://10.0.60.126:7000";
// export const imageUrl = "http://69.62.67.86:7000";
