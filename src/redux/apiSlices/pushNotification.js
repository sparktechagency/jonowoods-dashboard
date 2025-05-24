import { api } from "../api/baseApi";

const comingSoonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Create a new Coming Soon entry
    pushNotificationSend: builder.mutation({
      query: (data) => {
        return {
          url: "/admin/notifications/send-notification",
          method: "POST",
          body: data,
        };
      },
    }),




    
  }),
});

export const {
  usePushNotificationSendMutation,
} = comingSoonApi;
