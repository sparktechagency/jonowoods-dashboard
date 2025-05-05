import { api } from "../api/baseApi";

const videoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Create a new video
    addVideo: builder.mutation({
      query: (data) => {
        return {
          url: "/admin/videos/managment/upload-video",
          method: "POST",
          body: data,
        };
      },
    }),

    // GET: Retrieve all videos
    getAllVideos: builder.query({
      query: () => {
        return {
          url: "/admin/videos/managment/videos",
          method: "GET",
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),

    getVideoById: builder.query({
      query: (id) => {
        return {
          url: `/videos/${id}`,
          method: "GET",
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),

    // PATCH: Update an existing video
    updateVideo: builder.mutation({
      query: ({ id, videoData }) => {
        return {
          url: `/videos/update/${id}`,
          method: "PATCH",
          body: videoData,
        };
      },
    }),

    // DELETE: Delete a video
    deleteVideo: builder.mutation({
      query: (id) => {
        return {
          url: `/admin/videos/managment/video-delete/${id}`,
          method: "DELETE",
        };
      },
    }),

    // NEW: Toggle video status (active/inactive)
    updateVideoStatus: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `/admin/videos/managment/video-status/${id}`,
          method: "PUT",
          body: { status },
        };
      },
    }),
  }),
});

export const {
  useAddVideoMutation,
  useGetAllVideosQuery,
  useGetVideoByIdQuery,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useUpdateVideoStatusMutation, 
} = videoApi;
