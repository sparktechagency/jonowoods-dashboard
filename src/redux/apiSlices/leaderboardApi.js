import { api } from "../api/baseApi";

const leaderboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // PATCH: Update leaderboard status
    leaderboardStatusUpdate: builder.mutation({
      query: () => {
        return {
          url: "/admin/management/update-is-shown",
          method: "PATCH",
        };
      },
      invalidatesTags: ["Leaderboard"],
    }),

    getLeaderboardData: builder.query({
      query: () => {
        return {
          url: `/community/leaderboard`,
          method: "GET",
        };
      },
      providesTags: ["Leaderboard"],
    }),

    leaderboardStatusGlobalUpdate: builder.mutation({
      query: () => {
        return {
          url: `/admin/management/update-is-leaderboard-shown`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Leaderboard"],
    }),

    leaderboardGlobalStatus: builder.query({
      query: () => {
        return {
          url: `/preference/get-is-leaderboard-shown`,
          method: "GET",
        };
      },
      providesTags: ["Leaderboard"],
    }),
  }),
});

export const {
  useLeaderboardStatusUpdateMutation,
  useGetLeaderboardDataQuery,
  useLeaderboardStatusGlobalUpdateMutation,
  useLeaderboardGlobalStatusQuery,
} = leaderboardApi;
