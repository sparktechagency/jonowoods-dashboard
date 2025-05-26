import { api } from "../api/baseApi";

const comingSoonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Create a new Coming Soon entry
    newDailyChallenge: builder.mutation({
      query: (data) => {
        return {
          url: "/admin/challenge/create",
          method: "POST",
          body: data,
        };
      },
    }),

    // GET: Retrieve all Coming Soon entries
    getDailyChallenge: builder.query({
      query: () => {
        return {
          url: "/admin/challenge",
          method: "GET",
        };
      },
      // transformResponse: ({ data }) => {
      //   return data;
      // },
    }),

    getSingleDailyChallenge: builder.query({
      query: (id) => `/admin/challenge/${id}`,
      method: "GET",
    }),

    // PATCH: Update a Coming Soon entry
    updateDailyChallenge: builder.mutation({
      query: ({ id, comingSoonData }) => {
        return {
          url: `/admin/challenge/${id}`,
          method: "PATCH",
          body: comingSoonData,
        };
      },
    }),

    // DELETE: Delete a Coming Soon entry
    deleteDailyChallege: builder.mutation({
      query: (id) => {
        return {
          url: `/admin/challenge/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
    useGetDailyChallengeQuery,
    useNewDailyChallengeMutation,
    useGetSingleDailyChallengeQuery,
    useUpdateDailyChallengeMutation,
    useDeleteDailyChallegeMutation,
} = comingSoonApi;
