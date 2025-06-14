import { api } from "../api/baseApi";

const comingSoonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Create a new Coming Soon entry
    newDailyChallenge: builder.mutation({
      query: (data) => ({
        url: "/admin/challenge/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DailyChallenge"], 
    }),

    // GET: Retrieve all Coming Soon entries
    getDailyChallenge: builder.query({
      query: () => ({
        url: "/admin/challenge",
        method: "GET",
      }),
      providesTags: ["DailyChallenge"], 
    }),

    // GET: Single Challenge
    getSingleDailyChallenge: builder.query({
      query: (id) => ({
        url: `/admin/challenge/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DailyChallenge", id }], 
    }),

    // PATCH: Update a Coming Soon entry
    updateDailyChallenge: builder.mutation({
      query: ({ id, comingSoonData }) => ({
        url: `/admin/challenge/${id}`,
        method: "PATCH",
        body: comingSoonData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DailyChallenge", id },
        "DailyChallenge",
      ],
    }),

    // DELETE: Delete a Coming Soon entry
    deleteDailyChallege: builder.mutation({
      query: (id) => ({
        url: `/admin/challenge/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DailyChallenge", id },
        "DailyChallenge",
      ],
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
