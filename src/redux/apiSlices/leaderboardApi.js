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

    // GET: Get all push notifications with filtering and pagination
        getLeaderboardData: builder.query({
      query: () => {
        return {
          url: `/community/leaderboard`,
          method: "GET",
        };
      },
      providesTags: ["Leaderboard"],
    }),
    
  }),
});

export const { useLeaderboardStatusUpdateMutation, useGetLeaderboardDataQuery } = leaderboardApi;
