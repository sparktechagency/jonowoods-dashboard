import { api } from "../api/baseApi";

const challengeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Create a new Challenge
    newDailyChallenge: builder.mutation({
      query: (data) => ({
        url: "/admin/challenge/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DailyChallenge"], 
    }),
    
    // POST: Create a new Challenge with videos
    createChallengeWithVideos: builder.mutation({
      query: (data) => ({
        url: "/admin/challenge/create-with-videos",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DailyChallenge", "Videos"],
    }),

    // GET: Retrieve all Challenges
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
    
    // GET: Get Challenge Videos
    getChallengeVideos: builder.query({
      query: (id) => ({
        url: `/admin/challenge/${id}/videos`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DailyChallenge", id }, "Videos"],
    }),

    // PATCH: Update a Challenge
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

    // DELETE: Delete a Challenge
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
    
    // POST: Add video to challenge
    addVideoToChallenge: builder.mutation({
      query: ({ challengeId, videoId }) => ({
        url: `/admin/challenge/${challengeId}/videos`,
        method: "POST",
        body: { videoId },
      }),
      invalidatesTags: (result, error, { challengeId }) => [
        { type: "DailyChallenge", id: challengeId },
        "DailyChallenge",
      ],
    }),
    
    // DELETE: Remove video from challenge
    removeVideoFromChallenge: builder.mutation({
      query: ({ challengeId, videoId }) => ({
        url: `/admin/challenge/${challengeId}/videos/${videoId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { challengeId }) => [
        { type: "DailyChallenge", id: challengeId },
        "DailyChallenge",
      ],
    }),
    
    // PUT: Update video order in challenge
    updateVideoOrder: builder.mutation({
      query: ({ challengeId, videoOrder }) => ({
        url: `/admin/challenge/${challengeId}/video-order`,
        method: "PUT",
        body: { videoOrder },
      }),
      invalidatesTags: (result, error, { challengeId }) => [
        { type: "DailyChallenge", id: challengeId },
        "DailyChallenge",
      ],
    }),
    
    // POST: Schedule video rotation
    scheduleVideoRotation: builder.mutation({
      query: (scheduleData) => ({
        url: `/admin/challenge/schedule`,
        method: "POST",
        body: scheduleData,
      }),
      invalidatesTags: ["DailyChallenge"],
    }),
  }),
});

export const {
  useGetDailyChallengeQuery,
  useNewDailyChallengeMutation,
  useGetSingleDailyChallengeQuery,
  useUpdateDailyChallengeMutation,
  useDeleteDailyChallegeMutation,
  // New exports
  useCreateChallengeWithVideosMutation,
  useGetChallengeVideosQuery,
  useAddVideoToChallengeMutation,
  useRemoveVideoFromChallengeMutation,
  useUpdateVideoOrderMutation,
  useScheduleVideoRotationMutation,
} = challengeApi;
