import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.60.126:7000/api/v1",
    // baseUrl: "http://192.168.10.195:5000/api"
  }),
  endpoints: () => ({}),
});

// export const imageUrl = "http://10.0.60.126:7000";
export const imageUrl = "http://10.0.60.126:7000";
