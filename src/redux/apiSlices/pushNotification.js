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


    // pushNotificationSend: builder.mutation({
    //   query: (data) => {
    //     return {
    //       url: "/admin/notifications/get-notification",
    //       method: "GET",
    //       body: data,
    //     };
    //   },
    // }),




    
  }),
});

export const {
  usePushNotificationSendMutation,
} = comingSoonApi;
