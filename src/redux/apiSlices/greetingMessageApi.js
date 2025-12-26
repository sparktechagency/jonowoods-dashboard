import { api } from "../api/baseApi";

const greetingMessageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Send push notification
    greetingMessageSend: builder.mutation({
      query: (data) => {
        return {
          url: "/admin/management/update-greeting",
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["GreetingMessage"],
    }),

    // GET: Get all push notifications with filtering and pagination
    getGreetingMessage: builder.query({
      query: () => {
        return {
          url: `/admin/management/get-preference`,
          method: "GET",
        };
      },
      providesTags: ["GreetingMessage"],
    }),
    
  }),
});

export const { useGreetingMessageSendMutation, useGetGreetingMessageQuery } = greetingMessageApi;
